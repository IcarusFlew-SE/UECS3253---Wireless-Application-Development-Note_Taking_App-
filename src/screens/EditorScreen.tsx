import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
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
      {/* Top Bar */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.iconBtn, { backgroundColor: colors.secondaryBg }]}>
          <ChevronLeft size={16} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titleArea}>
          <Text style={[styles.label, { color: tokens.colors.text.subtle }]}>Editing Note</Text>
          <Text style={[styles.noteName, { color: colors.text }]}>{title || 'Untitled'}</Text>
        </View>
        <TouchableOpacity style={styles.saveBtn}>
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