import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import { useTheme } from '../themes/ThemeContext';
import { tokens } from '../themes/theme';
import { createNote, getNoteById, updateNote, deleteNote, validateNote } from '../services/noteService';

const EditorScreen = ({ navigation, route }: any) => {
  const { colors } = useTheme();
  const [noteColor, setNoteColor] = useState(tokens.colors.accent.teal);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('General');

  const colorOptions = Object.values(tokens.colors.accent);

  // If noteId was passed via navigation, we are editing an existing note
  const noteId = route?.params?.noteId;
  const isEditing = !!noteId;

  useEffect(() => {
    if (isEditing) {
      loadExistingNote();
    }
  }, [noteId]);

  const loadExistingNote = async () => {
    const note = await getNoteById(noteId);
    if (note) {
      setTitle(note.title);
      setBody(note.content);
      setCategory(note.category);
    }
  };

  // SAVE (Create or Update)
  const handleSave = async () => {
    const validation = validateNote(title, body);
    if (!validation.valid) {
      Alert.alert('Cannot Save', validation.error);
      return;
    }

    if (isEditing) {
      const updated = await updateNote(noteId, title, body, category);
      if (updated) {
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update note. Please try again.');
      }
    } else {
      const created = await createNote(title, body, category);
      if (created) {
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to save note. Please try again.');
      }
    }
  };

  // DELETE
  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteNote(noteId);
            if (success) {
              navigation.goBack();
            } else {
              Alert.alert('Error', 'Failed to delete note.');
            }
          },
        },
      ]
    );
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.iconBtn, { backgroundColor: colors.secondaryBg }]}>
          <ChevronLeft size={16} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titleArea}>
          <Text style={[styles.label, { color: tokens.colors.text.subtle }]}>Editing Note</Text>
          <Text style={[styles.noteName, { color: colors.text }]}>{title || 'Untitled'}</Text>
        </View>
        {/* Delete icon */}
        {isEditing && (
          <TouchableOpacity
            onPress={handleDelete}
            style={[styles.iconBtn, { backgroundColor: colors.secondaryBg, marginRight: 8 }]}
          >
            <Trash2 size={18} color="#ff4d4d" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic Color Strip */}
      <View style={[styles.colorStrip, { backgroundColor: noteColor }]} />

      <ScrollView style={styles.editorArea}>
        <TextInput
          style={[styles.titleInput, { color: colors.text }]}
          placeholder="Note Title"
          placeholderTextColor={tokens.colors.text.muted}
          value={title}
          onChangeText={setTitle}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <TextInput
          style={[styles.bodyInput, { color: colors.subtext }]}
          placeholder="Start typing..."
          placeholderTextColor={tokens.colors.text.faint}
          multiline
          value={body}
          onChangeText={setBody}
        />
      </ScrollView>

      {/* Color Picker[cite: 1] */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={styles.footerLabel}>Accent Color</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorRow}>
          {colorOptions.map((c) => (
            <TouchableOpacity 
              key={c} 
              onPress={() => setNoteColor(c)}
              style={[styles.colorDot, { backgroundColor: c, borderWidth: noteColor === c ? 2 : 0, borderColor: '#FFF' }]} 
            />
          ))}
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
        padding: 12, 
        borderBottomWidth: 1 },
    iconBtn: { 
        padding: 6, 
        borderRadius: 8 
    },
    titleArea: { 
        flex: 1, 
        marginLeft: 12 
    },
    label: { 
        fontSize: 7, 
        textTransform: 'uppercase' 
    },
    noteName: { 
        fontSize: 10, 
        fontWeight: '600' 
    },
    saveBtn: { 
        backgroundColor: tokens.colors.primary.base, 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 8 
    },
    saveText: { 
        color: '#FFF', 
        fontSize: 9, 
        fontWeight: '600' 
    },
    colorStrip: { 
        height: 3, 
        marginHorizontal: 12, 
        borderRadius: 2, 
        marginBottom: 8 
    },
    editorArea: { 
        flex: 1, 
        paddingHorizontal: 16 
    },
    titleInput: { 
        fontSize: 14, 
        fontWeight: '600', 
        paddingVertical: 8 
    },
    divider: { 
        height: 1, 
        marginBottom: 12 
    },
    bodyInput: { 
        fontSize: 10, 
        lineHeight: 18, 
        textAlignVertical: 'top' 
    },
    footer: { 
        padding: 12, 
        borderTopWidth: 1 
    },
    footerLabel: { 
        fontSize: 7, 
        color: tokens.colors.text.subtle, 
        marginBottom: 8, 
        textTransform: 'uppercase' 
    },
    colorRow: { 
        gap: 10 
    },
    colorDot: { 
        width: 16, 
        height: 16, 
        borderRadius: 8 
    }
});

export default EditorScreen;