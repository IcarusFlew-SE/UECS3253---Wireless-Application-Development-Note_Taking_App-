import React from "react";
import { StyleSheet, Text, View, TextInputProps } from "react-native";
import { useTheme } from "../themes/ThemeContext";
import { tokens } from "../themes/theme";
import { TextInput } from "react-native-gesture-handler";

interface InputFieldProps extends TextInputProps {
    label?: string;
    isMultiline?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, isMultiline, style, ...props })=> {
    const { colors } = useTheme();
    return (
        <View style={styles.container}>
            {label && (
                <Text style={[styles.label, {color: tokens.colors.text.muted}]}>
                    {label}
                </Text>
            )}
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.secondaryBg,
                        color: colors.text,
                        borderColor: colors.border,
                        textAlignVertical: isMultiline ? 'top' : 'center',
                        minHeight: isMultiline ? 120 : 40,
                    },
                    style,
                ]}
                placeholderTextColor={tokens.colors.text.faint}
                multiline={isMultiline}
                {...props}
                />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        width: '100%',
    },
    label: {
        marginBottom: 4,
        marginLeft: 4,
        fontSize: 8,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 10
    }
});

export default InputField;