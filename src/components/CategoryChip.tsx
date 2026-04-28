import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../themes/ThemeContext';
import { tokens } from '../themes/theme';

interface CategoryChipProps {
    label: string;
    isActive: boolean;
    onPress: () => void;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ label, isActive, onPress }) => {
    const {colors} = useTheme();
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[
                styles.chip,
                {
                    //Dynamic Backgroun
                    backgroundColor: isActive ? tokens.colors.primary.base : colors.secondaryBg,
                    borderColor: isActive ? tokens.colors.primary.light : colors.border,
                },
            ]}
        >
            <Text
                style={[
                    styles.label,
                    {
                        color: isActive ? '#FFFFFF' : colors.subtext,
                    },
                ]}
                >
                    {label}
                </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 8,
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'uppercase'
    }
})

export default CategoryChip;