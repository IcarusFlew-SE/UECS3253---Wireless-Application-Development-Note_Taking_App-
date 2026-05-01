import db from './db';

const toNote = row => ({
    ...row, isPinned: !!row.isPinned,
    isSynced: !!row.isSynced
});

const NoteService = {
  // Create or Update Note 
  saveNote: (note, cb) => {
    db.executeSql(
      'INSERT OR REPLACE INTO notes (id, title, body, category, color, isPinned, lastUpdated, isSynced) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [note.id, note.title, note.body, note.category, note.color, note.isPinned ? 1 : 0, Date.now(), 0],
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
      'SELECT * FROM notes ORDER BY isPinned DESC, lastUpdated DESC',
      [],
      (_, result) => {
        const notes = [];
        for (let i = 0; i < result.rows.length; i += 1) notes.push(toNote(result.rows.item(i)));
        cb(notes);
      },
      (error) => console.log('List Error: ', error)
    );
  },

  // Delete Note
  deleteNote: (id, cb) => {
    db.executeSql(
      'DELETE FROM notes WHERE id = ?',
      [id],
      (_, result) => cb?.(result),
      error => console.log('Delete Error:', error),
    );
  }
};

export default NoteService;