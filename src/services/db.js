import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(false);

const db = SQLite.openDatabase({
  name: 'notenest.sqlite',
  location: 'default',
}, () => console.log('Database opened successfully'),
(error) => console.log('Database error:', error)
);

const ensureColumn = (tx, columnName, definition) => {
  tx.executeSql(`PRAGMA table_info(notes)`, [], (_, result) => {
    let exists = false;
    for (let i = 0; i < result.rows.length; i += 1) {
      if (result.rows.item(i).name === columnName) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      tx.executeSql(`ALTER TABLE notes ADD COLUMN ${columnName} ${definition}`);
    }
  });
};

export const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT,
        body TEXT,
        category TEXT,
        color TEXT,
        isPinned INTEGER DEFAULT 0,
        lastUpdated INTEGER,
        isSynced INTEGER DEFAULT 0,
        is_deleted INTEGER DEFAULT 0,
        deleted_at INTEGER
      )`);

    ensureColumn(tx, 'is_deleted', 'INTEGER DEFAULT 0');
    ensureColumn(tx, 'deleted_at', 'INTEGER');
  });
};


initDatabase();

export default db;