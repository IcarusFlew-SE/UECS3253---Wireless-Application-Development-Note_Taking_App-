import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../themes/ThemeContext';
import { tokens } from '../themes/theme';

const EditorScreen = ({ navigation, route }: any) => {
  const { colors } = useTheme();
  const [noteColor, setNoteColor] = useState(tokens.colors.accent.teal);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const colorOptions = Object.values(tokens.colors.accent);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Bar */};
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.iconBtn, { backgroundColor: colors.secondaryBg }]}>
          <ChevronLeft size={18} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titleArea}>
          <View style={styles.brandInline}>
            <Image source={require('../assets/NoteNesterLogo.jpg')} style={styles.logoImage} />
            <Text style={[styles.label, { color: colors.subtext }]}>NoteNest Editor</Text>
          </View>
          <Text style={[styles.noteName, { color: colors.text }]}>{title || 'Untitled note'}</Text>
        </View>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic Color Strip */};
      <View style={[styles.colorStrip, {
          backgroundColor: noteColor
        }]} />

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
          placeholder="Start typing your note..."
          placeholderTextColor={tokens.colors.text.subtle}
          multiline value={body}
          onChangeText={setBody}
        />
      </ScrollView>

      {/* Color Picker*/}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerLabel, { color: colors.subtext }]}>Accent color</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorRow}>
          {Object.values(tokens.colors.accent).map((c) => (
            <TouchableOpacity 
              key={c} 
              onPress={() => setNoteColor(c)} 
              style={[styles.colorDot, { backgroundColor: c, borderWidth: noteColor === c ? 3 : 0, borderColor: '#FFF' }]} 
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