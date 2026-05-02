const express = require('express');
const http = require('http');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PATCH', 'DELETE'] },
});

app.use(cors());
app.use(express.json());

const now = () => Date.now();
const DB_PATH = path.join(__dirname, 'data', 'notes-db.json');

const ensureDbFile = () => {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({ users: {} }, null, 2));
};

const loadDb = () => {
  ensureDbFile();
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return { users: {} };
  }
};

const saveDb = db => {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
};

const db = loadDb();

function getUserNotes(userId) {
  if (!userId) throw new Error('userId is required');
  if (!db.users[userId]) db.users[userId] = {};
  return db.users[userId];
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
    lastUpdated: Number(note.lastUpdated) || now(),
    is_deleted: !!note.is_deleted,
    deleted_at: note.deleted_at || null,
    is_archived: !!note.is_archived,
    archived_at: note.archived_at || null,
  };
}

const listNotes = userId => Object.values(getUserNotes(userId));
const upsertNote = (userId, note) => {
  const n = normalizeNote(note);
  getUserNotes(userId)[n.id] = n;
  saveDb(db);
  return n;
};

const deleteNote = (userId, noteId) => {
  const notes = getUserNotes(userId);
  delete notes[noteId];
  saveDb(db);
};

app.get('/health', (_, res) => res.json({ ok: true, ts: now() }));

app.get('/api/users/:userId/notes', (req, res) => {
  res.json({ ok: true, notes: listNotes(req.params.userId) });
});

app.post('/api/users/:userId/notes', (req, res) => {
  try {
    const note = upsertNote(req.params.userId, req.body || {});
    io.to(`user:${req.params.userId}`).emit('note:created', { note });
    res.status(201).json({ ok: true, note });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.patch('/api/users/:userId/notes/:noteId', (req, res) => {
  try {
    const notes = getUserNotes(req.params.userId);
    const existing = notes[req.params.noteId];
    if (!existing) return res.status(404).json({ ok: false, error: 'Note not found' });
    const note = upsertNote(req.params.userId, { ...existing, ...req.body, id: req.params.noteId, lastUpdated: now() });
    io.to(`user:${req.params.userId}`).emit('note:updated', { note });
    res.json({ ok: true, note });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.delete('/api/users/:userId/notes/:noteId', (req, res) => {
  try {
    const { hardDelete } = req.query;
    const notes = getUserNotes(req.params.userId);
    const existing = notes[req.params.noteId];
    if (!existing) return res.status(404).json({ ok: false, error: 'Note not found' });

    if (hardDelete === 'true') {
      deleteNote(req.params.userId, req.params.noteId);
      io.to(`user:${req.params.userId}`).emit('note:deleted', { noteId: req.params.noteId, hardDelete: true });
      return res.json({ ok: true, noteId: req.params.noteId, hardDelete: true });
    }

    const note = upsertNote(req.params.userId, {
      ...existing,
      is_deleted: true,
      deleted_at: now(),
      is_archived: false,
      archived_at: null,
      lastUpdated: now(),
    });
    io.to(`user:${req.params.userId}`).emit('note:deleted', { note, hardDelete: false });
    return res.json({ ok: true, note, hardDelete: false });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e.message });
  }
});

io.on('connection', socket => {
  socket.on('join', ({ userId }) => {
    if (!userId) return;
    socket.join(`user:${userId}`);
    socket.emit('joined', { ok: true, userId });
  });

  socket.on('syncLocalToCloud', ({ userId, notes = [] }, ack = () => {}) => {
    try {
      const byId = getUserNotes(userId);
      let uploaded = 0;
      for (const n of notes) {
        const incoming = normalizeNote(n);
        const existing = byId[incoming.id];
        if (!existing || incoming.lastUpdated >= existing.lastUpdated) {
          byId[incoming.id] = incoming;
          uploaded += 1;
        }
      }
      saveDb(db);
      ack({ ok: true, uploaded });
      io.to(`user:${userId}`).emit('notesChanged', { type: 'bulk-upsert' });
    } catch (e) {
      ack({ ok: false, error: e.message });
    }
  });

  socket.on('syncCloudToLocal', ({ userId }, ack = () => {}) => {
    try {
      ack({ ok: true, notes: listNotes(userId) });
    } catch (e) {
      ack({ ok: false, error: e.message });
    }
  });

  socket.on('note:create', ({ userId, note }, ack = () => {}) => {
    try {
      const created = upsertNote(userId, note);
      ack({ ok: true, note: created });
      io.to(`user:${userId}`).emit('note:created', { note: created });
    } catch (e) {
      ack({ ok: false, error: e.message });
    }
  });

  socket.on('note:update', ({ userId, noteId, patch }, ack = () => {}) => {
    try {
      const notes = getUserNotes(userId);
      const existing = notes[noteId];
      if (!existing) return ack({ ok: false, error: 'Note not found' });
      const updated = upsertNote(userId, { ...existing, ...patch, id: noteId, lastUpdated: now() });
      ack({ ok: true, note: updated });
      io.to(`user:${userId}`).emit('note:updated', { note: updated });
    } catch (e) {
      ack({ ok: false, error: e.message });
    }
  });

  socket.on('note:archive', ({ userId, noteId, archived = true }, ack = () => {}) => {
    try {
      const notes = getUserNotes(userId);
      const existing = notes[noteId];
      if (!existing) return ack({ ok: false, error: 'Note not found' });
      const updated = upsertNote(userId, {
        ...existing,
        is_archived: !!archived,
        archived_at: archived ? now() : null,
        lastUpdated: now(),
      });
      ack({ ok: true, note: updated });
      io.to(`user:${userId}`).emit('note:archived', { note: updated });
    } catch (e) {
      ack({ ok: false, error: e.message });
    }
  });

  socket.on('note:delete', ({ userId, noteId, hardDelete = false }, ack = () => {}) => {
    try {
      const notes = getUserNotes(userId);
      const existing = notes[noteId];
      if (!existing) return ack({ ok: false, error: 'Note not found' });

      if (hardDelete) {
        deleteNote(userId, noteId);
        ack({ ok: true, noteId, hardDelete: true });
        io.to(`user:${userId}`).emit('note:deleted', { noteId, hardDelete: true });
      } else {
        const deleted = upsertNote(userId, {
          ...existing,
          is_deleted: true,
          deleted_at: now(),
          is_archived: false,
          archived_at: null,
          lastUpdated: now(),
        });
        ack({ ok: true, note: deleted, hardDelete: false });
        io.to(`user:${userId}`).emit('note:deleted', { note: deleted, hardDelete: false });
      }
    } catch (e) {
      ack({ ok: false, error: e.message });
    }
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on :${PORT} (db: ${DB_PATH})`));