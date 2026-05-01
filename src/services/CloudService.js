import firestore from '@react-native-firebase/firestore';
import NoteService from './NoteService';
const db = require('./db');

//Web-based API
export const CloudSyncService = {
  syncLocalToCloud: (userId) => {
    // Fetch only unsynced notes from SQLite
    db.executeSql(
      'SELECT * FROM notes WHERE isSynced = 0',
      [],
      async (result) => {
        const batch = firestore().batch();
        
        for (let i = 0; i < result.rows.length; i++) {
          const note = result.rows.item(i);
          const docRef = firestore().collection('users').doc(userId).collection('notes').doc(note.id);
          
          batch.set(docRef, { ...note, isSynced: 1 });
          
          // Update local status after batch success
          db.executeSql('UPDATE notes SET isSynced = 1 WHERE id = ?', [note.id]);
        }
        
        await batch.commit();
        console.log('Cloud Sync: Web-API upload complete[cite: 1]');
      },
      (err) => console.log('Sync Query Error: ', err)
    );
  }
};