import { ClipboardList } from "lucide-react-native";
import React from "react";
import { View, StyleSheet, Text} from 'react-native';
import { useTheme } from "../themes/ThemeContext";
import {tokens} from '../themes/theme';

interface EmptyStateProps {
    message?: string;
    subMessage?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    message = "No notes found",
    subMessage = "Tap the + button to create a note."
}) => {
    const {colors} = useTheme();
    return (
        <View style={styles.container}>
            <View style={[styles.iconCircle, {backgroundColor: tokens.colors.bg.surface[2] }]}>
                <ClipboardList size={32} color={tokens.colors.text.faint} strokeWidth={1.5} />
            </View>
            <Text style={[styles.title, {color: colors.text}]}>{message}</Text>
            <Text style={[styles.subTitle, {color: colors.subtext}]}>{subMessage}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 40,
        alignItems: 'center',
        marginTop: 60,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 9,
        textAlign: 'center',
        lineHeight: 14, 
    },
})

export default EmptyState;