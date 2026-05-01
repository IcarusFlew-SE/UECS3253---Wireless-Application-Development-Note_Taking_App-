import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pin, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../themes/ThemeContext';
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
      activeOpacity={0.8} 
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
      <View style={[styles.tag, { backgroundColor: `${categoryColor}26` }]}>
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
        {isPinned ? 
          <Pin size={14} 
            color={colors.primary} 
            fill={isDark ? `${colors.primary}30` : 'transparent'} 
          /> 
            : 
          <ChevronRight size={14} color={tokens.colors.text.faint} />
        }
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    card: { 
        borderRadius: 16, 
        padding: 14, 
        borderLeftWidth: 3, 
        marginBottom: 8, 
        borderWidth: 1, 
        minHeight: 150
    },
    tag: { 
        alignSelf: 'flex-start', 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 99, 
        marginBottom: 10 
    },
    tagText: { 
        fontSize: 11, 
        fontWeight: '600' 
    },
    title: { 
        fontSize: 18, 
        fontWeight: '700', 
        lineHeight: 23, 
        marginBottom: 8 
    },
    body: { 
        fontSize: 14, 
        lineHeight: 20, 
        marginBottom: 10 
    },
    footer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: 'auto' 
    },
    time: { 
        fontSize: 12 
    },
});

export default NoteCard;