import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Archive, ChevronLeft, Trash2, Pin } from 'lucide-react-native';
import { BlurView } from '@react-native-community/blur';
import { useTheme } from '../themes/ThemeContext';
import { tokens } from '../themes/theme';
import NoteService from '../services/NoteService';

const EditorScreen = ({ navigation, route }: any) => {
  const { colors, isDark } = useTheme();
  const noteId = route?.params?.noteId;
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const [id] = useState(noteId || `${Date.now()}`);
  const [noteColor, setNoteColor] = useState(tokens.colors.accent.teal);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categoryId, setCategoryId] = useState(3);
  const [isPinned, setIsPinned] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(!noteId);

  useEffect(() => {
    NoteService.getCategories(setCategories);
  }, []);

  useEffect(() => {
    if (!noteId) return;
    NoteService.getNoteById(noteId, (note: any) => {
      if (note) {
        setTitle(note.title || '');
        setBody(note.body || '');
        setNoteColor(note.color || tokens.colors.accent.teal);
        setCategoryId(note.category_id || 3);
        setIsPinned(note.isPinned || false);
      }
      setIsLoaded(true);
    });
  }, [noteId]);

  // Debounced Auto-Save
  useEffect(() => {
    if (!isLoaded) return;
    const timer = setTimeout(() => {
      NoteService.saveNote({ id, title, body, color: noteColor, category_id: categoryId, isPinned }, () => {});
    }, 1000);
    return () => clearTimeout(timer);
  }, [title, body, noteColor, categoryId, isPinned, id, isLoaded]);

  const appendMarkdown = (token: string) => setBody(prev => `${prev}${prev ? '\n' : ''}${token}`);

  const onSave = () => {
    NoteService.saveNote({ id, title, body, color: noteColor, category_id: categoryId, isPinned }, () => navigation.goBack());
  };

  const onTrash = () => {
    if (!noteId) return;
    NoteService.moveToTrash(noteId, () => navigation.goBack());
  };

  const onArchive = () => {
    if (!noteId) return;
    NoteService.archiveNote(noteId, () => navigation.goBack());
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <BlurView
           style={StyleSheet.absoluteFill}
           blurType={isDark ? "dark" : "light"}
           blurAmount={20}
           reducedTransparencyFallbackColor={colors.background}
        />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.glassBg }]} />
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.iconBtn, { backgroundColor: 'transparent' }]}>
            <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titleArea}>
          <View style={styles.brandInline}>
            <Image source={require('../assets/NoteNesterLogo.jpg')} style={styles.logoImage} />
            <Text style={[styles.label, { color: colors.subtext }]}>NoteNest Editor</Text>
          </View>
          <Text style={[styles.noteName, { color: colors.text }]} numberOfLines={1}>{title || 'Untitled note'}</Text>
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: isPinned ? colors.primary : colors.secondaryBg }]} 
            onPress={() => setIsPinned(!isPinned)}>
            <Pin size={16} color={isPinned ? "#FFF" : colors.text} />
          </TouchableOpacity>
          {noteId ? (
            <TouchableOpacity style={styles.archiveBtn} onPress={onArchive}>
              <Archive size={16} color="#fff" />
            </TouchableOpacity>
          ) : null}
          {noteId ? (
            <TouchableOpacity style={styles.trashBtn} onPress={onTrash}>
              <Trash2 size={16} color="#fff" />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.colorStrip, { backgroundColor: noteColor }]} />
      <ScrollView style={styles.editorArea} contentContainerStyle={{ paddingBottom: 12}}>
         <TextInput style={[styles.titleInput, { color: colors.text }]} placeholder="Note Title" placeholderTextColor={colors.subtext} value={title} onChangeText={setTitle} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.markdownToolbar}>
          <TouchableOpacity onPress={() => appendMarkdown('**bold text**')}><Text style={[styles.mdBtn, { color: colors.text }]}>Bold</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => appendMarkdown('_italic text_')}><Text style={[styles.mdBtn, { color: colors.text }]}>Italic</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => appendMarkdown('- list item')}><Text style={[styles.mdBtn, { color: colors.text }]}>List</Text></TouchableOpacity>
        </View>
        <TextInput
          style={[styles.bodyInput, { color: colors.text }]}
          placeholder="Start typing your note..."
          placeholderTextColor={colors.subtext}
          multiline
          value={body}
          onChangeText={setBody}
        />
      </ScrollView>
       <View
        style={[
          styles.footer,
          {
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom + 10, tabBarHeight + 10),
          },
        ]}
      >
        <BlurView
           style={StyleSheet.absoluteFill}
           blurType={isDark ? "dark" : "light"}
           blurAmount={20}
           reducedTransparencyFallbackColor={colors.background}
        />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.glassBg }]} />
        <Text style={[styles.footerLabel, { color: colors.text }]}>Category</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.colorRow}>
          {categories.map(c => (
             <TouchableOpacity 
               key={c.id} 
               onPress={() => setCategoryId(c.id)} 
               style={[styles.categoryBtn, { 
                 backgroundColor: categoryId === c.id ? tokens.colors.primary.base : colors.secondaryBg, 
                 borderColor: colors.border 
               }]}>
                 <Text style={{color: categoryId === c.id ? '#FFF' : colors.text, fontSize: 12, fontWeight: '600'}}>{c.name}</Text>
             </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={[styles.footerLabel, { color: colors.text, marginTop: 14 }]}>Accent color</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.colorRow}>
          {Object.values(tokens.colors.accent).map(c => 
            <TouchableOpacity 
              key={c} 
              onPress={() => setNoteColor(c)} 
              style={[styles.colorDot, { 
                backgroundColor: c, 
                borderWidth: noteColor === c ? 3 : 0, 
                borderColor: colors.text }]}
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1
  },
  topBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 14, 
    borderBottomWidth: 1,
    overflow: 'hidden'
  },
  iconBtn: { 
    padding: 8, 
    borderRadius: 12
  },
  titleArea: { 
    flex: 1, 
    marginLeft: 12 
  },
  brandInline: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  logoImage: { 
    width: 18, 
    height: 18, 
    borderRadius: 5 
  },
  label: { 
    fontSize: 12, 
    textTransform: 'uppercase', 
    letterSpacing: 0.4 
  },
  noteName: { 
    fontSize: 18, 
    fontWeight: '700', 
    marginTop: 2 
  },
  actionsRow: { 
    flexDirection: 'row', 
    gap: 8 
  },
  actionBtn: {
    paddingHorizontal: 12, 
    justifyContent: 'center', 
    borderRadius: 10 
  },
  archiveBtn: { 
    backgroundColor: '#EF4444', 
    paddingHorizontal: 12, 
    justifyContent: 'center', 
    borderRadius: 10 
  },
   trashBtn: { 
    backgroundColor: '#6b7280', 
    paddingHorizontal: 12, 
    justifyContent: 'center', 
    borderRadius: 10 
  },
  saveBtn: { 
    backgroundColor: tokens.colors.primary.base, 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 10 
  },
  saveText: { 
    color: '#FFF', 
    fontSize: 14, 
    fontWeight: '700' 
  },
  colorStrip: { 
    height: 4, 
    marginHorizontal: 14, 
    borderRadius: 4, 
    marginTop: 10 
  },
  editorArea: { 
    flex: 1, 
    paddingHorizontal: 16, 
    paddingTop: 8 
  },
  titleInput: { 
    fontSize: 30, 
    fontWeight: '700', 
    paddingVertical: 8 
  },
  divider: { 
    height: 1, 
    marginBottom: 12 
  },
  markdownToolbar: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 8 
  },
  mdBtn: { 
    fontWeight: '700', 
    fontSize: 12 
  },
  bodyInput: { 
    fontSize: 18, 
    lineHeight: 28, 
    minHeight: 320, 
    textAlignVertical: 'top' 
  },
  footer: { 
    padding: 14, 
    borderTopWidth: 1,
    overflow: 'hidden' 
  },
  footerLabel: { 
    fontSize: 12, 
    marginBottom: 10, 
    textTransform: 'uppercase' 
  },
  colorRow: { 
    gap: 12 
  },
  colorDot: { 
    width: 26, 
    height: 26, 
    borderRadius: 13 
  },
  categoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  }
});

export default EditorScreen;