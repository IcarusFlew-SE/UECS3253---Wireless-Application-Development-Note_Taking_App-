import getDb from '../database/db';

const db = getDb();

const toNote = row => ({
  ...row,
  isPinned: !!row.isPinned,
  isSynced: !!row.isSynced,
  is_deleted: !!row.is_deleted,
  is_archived: !!row.is_archived,
});

const rowsToArray = result => {
  const notes = [];
  for (let i = 0; i < result.rows.length; i += 1) {
    notes.push(toNote(result.rows.item(i)));
  }
  return notes;
};

const NoteService = {
  saveNote: (note, cb) => {
    db.executeSql(
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
        0, // mark as unsynced whenever saved locally
        note.is_deleted ? 1 : 0,
        note.is_archived ? 1 : 0,
        note.deleted_at || null,
        note.archived_at || null,
      ],
      (_, result) => {
        console.log('[NoteService] Note saved:', note.id);
        cb?.(result);
      },
      (_, error) => {
        console.error('[NoteService] Save error:', error.message);
        return false;
      },
    );
  },

  getNoteById: (id, cb) => {
    db.executeSql(
      `SELECT n.*, c.name as category, c.color as categoryColor 
       FROM notes n 
       LEFT JOIN categories c ON c.id = n.category_id 
       WHERE n.id = ?`,
      [id],
      (_, result) => {
        const note = result.rows.length > 0 ? toNote(result.rows.item(0)) : null;
        console.log('[NoteService] getNoteById:', id, note ? 'found' : 'not found');
        cb(note);
      },
      (_, error) => {
        console.error('[NoteService] Fetch error:', error.message);
        return false;
      },
    );
  },

  getAllNotes: cb => {
    db.executeSql(
      `SELECT n.*, c.name as category, c.color as categoryColor 
       FROM notes n 
       LEFT JOIN categories c ON c.id = n.category_id 
       WHERE n.is_deleted = 0 AND n.is_archived = 0
       ORDER BY n.isPinned DESC, n.lastUpdated DESC`,
      [],
      (_, result) => {
        // BUG FIX: cb was called inside the for-loop due to missing braces.
        // Now correctly called AFTER the loop completes.
        const notes = rowsToArray(result);
        console.log('[NoteService] getAllNotes count:', notes.length);
        cb(notes);
      },
      (_, error) => {
        console.error('[NoteService] List error:', error.message);
        return false;
      },
    );
  },

  getArchivedNotes: cb => {
    db.executeSql(
      `SELECT n.*, c.name as category, c.color as categoryColor 
       FROM notes n 
       LEFT JOIN categories c ON c.id = n.category_id 
       WHERE n.is_archived = 1 AND n.is_deleted = 0 
       ORDER BY n.archived_at DESC`,
      [],
      (_, result) => {
        cb(rowsToArray(result));
      },
      (_, error) => {
        console.error('[NoteService] Archive list error:', error.message);
        return false;
      },
    );
  },

  archiveNote: (id, cb) => {
    db.executeSql(
      'UPDATE notes SET is_archived = 1, archived_at = ?, isSynced = 0 WHERE id = ?',
      [Date.now(), id],
      (_, result) => cb?.(result),
      (_, error) => {
        console.error('[NoteService] Archive error:', error.message);
        return false;
      },
    );
  },

  unarchiveNote: (id, cb) => {
    db.executeSql(
      'UPDATE notes SET is_archived = 0, archived_at = NULL, isSynced = 0 WHERE id = ?',
      [id],
      (_, result) => cb?.(result),
      (_, error) => {
        console.error('[NoteService] Unarchive error:', error.message);
        return false;
      },
    );
  },

  getTrashedNotes: cb => {
    db.executeSql(
      `SELECT n.*, c.name as category, c.color as categoryColor 
       FROM notes n 
       LEFT JOIN categories c ON c.id = n.category_id 
       WHERE n.is_deleted = 1 
       ORDER BY n.deleted_at DESC`,
      [],
      (_, result) => {
        cb(rowsToArray(result));
      },
      (_, error) => {
        console.error('[NoteService] Trash list error:', error.message);
        return false;
      },
    );
  },

  moveToTrash: (id, cb) => {
    db.executeSql(
      `UPDATE notes 
       SET is_deleted = 1, deleted_at = ?, is_archived = 0, archived_at = NULL, isSynced = 0 
       WHERE id = ?`,
      [Date.now(), id],
      (_, result) => cb?.(result),
      (_, error) => {
        console.error('[NoteService] Trash error:', error.message);
        return false;
      },
    );
  },

  restoreNote: (id, cb) => {
    db.executeSql(
      'UPDATE notes SET is_deleted = 0, deleted_at = NULL, is_archived = 0, archived_at = NULL, isSynced = 0 WHERE id = ?',
      [id],
      (_, result) => cb?.(result),
      (_, error) => {
        console.error('[NoteService] Restore error:', error.message);
        return false;
      },
    );
  },

  deleteNote: (id, cb) => {
    db.executeSql(
      'DELETE FROM notes WHERE id = ?',
      [id],
      (_, result) => cb?.(result),
      (_, error) => {
        console.error('[NoteService] Delete error:', error.message);
        return false;
      },
    );
  },

  emptyTrash: cb => {
    db.executeSql(
      'DELETE FROM notes WHERE is_deleted = 1',
      [],
      (_, result) => cb?.(result),
      (_, error) => {
        console.error('[NoteService] Empty trash error:', error.message);
        return false;
      },
    );
  },

  getCategories: cb => {
    db.executeSql(
      'SELECT * FROM categories ORDER BY id ASC',
      [],
      (_, result) => {
        const categories = [];
        for (let i = 0; i < result.rows.length; i += 1) {
          categories.push(result.rows.item(i));
        }
        console.log('[NoteService] Categories loaded:', categories.length);
        cb(categories);
      },
      (_, error) => {
        console.error('[NoteService] Fetch categories error:', error.message);
        return false;
      },
    );
  },
};

export default NoteService;