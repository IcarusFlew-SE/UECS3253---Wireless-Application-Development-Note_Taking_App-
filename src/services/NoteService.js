const db = require('./db');

// Requirement 2: CRUD Implementation
const NoteService = {
  // Create or Update Note 
  saveNote: (note, cb) => {
    db.executeSql(
      'INSERT OR REPLACE INTO notes (id, title, body, category, color, isPinned, lastUpdated, isSynced) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [note.id, note.title, note.body, note.category, note.color, note.isPinned ? 1 : 0, Date.now(), 0],
      (result) => { if (cb) cb(result); },
      (error) => console.log('Save Error: ', error)
    );
  },

  // Read: Get Note by ID 
  getNoteById: (id, cb) => {
    db.executeSql(
      'SELECT * FROM notes WHERE id = ?',
      [id],
      (result) => {
        if (result.rows.length > 0) {
          cb(result.rows.item(0)); // Returns single row object
        }
      },
      (error) => console.log('Fetch Error: ', error)
    );
  },

  // Read: Get All Notes for Home Grid
  getAllNotes: (cb) => {
    db.executeSql(
      'SELECT * FROM notes ORDER BY isPinned DESC, lastUpdated DESC',
      [],
      (result) => {
        let notes = [];
        for (let i = 0; i < result.rows.length; i++) {
          notes.push(result.rows.item(i));
        }
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
      (result) => { if (cb) cb(result); },
      (error) => console.log('Delete Error: ', error)
    );
  }
};

module.exports = NoteService;