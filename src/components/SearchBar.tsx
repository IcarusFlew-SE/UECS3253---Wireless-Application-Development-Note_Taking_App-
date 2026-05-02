import React, {useState} from "react";
import { useTheme } from "../themes/ThemeContext";
import { View, TextInput, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Search, X} from "lucide-react-native"

import { BlurView } from '@react-native-community/blur';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onClear?: () => void;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    onClear,
    placeholder = "Search notes..."
}) => {
    const { colors, isDark } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View style={styles.outerContainer}>
            <View
                style={[styles.container, { 
                    borderColor: isFocused ? colors.primary : colors.border 
                }]}>
                    <BlurView
                        style={StyleSheet.absoluteFill}
                        blurType={isDark ? "dark" : "light"}
                        blurAmount={20}
                        reducedTransparencyFallbackColor={colors.secondaryBg}
                    />
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.glassBg }]} />
                    
                    <Search size={18} color={isFocused ? colors.primary : colors.subtext} style={styles.searchIcon} />
                    <TextInput style={[styles.input, { color: colors.text }]}
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        placeholderTextColor={colors.subtext}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        selectionColor={colors.primary}
                        autoCorrect={false}
                        />
                    {value.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                onChangeText('');
                                onClear?.();
                            }}
                            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                            <X size={18} color={colors.subtext} />
                        </TouchableOpacity>
                    )}
                </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: { 
        paddingHorizontal: 16, 
        marginVertical: 10 
    },
    container: { 
        height: 48, 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 14, 
        borderRadius: 14, 
        borderWidth: 1,
        overflow: 'hidden'
    },
    input: { 
        flex: 1, 
        fontSize: 15, 
        fontWeight: '500', 
        paddingVertical: Platform.OS === 'ios' ? 0 : 4 
    },
    searchIcon: { 
        marginRight: 10 
    },
});

export default SearchBar;