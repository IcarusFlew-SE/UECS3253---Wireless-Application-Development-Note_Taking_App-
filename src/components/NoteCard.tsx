import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pin, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../themes/ThemeContext'; // Import your custom hook
import { tokens } from '../themes/theme';

interface NoteCardProps {
  title: string;
  body: string;
  category: string;
  categoryColor: string;
  timestamp: string;
  isPinned?: boolean;
  onPress?: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  title,
  body,
  category,
  categoryColor,
  timestamp,
  isPinned,
  onPress,
}) => {
  // Pull dynamic colors and theme state
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={[
        styles.card, 
        { 
          backgroundColor: colors.secondaryBg, // Dynamic background
          borderColor: colors.border,          // Dynamic border
          borderLeftColor: categoryColor       // Static category color
        }
      ]} 
      onPress={onPress}
    >
      <View style={[styles.tag, { backgroundColor: `${categoryColor}22` }]}>
        <Text style={[styles.tagText, { color: categoryColor }]}>
          {category}
        </Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
        {title}
      </Text>
      
      <Text style={[styles.body, { color: colors.subtext }]} numberOfLines={3}>
        {body}
      </Text>

      <View style={styles.footer}>
        <Text style={[styles.time, { color: tokens.colors.text.faint }]}>{timestamp}</Text>
        <View style={styles.footerIcons}>
          {isPinned && (
            <Pin 
              size={8} 
              color={colors.primary} 
              fill={isDark ? `${colors.primary}30` : 'transparent'} 
            />
          )}
          {!isPinned && (
             <ChevronRight size={8} color={tokens.colors.text.faint} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 8,
    borderLeftWidth: 2.5,
    marginBottom: 6,
    borderWidth: 0.5,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 7,
    fontWeight: '500',
  },
  title: {
    fontSize: 9,
    fontWeight: '500',
    lineHeight: 12,
    marginBottom: 4,
  },
  body: {
    fontSize: 8,
    lineHeight: 11,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 7,
  },
  footerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default NoteCard;