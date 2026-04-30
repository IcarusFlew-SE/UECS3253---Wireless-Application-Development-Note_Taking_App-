import React from "react";
import { StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Plus } from "lucide-react-native";
import { useTheme } from "../themes/ThemeContext";
import { tokens } from "../themes/theme";

interface FABProps {
    onPress: () => void;
}

const FAB: React.FC<FABProps> = ({ onPress }) => {
    const { isDark } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.fab, {
                backgroundColor: tokens.colors.primary.base,
                shadowColor: tokens.colors.primary.base,
                elevation: 5,
            }]}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <Plus size={24} color="#FFFFFF" strokeWidth={2.5} /> 
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    }
})

export default FAB;