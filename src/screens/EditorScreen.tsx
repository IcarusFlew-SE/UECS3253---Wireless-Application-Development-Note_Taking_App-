import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Archive, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../themes/ThemeContext';
import { tokens } from '../themes/theme';
import NoteService from '../services/NoteService';
import AuthService from '../services/AuthService';

const EditorScreen = ({ navigation, route }: any) => {
  const { colors } = useTheme();
  const noteId = route?.params?.noteId;
  const [id] = useState(noteId || `${Date.now()}`);
  const [noteColor, setNoteColor] = useState(tokens.colors.accent.teal);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (!noteId) return;
    NoteService.getNoteById(noteId, (note: any) => {
      if (!note) return;
      setTitle(note.title || '');
      setBody(note.body || '');
      setNoteColor(note.color || tokens.colors.accent.teal);
    });
  }, [noteId]);

  const appendMarkdown = (token: string) => setBody(prev => `${prev}${prev ? '\n' : ''}${token}`);

  const onSave = () => {
    NoteService.saveNote({ id, title, body, color: noteColor, category: 'Ideas', isPinned: false }, () => navigation.goBack());
  };

  const onArchive = async () => {
    if (!noteId) return;
    try {
      await AuthService.ensureAnonymousSignIn();
      NoteService.archiveNote(noteId, () => navigation.goBack());
    } catch (e) {
      Alert.alert('Authentication required', 'Please configure Firebase Auth to archive notes.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.iconBtn, { backgroundColor: colors.secondaryBg }]}>
            <ChevronLeft size={18} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titleArea}>
          <View style={styles.brandInline}>
            <Image source={require('../assets/NoteNesterLogo.jpg')} style={styles.logoImage} />
            <Text style={[styles.label, { color: colors.subtext }]}>NoteNest Editor</Text>
          </View>
          <Text style={[styles.noteName, { color: colors.text }]}>{title || 'Untitled note'}</Text>
        </View>
        <View style={styles.actionsRow}>
          {noteId ? (
            <TouchableOpacity style={styles.archiveBtn} onPress={onArchive}>
              <Archive size={16} color="#fff" />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.colorStrip, { backgroundColor: noteColor }]} />
      <ScrollView style={styles.editorArea}>
         <TextInput style={[styles.titleInput, { color: colors.text }]} placeholder="Note Title" value={title} onChangeText={setTitle} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.markdownToolbar}>
          <TouchableOpacity onPress={() => appendMarkdown('**bold text**')}><Text style={[styles.mdBtn, { color: colors.text }]}>Bold</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => appendMarkdown('_italic text_')}><Text style={[styles.mdBtn, { color: colors.text }]}>Italic</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => appendMarkdown('- list item')}><Text style={[styles.mdBtn, { color: colors.text }]}>List</Text></TouchableOpacity>
        </View>
        <TextInput
          style={[styles.bodyInput, { color: colors.subtext }]}
          placeholder="Start typing your note..."
          multiline
          value={body}
          onChangeText={setBody}
        />
      </ScrollView>
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerLabel, { color: colors.subtext }]}>Accent color</Text>
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
                borderColor: '#FFF' }]}
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
    borderBottomWidth: 1
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
  archiveBtn: { 
    backgroundColor: '#EF4444', 
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
    borderTopWidth: 1 
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
});

export default EditorScreen;