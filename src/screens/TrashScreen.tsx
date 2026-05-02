import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from '@react-native-community/blur';
import { useTheme } from '../themes/ThemeContext';
import NoteService from '../services/NoteService';

const TrashScreen = () => {
  const { colors, isDark } = useTheme();
  const [notes, setNotes] = useState<any[]>([]);

  const load = useCallback(() => NoteService.getTrashedNotes(setNotes), []);
  useFocusEffect(useCallback(() => load(), [load]));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <FlashList
        data={notes}
        keyExtractor={item => item.id}
        estimatedItemSize={100}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.subtext }]}>Trash is empty.</Text>}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderColor: colors.border }]}> 
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType={isDark ? "dark" : "light"}
              blurAmount={15}
              reducedTransparencyFallbackColor={colors.secondaryBg}
            />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.glassBg }]} />
            <View style={{ flex: 1, padding: 12 }}>
              <Text style={[styles.title, { color: colors.text }]}>{item.title || 'Untitled'}</Text>
              <Text style={[styles.body, { color: colors.subtext }]} numberOfLines={2}>{item.body || ''}</Text>
            </View>
            <TouchableOpacity style={styles.restoreBtn} onPress={() => NoteService.restoreNote(item.id, load)}>
              <Text style={styles.restoreTxt}>Restore</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14 },
  empty: { textAlign: 'center', marginTop: 30 },
  card: { borderWidth: 1, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  title: { fontWeight: '700', fontSize: 16 },
  body: { marginTop: 4 },
  restoreBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#388BDF', borderRadius: 8, marginRight: 12 },
  restoreTxt: { color: '#fff', fontWeight: '700' },
});

export default TrashScreen;
