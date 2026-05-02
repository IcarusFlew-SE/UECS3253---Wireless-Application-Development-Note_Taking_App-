import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(false);

const db = SQLite.openDatabase(
  {
    name: 'notenest.sqlite',
    location: 'default',
  },
  () => console.log('Database opened successfully'),
  error => console.log('Database error:', error),
);

const run = (tx, sql) => tx.executeSql(sql, [], () => {}, (_, err) => {
  if (err && err.message && !err.message.includes('duplicate column')) {
    console.log('Migration error:', err.message);
  }
});

export const initDatabase = () => {
  db.transaction(tx => {
    run(
      tx,
      `CREATE TABLE IF NOT EXISTS notes (
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
      )`,
    );

    run(
      tx,
      `CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        color TEXT
      )`,
    );

    run(
      tx,
      `CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      )`,
    );

    run(
      tx,
      `CREATE TABLE IF NOT EXISTS note_tags (
        note_id TEXT NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY (note_id, tag_id)
      )`,
    );

    run(tx, "INSERT OR IGNORE INTO categories (name, color) VALUES ('Work', '#388BDF')");
    run(tx, "INSERT OR IGNORE INTO categories (name, color) VALUES ('Personal', '#14b8a6')");
    run(tx, "INSERT OR IGNORE INTO categories (name, color) VALUES ('Ideas', '#eab308')");
    run(tx, "INSERT OR IGNORE INTO categories (name, color) VALUES ('Study', '#f43f5e')");
  });

  // Run migrations in separate transactions to avoid rolling back table creation if columns exist
  db.transaction(tx => run(tx, 'ALTER TABLE notes ADD COLUMN category_id INTEGER'));
  db.transaction(tx => run(tx, 'ALTER TABLE notes ADD COLUMN is_archived INTEGER DEFAULT 0'));
  db.transaction(tx => run(tx, 'ALTER TABLE notes ADD COLUMN archived_at INTEGER'));
  db.transaction(tx => run(tx, 'ALTER TABLE notes ADD COLUMN is_deleted INTEGER DEFAULT 0'));
  db.transaction(tx => run(tx, 'ALTER TABLE notes ADD COLUMN deleted_at INTEGER'));
};

initDatabase();

export default db;