import React from "react";
import { StyleSheet, TouchableOpacity} from "react-native";
import { Plus } from "lucide-react-native";
import { tokens } from "../themes/theme";

interface FABProps {
    onPress: () => void;
}

const FAB: React.FC<FABProps> = ({ onPress }) => {
    return (
    <TouchableOpacity
        style={styles.fab}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <Plus size={24} color="#FFFFFF" strokeWidth={2.6} />
    </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 58,
        height: 58,
        borderRadius: 29,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: tokens.colors.primary.base,
        shadowColor: tokens.colors.primary.base,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
}); 

export default FAB;