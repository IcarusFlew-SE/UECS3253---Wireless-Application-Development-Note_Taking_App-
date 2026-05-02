const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PATCH', 'DELETE'] },
});

app.use(cors());
app.use(express.json());

const users = new Map();
const now = () => Date.now();

function getUserNotes(userId) {
  if (!users.has(userId)) users.set(userId, new Map());
  return users.get(userId);
}

function normalizeNote(note = {}) {
  return {
    id: note.id || uuidv4(),
    title: note.title || '',
    body: note.body || '',
    category_id: note.category_id ?? 3,
    color: note.color || '#BED8FF',
    isPinned: !!note.isPinned,
    isSynced: true,
    lastUpdated: note.lastUpdated || now(),
    is_deleted: !!note.is_deleted,
    deleted_at: note.deleted_at || null,
    is_archived: !!note.is_archived,
    archived_at: note.archived_at || null,
  };
}

// REST API
app.get('/health', (_, res) => res.json({ ok: true, ts: now() }));

app.get('/api/users/:userId/notes', (req, res) => {
  const notes = [...getUserNotes(req.params.userId).values()];
  res.json({ ok: true, notes });
});

// Socket.IO
io.on('connection', socket => {
  socket.on('join', ({ userId }) => {
    if (!userId) return;
    socket.join(`user:${userId}`);
    socket.emit('joined', { ok: true, userId });
  });

  socket.on('syncLocalToCloud', ({ userId, notes = [] }, ack = () => {}) => {
    try {
      const map = getUserNotes(userId);
      let uploaded = 0;
      for (const n of notes) {
        const incoming = normalizeNote(n);
        const existing = map.get(incoming.id);
        if (!existing || incoming.lastUpdated >= existing.lastUpdated) {
          map.set(incoming.id, incoming);
          uploaded++;
        }
      }
      ack({ ok: true, uploaded });
      io.to(`user:${userId}`).emit('notesChanged', { type: 'bulk-upsert' });
    } catch (e) {
      ack({ ok: false, error: e.message });
    }
  });

  socket.on('syncCloudToLocal', ({ userId }, ack = () => {}) => {
    try {
      ack({ ok: true, notes: [...getUserNotes(userId).values()] });
    } catch (e) {
      ack({ ok: false, error: e.message });
    }
  });

  socket.on('note:create', ({ userId, note }, ack = () => {}) => {
    try {
      const created = normalizeNote(note);
      getUserNotes(userId).set(created.id, created);
      ack({ ok: true, note: created });
      io.to(`user:${userId}`).emit('note:created', { note: created });
    } catch (e) {
      ack({ ok: false, error: e.message });
    }
  });

  socket.on('note:update', ({ userId, noteId, patch }, ack = () => {}) => {
    try {
      const map = getUserNotes(userId);
      const existing = map.get(noteId);
      if (!existing) return ack({ ok: false, error: 'Note not found' });
      const updated = normalizeNote({ ...existing, ...patch, id: noteId, lastUpdated: now() });
      map.set(noteId, updated);
      ack({ ok: true, note: updated });
      io.to(`user:${userId}`).emit('note:updated', { note: updated });
    } catch (e) {
      ack({ ok: false, error: e.message });
    }
  });

  socket.on('note:archive', ({ userId, noteId, archived = true }, ack = () => {}) => {
    try {
      const map = getUserNotes(userId);
      const existing = map.get(noteId);
      if (!existing) return ack({ ok: false, error: 'Note not found' });
      const updated = normalizeNote({
        ...existing,
        is_archived: !!archived,
        archived_at: archived ? now() : null,
        lastUpdated: now(),
      });
      map.set(noteId, updated);
      ack({ ok: true, note: updated });
      io.to(`user:${userId}`).emit('note:archived', { note: updated });
    } catch (e) {
      ack({ ok: false, error: e.message });
    }
  });

  socket.on('note:delete', ({ userId, noteId, hardDelete = false }, ack = () => {}) => {
    try {
      const map = getUserNotes(userId);
      const existing = map.get(noteId);
      if (!existing) return ack({ ok: false, error: 'Note not found' });

      if (hardDelete) {
        map.delete(noteId);
        ack({ ok: true, noteId, hardDelete: true });
        io.to(`user:${userId}`).emit('note:deleted', { noteId, hardDelete: true });
      } else {
        const deleted = normalizeNote({
          ...existing,
          is_deleted: true,
          deleted_at: now(),
          is_archived: false,
          archived_at: null,
          lastUpdated: now(),
        });
        map.set(noteId, deleted);
        ack({ ok: true, note: deleted, hardDelete: false });
        io.to(`user:${userId}`).emit('note:deleted', { note: deleted, hardDelete: false });
      }
    } catch (e) {
      ack({ ok: false, error: e.message });
    }
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on :${PORT}`));