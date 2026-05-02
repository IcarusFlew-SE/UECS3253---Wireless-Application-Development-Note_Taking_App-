import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);
SQLite.DEBUG(false);

let dbPromise = null;

export const getDbPromise = () => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabase({ name: 'notenest.db', location: 'default' });
  }
  return dbPromise;
};

export const initDatabase = async () => {
  const db = await getDbPromise();

  await db.executeSql(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    color TEXT
  )`);

  await db.executeSql(`CREATE TABLE IF NOT EXISTS notes (
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
  )`);

  const cats = [
    ['Work', '#388BDF'],
    ['Personal', '#14b8a6'],
    ['Ideas', '#eab308'],
    ['Study', '#f43f5e'],
  ];
  for (const [name, color] of cats) {
    await db.executeSql(
      'INSERT OR IGNORE INTO categories (name, color) VALUES (?, ?)',
      [name, color]
    );
  }

  console.log('[DB] Ready ✓');
};

export default getDbPromise;