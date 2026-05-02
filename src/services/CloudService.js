import NetInfo from '@react-native-community/netinfo';
import { getApp } from '@react-native-firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  writeBatch, 
  getDocs,
  setDoc,
  query,
  limit
} from '@react-native-firebase/firestore';
import getDb from '../database/db';

const app = getApp();
const firestoreDb = getFirestore(app);
const db = getDb();

const notesCollection = (userId) =>
  collection(firestoreDb, 'users', userId, 'notes');

const runSql = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.executeSql(
      sql,
      params,
      (_, result) => resolve(result),
      (_, error) => reject(error),
    );
  });

const assertConnectivity = async () => {
  const state = await NetInfo.fetch();
  if (!state.isConnected || state.isInternetReachable === false) {
    throw new Error('No internet connection. Check emulator network settings.');
  }
};

const rowToNote = row => ({
  id: row.id,
  title: row.title || '',
  body: row.body || '',
  category_id: row.category_id || 3,
  color: row.color || '#BED8FF',
  isPinned: !!row.isPinned,
  isSynced: !!row.isSynced,
  lastUpdated: row.lastUpdated || Date.now(),
  is_deleted: !!row.is_deleted,
  deleted_at: row.deleted_at || null,
  is_archived: !!row.is_archived,
  archived_at: row.archived_at || null,
});

const shouldReplaceLocal = (local, cloud) =>
  !local || (cloud.lastUpdated || 0) >= (local.lastUpdated || 0);

export const CloudSyncService = {
  syncLocalToCloud: async userId => {
    await assertConnectivity();
    const result = await runSql('SELECT * FROM notes WHERE isSynced = 0', []);
    const batch = writeBatch(firestoreDb);
    const ids = [];

    for (let i = 0; i < result.rows.length; i++) {
      const note = rowToNote(result.rows.item(i));
      const docRef = doc(notesCollection(userId), note.id);
      batch.set(docRef, { ...note, isSynced: true }, { merge: true });
      ids.push(note.id);
    }

    if (ids.length === 0) return 0;

    await batch.commit();
    await Promise.all(
      ids.map(id =>
        runSql('UPDATE notes SET isSynced = 1 WHERE id = ?', [id]),
      ),
    );
    return ids.length;
  },

  syncCloudToLocal: async userId => {
    await assertConnectivity();
    const snapshot = await getDocs(notesCollection(userId));

    for (const docSnap of snapshot.docs) {
      const cloudNote = rowToNote(docSnap.data());
      const localResult = await runSql(
        'SELECT * FROM notes WHERE id = ? LIMIT 1',
        [cloudNote.id],
      );
      const localNote = localResult.rows.length
        ? rowToNote(localResult.rows.item(0))
        : null;
      
      if (!shouldReplaceLocal(localNote, cloudNote)) continue;

      await runSql(
        `INSERT OR REPLACE INTO notes 
         (id, title, body, category_id, color, isPinned, lastUpdated, isSynced, 
          is_deleted, deleted_at, is_archived, archived_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cloudNote.id,
          cloudNote.title,
          cloudNote.body,
          cloudNote.category_id,
          cloudNote.color,
          cloudNote.isPinned ? 1 : 0,
          cloudNote.lastUpdated,
          1,
          cloudNote.is_deleted ? 1 : 0,
          cloudNote.deleted_at,
          cloudNote.is_archived ? 1 : 0,
          cloudNote.archived_at,
        ],
      );
    }
    return snapshot.size;
  },

  syncAll: async userId => {
    const uploaded = await CloudSyncService.syncLocalToCloud(userId);
    const downloaded = await CloudSyncService.syncCloudToLocal(userId);
    return { uploaded, downloaded, at: new Date().toISOString() };
  },
};