import NetInfo from '@react-native-community/netinfo';
import { io } from 'socket.io-client';
import getDb from '../database/db';

const db = getDb();
const WS_URL = 'http://10.0.2.2:8080'; //local host for emulator
let socket = null;

const runSql = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.executeSql(sql, params, (_, result) => resolve(result), (_, error) => reject(error));
  });

const assertConnectivity = async () => {
  const state = await NetInfo.fetch();
  if (!state.isConnected || state.isInternetReachable === false) {
    throw new Error('No internet connection');
  }
};

const upsertLocalNote = async note =>
  runSql(
    `INSERT OR REPLACE INTO notes
      (id, title, body, category_id, color, isPinned, lastUpdated, isSynced,
       is_deleted, deleted_at, is_archived, archived_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      note.id,
      note.title || '',
      note.body || '',
      note.category_id || 3,
      note.color || '#BED8FF',
      note.isPinned ? 1 : 0,
      note.lastUpdated || Date.now(),
      1,
      note.is_deleted ? 1 : 0,
      note.deleted_at || null,
      note.is_archived ? 1 : 0,
      note.archived_at || null,
    ],
  );

const getSocket = userId =>
  new Promise((resolve, reject) => {
    if (socket?.connected) {
      socket.emit('join', { userId });
      return resolve(socket);
    }

    socket = io(WS_URL, {
      transports: ['websocket'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 500,
      reconnectionDelayMax: 5000,
    });

    socket.once('connect', () => {
      socket.emit('join', { userId });
      resolve(socket);
    });

    socket.once('connect_error', () => reject(new Error(`Socket.IO failed: ${WS_URL}`)));
  });

const emitAck = (event, payload) =>
  new Promise((resolve, reject) => {
    socket.timeout(15000).emit(event, payload, (err, response) => {
      if (err) return reject(new Error(`Timeout: ${event}`));
      if (!response?.ok) return reject(new Error(response?.error || `Failed: ${event}`));
      resolve(response);
    });
  });

export const CloudSyncService = {
  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  subscribeToRealtimeChanges: async (userId, onChanged) => {
    await assertConnectivity();
    await getSocket(userId);

    const apply = async payload => {
      if (payload?.note) await upsertLocalNote(payload.note);
      if (payload?.noteId && payload?.hardDelete) {
        await runSql('DELETE FROM notes WHERE id = ?', [payload.noteId]);
      }
      onChanged?.(payload);
    };

    const created = p => apply(p).catch(console.warn);
    const updated = p => apply(p).catch(console.warn);
    const archived = p => apply(p).catch(console.warn);
    const deleted = p => apply(p).catch(console.warn);

    socket.on('note:created', created);
    socket.on('note:updated', updated);
    socket.on('note:archived', archived);
    socket.on('note:deleted', deleted);

    return () => {
      socket?.off('note:created', created);
      socket?.off('note:updated', updated);
      socket?.off('note:archived', archived);
      socket?.off('note:deleted', deleted);
    };
  },

  syncLocalToCloud: async userId => {
    await assertConnectivity();
    const result = await runSql('SELECT * FROM notes WHERE isSynced = 0', []);
    const notes = [];
    for (let i = 0; i < result.rows.length; i++) notes.push(result.rows.item(i));

    if (!notes.length) return 0;
    await getSocket(userId);
    const res = await emitAck('syncLocalToCloud', { userId, notes });

    await Promise.all(notes.map(n => runSql('UPDATE notes SET isSynced = 1 WHERE id = ?', [n.id])));
    return res.uploaded || notes.length;
  },

  syncCloudToLocal: async userId => {
    await assertConnectivity();
    await getSocket(userId);
    const res = await emitAck('syncCloudToLocal', { userId });
    const notes = Array.isArray(res.notes) ? res.notes : [];
    for (const n of notes) await upsertLocalNote(n);
    return notes.length;
  },

  createNote: async (userId, note) => {
    await assertConnectivity();
    await getSocket(userId);
    const res = await emitAck('note:create', { userId, note });
    await upsertLocalNote(res.note);
    return res.note;
  },

  updateNote: async (userId, noteId, patch) => {
    await assertConnectivity();
    await getSocket(userId);
    const res = await emitAck('note:update', { userId, noteId, patch });
    await upsertLocalNote(res.note);
    return res.note;
  },

  archiveNote: async (userId, noteId, archived = true) => {
    await assertConnectivity();
    await getSocket(userId);
    const res = await emitAck('note:archive', { userId, noteId, archived });
    await upsertLocalNote(res.note);
    return res.note;
  },

  deleteNote: async (userId, noteId, hardDelete = false) => {
    await assertConnectivity();
    await getSocket(userId);
    const res = await emitAck('note:delete', { userId, noteId, hardDelete });

    if (hardDelete) {
      await runSql('DELETE FROM notes WHERE id = ?', [noteId]);
      return { noteId, hardDelete: true };
    }
    await upsertLocalNote(res.note);
    return res.note;
  },

  syncAll: async userId => {
    const uploaded = await CloudSyncService.syncLocalToCloud(userId);
    const downloaded = await CloudSyncService.syncCloudToLocal(userId);
    return { uploaded, downloaded, at: new Date().toISOString() };
  },
};