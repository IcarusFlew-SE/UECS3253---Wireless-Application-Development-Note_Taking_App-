import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(false);
SQLite.DEBUG(false);

let db = null;

const getDb = () => {
  if (!db) {
    db = SQLite.openDatabase(
      {name: 'notenest.sqlite', location: 'default'},
      () => console.log('[DB] Opened successfully'),
      error => console.error('[DB] Open error:', error),
    );
  }
  return db;
};

/**
 * Safely execute a migration SQL statement.
 * Silently swallows "duplicate column" errors so migrations are idempotent.
 */
const safeRun = (tx, sql) => {
  tx.executeSql(
    sql,
    [],
    () => {},
    (_, err) => {
      if (err?.message && !err.message.includes('duplicate column')) {
        console.warn('[DB] Migration warn:', err.message);
      }
      return false; // don't rollback the transaction
    },
  );
};

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    const database = getDb();

    database.transaction(
      tx => {
        // Create notes table
        safeRun(
          tx,
          `CREATE TABLE IF NOT EXISTS notes (
            id TEXT PRIMARY KEY NOT NULL,
            title TEXT DEFAULT '',
            body TEXT DEFAULT '',
            category_id INTEGER,
            color TEXT DEFAULT '#14b8a6',
            isPinned INTEGER DEFAULT 0,
            lastUpdated INTEGER,
            isSynced INTEGER DEFAULT 0,
            is_deleted INTEGER DEFAULT 0,
            is_archived INTEGER DEFAULT 0,
            deleted_at INTEGER,
            archived_at INTEGER
          )`,
        );

        // Create categories table
        safeRun(
          tx,
          `CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            color TEXT
          )`,
        );

        // Create tags table
        safeRun(
          tx,
          `CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
          )`,
        );

        // Create note_tags junction table
        safeRun(
          tx,
          `CREATE TABLE IF NOT EXISTS note_tags (
            note_id TEXT NOT NULL,
            tag_id INTEGER NOT NULL,
            PRIMARY KEY (note_id, tag_id)
          )`,
        );

        // Seed default categories
        safeRun(
          tx,
          "INSERT OR IGNORE INTO categories (name, color) VALUES ('Work', '#388BDF')",
        );
        safeRun(
          tx,
          "INSERT OR IGNORE INTO categories (name, color) VALUES ('Personal', '#14b8a6')",
        );
        safeRun(
          tx,
          "INSERT OR IGNORE INTO categories (name, color) VALUES ('Ideas', '#eab308')",
        );
        safeRun(
          tx,
          "INSERT OR IGNORE INTO categories (name, color) VALUES ('Study', '#f43f5e')",
        );
      },
      error => {
        console.error('[DB] Schema init error:', error);
        reject(error);
      },
      () => {
        console.log('[DB] Schema ready ✓');
        // Run migrations after schema is confirmed ready
        _runMigrations(database, resolve);
      },
    );
  });
};

const _runMigrations = (database, resolve) => {
  const migrations = [
    'ALTER TABLE notes ADD COLUMN category_id INTEGER',
    'ALTER TABLE notes ADD COLUMN is_archived INTEGER DEFAULT 0',
    'ALTER TABLE notes ADD COLUMN archived_at INTEGER',
    'ALTER TABLE notes ADD COLUMN is_deleted INTEGER DEFAULT 0',
    'ALTER TABLE notes ADD COLUMN deleted_at INTEGER',
    "ALTER TABLE notes ADD COLUMN color TEXT DEFAULT '#14b8a6'",
    "ALTER TABLE notes ADD COLUMN title TEXT DEFAULT ''",
    "ALTER TABLE notes ADD COLUMN body TEXT DEFAULT ''",
  ];

  let completed = 0;
  if (migrations.length === 0) {
    resolve();
    return;
  }

  migrations.forEach(sql => {
    database.transaction(
      tx => safeRun(tx, sql),
      () => {
        completed++;
        if (completed === migrations.length) {
          console.log('[DB] Migrations complete ✓');
          resolve();
        }
      },
      () => {
        completed++;
        if (completed === migrations.length) {
          console.log('[DB] Migrations complete ✓');
          resolve();
        }
      },
    );
  });
};

export default getDb;