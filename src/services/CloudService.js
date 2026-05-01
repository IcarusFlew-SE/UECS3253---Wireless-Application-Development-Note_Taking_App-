import { getApp } from '@react-native-firebase/app';
import {
  getFirestore,
  collection,
  doc,
  writeBatch,
  getDocs,
} from '@react-native-firebase/firestore';
import db from './db';

const app = getApp();
const firestoreDb = getFirestore(app);

const notesCollection = userId => collection(firestoreDb, 'users', userId, 'notes');

const runSql = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.executeSql(
      sql,
      params,
      (_, result) => resolve(result),
      error => reject(error),
    );
});

const rowToNote = row => ({
  id: row.id,
  title: row.title,
  body: row.body,
  category: row.category,
  color: row.color,
  isPinned: !!row.isPinned,
  isSynced: !!row.isSynced,
  lastUpdated: row.lastUpdated,
  is_deleted: !!row.is_deleted,
  deleted_at: row.deleted_at || null,
});

export const CloudSyncService = {
  syncLocalToCloud: async userId => {
    const result = await runSql('SELECT * FROM notes WHERE isSynced = 0', []);
    const batch = writeBatch(firestoreDb);
    const ids = [];

    for (let i = 0; i < result.rows.length; i += 1) {
      const note = rowToNote(result.rows.item(i));
        const docRef = doc(notesCollection(userId), note.id);
      batch.set(docRef, { ...note, isSynced: true });
      ids.push(note.id);
    }

    if (ids.length === 0) return 0;

    await batch.commit();
    await Promise.all(ids.map(id => runSql('UPDATE notes SET isSynced = 1 WHERE id = ?', [id])));
    return ids.length;
  },
   syncCloudToLocal: async userId => {
    const snapshot = await getDocs(notesCollection(userId));
    const docs = snapshot.docs.map(docSnap => docSnap.data());

    await Promise.all(
      docs.map(note =>
        runSql(
          'INSERT OR REPLACE INTO notes (id, title, body, category, color, isPinned, lastUpdated, isSynced, is_deleted, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            note.id,
            note.title || '',
            note.body || '',
            note.category || 'General',
            note.color || '#FFFFFF',
            note.isPinned ? 1 : 0,
            note.lastUpdated || Date.now(),
            1,
            note.is_deleted ? 1 : 0,
            note.deleted_at || null,
          ],
        ),
      ),
    );

    return docs.length;
  },

  syncAll: async userId => {
     const uploaded = await CloudSyncService.syncLocalToCloud(userId);
    const downloaded = await CloudSyncService.syncCloudToLocal(userId);
    return { uploaded, downloaded };
  },
};