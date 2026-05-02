import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../themes/ThemeContext';
import NoteService from '../services/NoteService';
import AuthService from '../services/AuthService';

const ArchiveScreen = () => {
  const { colors } = useTheme();
  const [notes, setNotes] = useState<any[]>([]);

  const load = useCallback(() => NoteService.getArchivedNotes(setNotes), []);
  useFocusEffect(useCallback(() => load(), [load]));

  const onRestore = (id: string) => {
    NoteService.restoreNote(id, () => load());
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.subtext }]}>No archived notes.</Text>}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.secondaryBg, borderColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.text }]}>{item.title || 'Untitled'}</Text>
              <Text style={[styles.body, { color: colors.subtext }]} numberOfLines={2}>{item.body || ''}</Text>
            </View>
            <TouchableOpacity style={styles.restoreBtn} onPress={() => onRestore(item.id)}>
              <Text style={styles.restoreTxt}>Restore</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 14 
  },
  empty: {
     textAlign: 'center', 
     marginTop: 30 
  },
  card: {
     borderWidth: 1, 
     borderRadius: 12, 
     padding: 12, 
     marginBottom: 10, 
     flexDirection: 'row', 
     alignItems: 'center' 
  },
  title: {
     fontWeight: '700', 
     fontSize: 16 
  },
  body: {
     marginTop: 4 
  },
  restoreBtn: {
     paddingVertical: 8, 
     paddingHorizontal: 12, 
     backgroundColor: '#3B82F6', 
     borderRadius: 8 
  },
  restoreTxt: { 
    color: '#fff', 
    fontWeight: '700' 
  },
});

export default ArchiveScreen;
