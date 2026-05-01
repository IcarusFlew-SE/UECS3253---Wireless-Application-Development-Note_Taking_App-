let SQLite = require("react-native-sqlite-storage");

let db = SQLite.openDatabase(
    {
    name: 'notenest.sqlite',
    location: 'default',
    },
    () => console.log('Database opened successfully'),
    (error) => console.log('Database error:', error)
);

const initDatabase = () => {
  db.executeSql(
    `CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT,
    body TEXT,
    category TEXT,
    color TEXT,
    isPinned INTEGER,
    lastUpdated INTEGER,
    isSynced INTEGER DEFAULT 0
    )`,
    [],
    () => console.log('Notes table initialized'),
    (error) => console.log('Table Error: ', error)
  );
};

initDatabase();

module.export = db;