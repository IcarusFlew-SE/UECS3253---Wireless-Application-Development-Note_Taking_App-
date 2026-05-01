import firestore from '@react-native-firebase/firestore';
import NoteService from './NoteService';
import db from './db';

//Web-based API
export const CloudSyncService = {
    syncLocalToCloud: userId =>
    new Promise((resolve, reject) => {
      db.executeSql(
        'SELECT * FROM notes WHERE isSynced = 0',
        [],
        async (_, result) => {
          try {
            const batch = firestore().batch();
            const ids = [];
            for (let i = 0; i < result.rows.length; i += 1) {
              const note = result.rows.item(i);
              const docRef = firestore().collection('users').doc(userId).collection('notes').doc(note.id);
              batch.set(docRef, { ...note, isSynced: 1 });
              ids.push(note.id);
            }
            if (ids.length === 0) return resolve(0);
            await batch.commit();
            ids.forEach(id => db.executeSql('UPDATE notes SET isSynced = 1 WHERE id = ?', [id]));
            resolve(ids.length);
          } catch (err) {
            reject(err);
          }
        },
        err => reject(err),
      );
    }),
};