import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(false);

const db = SQLite.openDatabase({
  name: 'notenest.sqlite',
  location: 'default',
}, () => console.log('Database opened successfully'),
(error) => console.log('Database error:', error)
);

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
        isSynced INTEGER DEFAULT 0
      )`,
    );
  });
};

initDatabase();

export default db;