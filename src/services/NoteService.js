import db from './db';

const toNote = row => ({
  ...row,
  isPinned: !!row.isPinned,
  isSynced: !!row.isSynced,
  is_deleted: !!row.is_deleted,
});

const NoteService = {
  // Create or Update Note 
  saveNote: (note, cb) => {
    db.executeSql(
      'INSERT OR REPLACE INTO notes (id, title, body, category, color, isPinned, lastUpdated, isSynced, is_deleted, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        note.id,
        note.title,
        note.body,
        note.category,
        note.color,
        note.isPinned ? 1 : 0,
        Date.now(),
        0,
        note.is_deleted ? 1 : 0,
        note.deleted_at || null,
      ],
      (_, result) => cb?.(result),
      error => console.log('Save Error:', error),
    );
  },

  // Read: Get Note by ID 
  getNoteById: (id, cb) => {
    db.executeSql(
      'SELECT * FROM notes WHERE id = ?',
      [id],
      (_, result) => cb(result.rows.length > 0 ? toNote(result.rows.item(0)) : null),
      error => console.log('Fetch Error:', error),
    );
  },


  // Read: Get All Notes for Home Grid
  getAllNotes: cb => {
    db.executeSql(
      'SELECT * FROM notes WHERE is_deleted = 0 ORDER BY isPinned DESC, lastUpdated DESC',
      [],
      (_, result) => {
        const notes = [];
        for (let i = 0; i < result.rows.length; i += 1) notes.push(toNote(result.rows.item(i)));
        cb(notes);
      },
      error => console.log('List Error: ', error)
    );
  },

  // Archived Notes
  getArchivedNotes: cb => {
    db.executeSql(
    'SELECT * FROM notes WHERE is_deleted = 1 ORDER BY deleted_at DESC',
      [],
      (_, result) => {
        const notes = [];
        for (let i = 0; i < result.rows.length; i += 1) notes.push(toNote(result.rows.item(i)));
        cb(notes);
      },
      error => console.log('Archive List Error: ', error),
    );
  },

  archiveNote: (id, cb) => {
    db.executeSql(
      'UPDATE notes SET is_deleted = 1, deleted_at = ?, isSynced = 0 WHERE id = ?',
      [Date.now(), id],
      (_, result) => cb?.(result),
      error => console.log('Archive Error:', error),
    );
  },

  restoreNote: (id, cb) => {
    db.executeSql(
      'UPDATE notes SET is_deleted = 0, deleted_at = NULL, isSynced = 0 WHERE id = ?',
      [id],
      (_, result) => cb?.(result),
      error => console.log('Restore Error:', error),
    );
  },
  
  // Delete Notes
  deleteNote: (id, cb) => {
    db.executeSql(
      'DELETE FROM notes WHERE id = ?',
      [id],
      (_, result) => cb?.(result),
      error => console.log('Delete Error:', error),
    );
  },
};

export default NoteService;