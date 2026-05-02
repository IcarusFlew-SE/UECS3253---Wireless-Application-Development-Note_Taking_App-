import db from '../database/db';

const toNote = row => ({
  ...row,
  isPinned: !!row.isPinned,
  isSynced: !!row.isSynced,
  is_deleted: !!row.is_deleted,
  is_archived: !!row.is_archived,
});

const rowsToArray = result => {
  const notes = [];
  for (let i = 0; i < result.rows.length; i += 1) notes.push(toNote(result.rows.item(i)));
  return notes;
};

const NoteService = {
  saveNote: (note, cb) => {
    db.executeSql(
      'INSERT OR REPLACE INTO notes (id, title, body, category_id, color, isPinned, lastUpdated, isSynced, is_deleted, is_archived, deleted_at, archived_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        note.id,
        note.title,
        note.body,
        note.category_id || null,
        note.color,
        note.isPinned ? 1 : 0,
        Date.now(),
        0,
        note.is_deleted ? 1 : 0,
        note.is_archived ? 1 : 0,
        note.deleted_at || null,
        note.archived_at || null,
      ],
      (_, result) => cb?.(result),
      error => console.log('Save Error:', error.message),
    );
  },

  getNoteById: (id, cb) => {
    db.executeSql(
      `SELECT n.*, c.name as category, c.color as categoryColor 
      FROM notes n LEFT JOIN categories c ON c.id = n.category_id 
      WHERE n.id = ?`,
      [id],
      (_, result) => cb(result.rows.length > 0 ? toNote(result.rows.item(0)) : null),
      error => console.log('Fetch Error:', error.message),
    );
  },

  getAllNotes: cb => {
    db.executeSql(
      `SELECT n.*, c.name as category, c.color as categoryColor 
      FROM notes n LEFT JOIN categories c ON c.id = n.category_id 
      WHERE n.is_deleted = 0
      ORDER BY n.isPinned DESC, n.lastUpdated DESC`,
      [],
      (_, result) => {
        const notes = [];
        for (let i = 0; i < result.rows.length; i += 1) 
          notes.push(toNote(result.rows.item(i)));
        cb(notes);
      },
      error => console.log('List Error: ', error.message)
    );
  },

  getArchivedNotes: cb => {
    db.executeSql(
      `SELECT n.*, c.name as category, c.color as categoryColor 
      FROM notes n LEFT JOIN categories c ON c.id = n.category_id 
      WHERE n.is_archived = 1 AND n.is_deleted = 0 
      ORDER BY n.archived_at DESC`,
      [],
      (_, result) => {
        const notes = [];
        for (let i = 0; i < result.rows.length; i += 1) {
          notes.push(toNote
        (result.rows.item(i)));
        }
        cb(notes);
      },
      error => console.log('Archive List Error: ', error.message),
    );
  },

  archiveNote: (id, cb) => {
    db.executeSql(
      'UPDATE notes SET is_archived = 1, archived_at = ?, isSynced = 0 WHERE id = ?',
      [Date.now(), id],
      (_, result) => cb?.(result),
      error => console.log('Archive Error:', error.message),
    );
  },

  unarchiveNote: (id, cb) => {
    db.executeSql(
      'UPDATE notes SET is_archived = 0, archived_at = NULL, isSynced = 0 WHERE id = ?',
      [id],
      (_, result) => cb?.(result),
      error => console.log('Unarchive Error:', error.message),
    );
  },

  getTrashedNotes: cb => {
    db.executeSql(
      `SELECT n.*, c.name as category, c.color as categoryColor 
      FROM notes n LEFT JOIN categories c ON c.id = n.category_id 
      WHERE n.is_deleted = 1 
      ORDER BY n.deleted_at DESC`,
      [],
      (_, result) => cb(rowsToArray(result)),
      error => console.log('Trash List Error: ', error.message),
    );
  },

  moveToTrash: (id, cb) => {
    db.executeSql(
      'UPDATE notes SET is_deleted = 1, deleted_at = ?, is_archived = 0, archived_at = NULL, isSynced = 0 WHERE id = ?',
      [Date.now(), id],
      (_, result) => cb?.(result),
      error => console.log('Trash Error:', error.message),
    );
  },


  restoreNote: (id, cb) => {
    db.executeSql(
      'UPDATE notes SET is_deleted = 0, deleted_at = NULL, isSynced = 0 WHERE id = ?',
      [id],
      (_, result) => cb?.(result),
      error => console.log('Restore Error:', error.message),
    );
  },

  deleteNote: (id, cb) => {
    db.executeSql('DELETE FROM notes WHERE id = ?',
      [id],
      (_, result) => cb?.(result), 
      error => console.log('Delete Error:', error.message));
  },

  emptyTrash: cb => {
    db.executeSql('DELETE FROM notes WHERE is_deleted = 1',
      [],
      (_, result) => cb?.(result),
      error => console.log('Delete Error:', error));
  },

  getCategories: cb => {
    db.executeSql(
      'SELECT * FROM categories',
      [],
      (_, result) => {
        const categories = [];
        for (let i = 0; i < result.rows.length; i += 1) {
          categories.push(result.rows.item(i));
        }
        cb(categories);
      },
      error => console.log('Fetch Categories Error:', error)
    );
  },
};

export default NoteService;