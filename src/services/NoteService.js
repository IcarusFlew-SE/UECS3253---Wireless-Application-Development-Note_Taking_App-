import getDbPromise from '../database/db';
import { CloudSyncService } from './CloudService';
import AuthService from './AuthService';

const toNote = row => ({
  ...row,
  isPinned: !!row.isPinned,
  isSynced: !!row.isSynced,
  is_deleted: !!row.is_deleted,
  is_archived: !!row.is_archived,
});

const query = async (sql, params = []) => {
  const db = await getDbPromise();
  const [result] = await db.executeSql(sql, params);
  const rows = [];
  for (let i = 0; i < result.rows.length; i++) {
    rows.push(result.rows.item(i));
  }
  return rows;
};

const exec = async (sql, params = []) => {
  const db = await getDbPromise();
  await db.executeSql(sql, params);
};

const withUser = async () => {
  const user = await AuthService.ensureAnonymousSignIn();
  return user.uid;
};

const syncUp = async note => {
  try {
    const uid = await withUser();
    try {
      await CloudSyncService.updateNote(uid, note.id, note);
    } catch {
      await CloudSyncService.createNote(uid, note);
    }
  } catch (e) {
    console.log('[Sync] offline ok:', e?.message);
  }
};

const NoteService = {
  saveNote: async (note, cb) => {
    try {
      await exec(
        `INSERT OR REPLACE INTO notes
         (id, title, body, category_id, color, isPinned, lastUpdated, isSynced,
          is_deleted, is_archived, deleted_at, archived_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          note.id,
          note.title || '',
          note.body || '',
          note.category_id || null,
          note.color || '#14b8a6',
          note.isPinned ? 1 : 0,
          Date.now(),
          0,
          note.is_deleted ? 1 : 0,
          note.is_archived ? 1 : 0,
          note.deleted_at || null,
          note.archived_at || null,
        ]
      );
      cb?.();
      syncUp(note);
    } catch (e) {
      console.error('[NoteService] saveNote:', e.message);
    }
  },

  getNoteById: async (id, cb) => {
    try {
      const rows = await query(
        `SELECT n.*, c.name as category, c.color as categoryColor
         FROM notes n
         LEFT JOIN categories c ON c.id = n.category_id
         WHERE n.id = ?`,
        [id]
      );
      cb(rows.length ? toNote(rows[0]) : null);
    } catch (e) {
      console.error('[NoteService] getNoteById:', e.message);
      cb(null);
    }
  },

  getAllNotes: async cb => {
    try {
      const rows = await query(
        `SELECT n.*, c.name as category, c.color as categoryColor
         FROM notes n
         LEFT JOIN categories c ON c.id = n.category_id
         WHERE n.is_deleted = 0 AND n.is_archived = 0
         ORDER BY n.isPinned DESC, n.lastUpdated DESC`
      );
      console.log('[NoteService] getAllNotes:', rows.length);
      cb(rows.map(toNote));
    } catch (e) {
      console.error('[NoteService] getAllNotes:', e.message);
      cb([]);
    }
  },

  getArchivedNotes: async cb => {
    try {
      const rows = await query(
        `SELECT n.*, c.name as category, c.color as categoryColor
         FROM notes n
         LEFT JOIN categories c ON c.id = n.category_id
         WHERE n.is_archived = 1 AND n.is_deleted = 0
         ORDER BY n.archived_at DESC`
      );
      cb(rows.map(toNote));
    } catch (e) {
      console.error('[NoteService] getArchivedNotes:', e.message);
      cb([]);
    }
  },

  archiveNote: async (id, cb) => {
    try {
      await exec(
        'UPDATE notes SET is_archived = 1, archived_at = ?, isSynced = 0 WHERE id = ?',
        [Date.now(), id]
      );
      cb?.();
      withUser().then(uid => CloudSyncService.archiveNote(uid, id, true)).catch(() => {});
    } catch (e) {
      console.error('[NoteService] archiveNote:', e.message);
    }
  },

  getTrashedNotes: async cb => {
    try {
      const rows = await query(
        `SELECT n.*, c.name as category, c.color as categoryColor
         FROM notes n
         LEFT JOIN categories c ON c.id = n.category_id
         WHERE n.is_deleted = 1
         ORDER BY n.deleted_at DESC`
      );
      cb(rows.map(toNote));
    } catch (e) {
      console.error('[NoteService] getTrashedNotes:', e.message);
      cb([]);
    }
  },

  moveToTrash: async (id, cb) => {
    try {
      await exec(
        `UPDATE notes SET is_deleted = 1, deleted_at = ?,
         is_archived = 0, archived_at = NULL, isSynced = 0 WHERE id = ?`,
        [Date.now(), id]
      );
      cb?.();
      withUser().then(uid => CloudSyncService.deleteNote(uid, id, false)).catch(() => {});
    } catch (e) {
      console.error('[NoteService] moveToTrash:', e.message);
    }
  },

  restoreNote: async (id, cb) => {
    try {
      await exec(
        'UPDATE notes SET is_deleted = 0, deleted_at = NULL, is_archived = 0, archived_at = NULL, isSynced = 0 WHERE id = ?',
        [id]
      );
      cb?.();
    } catch (e) {
      console.error('[NoteService] restoreNote:', e.message);
    }
  },

  deleteNote: async (id, cb) => {
    try {
      await exec('DELETE FROM notes WHERE id = ?', [id]);
      cb?.();
      withUser().then(uid => CloudSyncService.deleteNote(uid, id, true)).catch(() => {});
    } catch (e) {
      console.error('[NoteService] deleteNote:', e.message);
    }
  },

  getCategories: async cb => {
    try {
      const rows = await query('SELECT * FROM categories ORDER BY id ASC');
      console.log('[NoteService] categories:', rows.length);
      cb(rows);
    } catch (e) {
      console.error('[NoteService] getCategories:', e.message);
      cb([]);
    }
  },
};

export default NoteService;