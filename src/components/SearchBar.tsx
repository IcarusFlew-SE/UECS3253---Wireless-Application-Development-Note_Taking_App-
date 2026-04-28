import React, {useState} from "react";
import { useTheme } from "../themes/ThemeContext";
import { View, TextInput, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Search, X} from "lucide-react-native";
import { tokens } from '../themes/theme';

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
    const { colors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View style={styles.outerContainer}>
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.secondaryBg,
                        borderColor: isFocused ? colors.primary : colors.border,
                        elevation: isFocused ? 2 : 0,
                    }
                ]}
                >
                    <Search
                        size={14}
                        color={isFocused ? colors.primary : tokens.colors.text.subtle}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={[styles.input, {color: colors.text}]}
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        placeholderTextColor={tokens.colors.text.muted}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        selectionColor={colors.primary}
                        autoCorrect={false}
                        />
                    {value.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                onChangeText('');
                                if (onClear) onClear();
                            }}
                            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                            <X size={14} color={tokens.colors.text.subtle} />
                        </TouchableOpacity>
                    )}
                </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        paddingHorizontal: 12,
        marginVertical: 8,
    },
    container: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 10, //tokens.radius.lg
        borderWidth: 1,
    },
    input: {
        flex: 1,
        fontSize: 9, // tokens.type.body.size
        fontWeight: '400',
        paddingVertical: Platform.OS === 'ios' ? 0 : 4,
    },
    searchIcon: {
        marginRight: 8,
    },
});

export default SearchBar;