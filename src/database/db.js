import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(false);
SQLite.DEBUG(false); // set to true during debugging

let db = null;

const getDb = () => {
  if (!db) {
    db = SQLite.openDatabase(
      { name: 'notenest.sqlite', location: 'default' },
      () => console.log('[DB] Opened successfully'),
      error => console.error('[DB] Open error:', error),
    );
  }
  return db;
};

const safeRun = (tx, sql) => {
  tx.executeSql(
    sql, [],
    () => {},
    (_, err) => {
      // Silently ignore "duplicate column" errors from migrations
      if (err?.message && !err.message.includes('duplicate column')) {
        console.warn('[DB] Migration warn:', err.message);
      }
      return false; // don't rollback transaction
    },
  );
};

export const initDatabase = () => {
  const database = getDb();

  // Main schema creation
  database.transaction(
    tx => {
      safeRun(tx, `
        CREATE TABLE IF NOT EXISTS notes (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT,
          body TEXT,
          category_id INTEGER,
          color TEXT,
          isPinned INTEGER DEFAULT 0,
          lastUpdated INTEGER,
          isSynced INTEGER DEFAULT 0,
          is_deleted INTEGER DEFAULT 0,
          is_archived INTEGER DEFAULT 0,
          deleted_at INTEGER,
          archived_at INTEGER
        )
      `);
      safeRun(tx, `
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          color TEXT
        )
      `);
      safeRun(tx, `
        CREATE TABLE IF NOT EXISTS tags (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL
        )
      `);
      safeRun(tx, `
        CREATE TABLE IF NOT EXISTS note_tags (
          note_id TEXT NOT NULL,
          tag_id INTEGER NOT NULL,
          PRIMARY KEY (note_id, tag_id)
        )
      `);
      // Seed default categories
      safeRun(tx, "INSERT OR IGNORE INTO categories (name, color) VALUES ('Work', '#388BDF')");
      safeRun(tx, "INSERT OR IGNORE INTO categories (name, color) VALUES ('Personal', '#14b8a6')");
      safeRun(tx, "INSERT OR IGNORE INTO categories (name, color) VALUES ('Ideas', '#eab308')");
      safeRun(tx, "INSERT OR IGNORE INTO categories (name, color) VALUES ('Study', '#f43f5e')");
    },
    error => console.error('[DB] Schema init error:', error),
    () => console.log('[DB] Schema ready'),
  );

  // Migrations — each in its own transaction so failures don't cascade
  const migrations = [
    'ALTER TABLE notes ADD COLUMN category_id INTEGER',
    'ALTER TABLE notes ADD COLUMN is_archived INTEGER DEFAULT 0',
    'ALTER TABLE notes ADD COLUMN archived_at INTEGER',
    'ALTER TABLE notes ADD COLUMN is_deleted INTEGER DEFAULT 0',
    'ALTER TABLE notes ADD COLUMN deleted_at INTEGER',
  ];

  migrations.forEach(sql => {
    database.transaction(tx => safeRun(tx, sql));
  });
};

export default getDb;