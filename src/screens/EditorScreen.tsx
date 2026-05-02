import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Archive, ChevronLeft, Trash2, Pin, Check } from 'lucide-react-native';
import { BlurView } from '@react-native-community/blur';
import { useTheme } from '../themes/ThemeContext';
import { tokens } from '../themes/theme';
import NoteService from '../services/NoteService';

// Accent colour palette derived from theme tokens
const ACCENT_COLORS = [
  { label: 'Teal', value: tokens.colors.accent.teal },
  { label: 'Gold', value: tokens.colors.accent.gold },
  { label: 'Rose', value: tokens.colors.accent.rose },
  { label: 'Mint', value: tokens.colors.accent.mint },
  { label: 'Sky', value: tokens.colors.accent.sky },
  { label: 'Coral', value: tokens.colors.accent.coral },
];

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
  const [isSaving, setIsSaving] = useState(false);

  // ── Load categories 
  const loadCategories = useCallback(() => {
    NoteService.getCategories((items: any[]) => {
      if (!items || items.length === 0) {
        setTimeout(() => NoteService.getCategories(setCategories), 250);
      } else {
        setCategories(items);
      }
    });
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [loadCategories]),
  );

  // ── Load existing note 
  useEffect(() => {
    if (!noteId) return;
    NoteService.getNoteById(noteId, (note: any) => {
      if (note) {
        setTitle(note.title || '');
        setBody(note.body || '');
        setNoteColor(note.color || tokens.colors.accent.teal);
        setCategoryId(note.category_id || null);
        setIsPinned(!!note.isPinned);
      }
      setIsLoaded(true);
    });
  }, [noteId]);

  // ── Debounced auto-save (fires 1.5 s after last keystroke) 
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      _persistNote(() => {});
    }, 1500);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
    
  }, [title, body, noteColor, categoryId, isPinned, isLoaded]);

  //  Helpers
  const _persistNote = (cb: () => void) => {
    NoteService.saveNote(
      {
        id,
        title,
        body,
        color: noteColor,
        category_id: categoryId,
        isPinned,
        is_deleted: 0,
        is_archived: 0,
      },
      cb,
    );
  };

  const saveDraftIfNeeded = (cb?: () => void) => {
    if (!title.trim() && !body.trim()) {
      cb?.();
      return;
    }
    _persistNote(() => cb?.());
  };

  const onSave = () => {
    if (!title.trim() && !body.trim()) {
      Alert.alert('Empty note', 'Add a title or some content before saving.');
      return;
    }
    setIsSaving(true);
    _persistNote(() => {
      setIsSaving(false);
      navigation.goBack();
    });
  };

  const onTrash = () => {
    if (!noteId) {navigation.goBack(); return;}
    Alert.alert('Move to Trash', 'Move this note to trash?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Trash',
        style: 'destructive',
        onPress: () => NoteService.moveToTrash(noteId, () => navigation.goBack()),
      },
    ]);
  };

  const onArchive = () => {
    if (!noteId) {navigation.goBack(); return;}
    NoteService.archiveNote(noteId, () => navigation.goBack());
  };

  const appendMarkdown = (token: string) =>
    setBody(prev => `${prev}${prev ? '\n' : ''}${token}`);

  //  Derived state
  const selectedCategory = categories.find(c => c.id === categoryId);

  //  Render
  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.topBar, {borderBottomColor: colors.border}]}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType={isDark ? 'dark' : 'light'}
          blurAmount={20}
          reducedTransparencyFallbackColor={colors.background}
        />
        <View style={[StyleSheet.absoluteFill, {backgroundColor: colors.glassBg}]} />

        <TouchableOpacity onPress={() => saveDraftIfNeeded(() => navigation.goBack())} style={styles.iconBtn}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.titleArea}>
          <View style={styles.brandInline}>
            <Image
              source={require('../assets/NoteNesterLogo.jpg')}
              style={styles.logoImage}
            />
            <Text style={[styles.brandLabel, {color: colors.subtext}]}>
              NoteNest Editor
            </Text>
          </View>
          <Text
            style={[styles.noteName, {color: colors.text}]}
            numberOfLines={1}>
            {title || 'Untitled note'}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {backgroundColor: isPinned ? colors.primary : colors.secondaryBg},
            ]}
            onPress={() => setIsPinned(!isPinned)}>
            <Pin size={16} color={isPinned ? '#FFF' : colors.text} />
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

          <TouchableOpacity
            style={[styles.saveBtn, isSaving && {opacity: 0.6}]}
            onPress={onSave}
            disabled={isSaving}>
            <Text style={styles.saveText}>{isSaving ? 'Saving…' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.colorStrip, {backgroundColor: noteColor}]} />

      <ScrollView
        style={styles.editorArea}
        contentContainerStyle={{paddingBottom: 12}}
        keyboardShouldPersistTaps="handled">
        <TextInput
          style={[styles.titleInput, {color: colors.text}]}
          placeholder="Note Title"
          placeholderTextColor={colors.subtext}
          value={title}
          onChangeText={setTitle}
        />
        <View style={[styles.divider, {backgroundColor: colors.border}]} />

        <View style={styles.markdownToolbar}>
          {[
            {label: 'Bold', token: '**bold text**'},
            {label: 'Italic', token: '_italic text_'},
            {label: 'List', token: '- item'},
            {label: 'H1', token: '# Heading'},
            {label: 'Code', token: '`code`'},
          ].map(({label, token}) => (
            <TouchableOpacity
              key={label}
              style={[styles.mdPill, {backgroundColor: colors.secondaryBg, borderColor: colors.border}]}
              onPress={() => appendMarkdown(token)}>
              <Text style={[styles.mdBtn, {color: colors.text}]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={[styles.bodyInput, {color: colors.text}]}
          placeholder="Start typing your note…"
          placeholderTextColor={colors.subtext}
          multiline
          value={body}
          onChangeText={setBody}
          textAlignVertical="top"
        />
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom + 10, tabBarHeight + 10),
          },
        ]}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType={isDark ? 'dark' : 'light'}
          blurAmount={20}
          reducedTransparencyFallbackColor={colors.background}
        />
        <View style={[StyleSheet.absoluteFill, {backgroundColor: colors.glassBg}]} />

        <View style={styles.sectionHeader}>
          <Text style={[styles.footerLabel, {color: colors.text}]}>
            Category
          </Text>
          {selectedCategory && (
            <View
              style={[
                styles.selectedBadge,
                {backgroundColor: `${selectedCategory.color}25`},
              ]}>
              <View
                style={[
                  styles.categoryDot,
                  {backgroundColor: selectedCategory.color},
                ]}
              />
              <Text style={[styles.selectedBadgeText, {color: selectedCategory.color}]}>
                {selectedCategory.name}
              </Text>
            </View>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}>
          {categories.map(c => {
            const isSelected = categoryId === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setCategoryId(c.id)}
                style={[
                  styles.categoryBtn,
                  {
                    backgroundColor: isSelected
                      ? c.color
                      : colors.secondaryBg,
                    borderColor: isSelected ? c.color : colors.border,
                  },
                ]}>
                {isSelected && (
                  <Check size={12} color="#FFF" style={{marginRight: 4}} />
                )}
                <Text
                  style={[
                    styles.categoryBtnText,
                    {color: isSelected ? '#FFF' : colors.text},
                  ]}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={[styles.footerLabel, {color: colors.text, marginTop: 14}]}>
          Accent Colour
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}>
          {ACCENT_COLORS.map(({label, value}: {label: string; value: string}) => {
            const isSelected = noteColor === value;
            return (
              <TouchableOpacity
                key={value}
                onPress={() => setNoteColor(value)}
                style={styles.colorOption}>
                <View
                  style={[
                    styles.colorDot,
                    {
                      backgroundColor: value,
                      borderWidth: isSelected ? 3 : 0,
                      borderColor: colors.text,
                      transform: [{scale: isSelected ? 1.15 : 1}],
                    },
                  ]}
                />
                <Text style={[styles.colorLabel, {color: colors.subtext}]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
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
    overflow: 'hidden',
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
  brandLabel: {
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
    borderRadius: 10,
  },
  trashBtn: {
    backgroundColor: '#6b7280',
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 10,
  },
  saveBtn: {
    backgroundColor: tokens.colors.primary.base,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
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
  divider: {height: 1, marginBottom: 12},

  markdownToolbar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  mdPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  mdBtn: {fontWeight: '700', fontSize: 12},

  bodyInput: {
    fontSize: 17,
    lineHeight: 27,
    minHeight: 280,
    textAlignVertical: 'top',
  },

  footer: {
    padding: 14,
    borderTopWidth: 1,
    overflow: 'hidden'
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    gap: 6,
  },
  selectedBadgeText: {
    fontSize: 12,
    fontWeight: '700'
  },
  chipRow: {
    gap: 10,
    paddingBottom: 4
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  categoryBtnText: {
    fontSize: 13,
    fontWeight: '600'
  },
  colorOption: {
    alignItems: 'center',
    gap: 4
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14
  },
  colorLabel: {
    fontSize: 10,
    fontWeight: '500'
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
});

export default EditorScreen;