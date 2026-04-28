import React from "react";
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Sun, Moon, Monitor} from 'lucide-react-native';
import {useTheme} from '../themes/ThemeContext';
import {tokens} from '../themes/theme';

export const ThemeToggle = () => {
    const {mode, setMode, colors} = useTheme();

    const Option = ({ type, Icon, label}: any) => {
        const isActive = mode === type;
        return (
            <TouchableOpacity onPress={() => setMode(type)}
                style={[
                    styles.btn,
                    {backgroundColor: isActive ? tokens.colors.primary.muted : 'transparent' }
                ]}
            >
                <Icon size={14} color={isActive ? tokens.colors.primary.light : tokens.colors.text.muted} />
                <Text style={[styles.label, {color: isActive ? tokens.colors.text.primary : tokens.colors.text.faint}]}>
                    {label}
                </Text>
            </TouchableOpacity>
        )
    }
    return (
        <View style={[styles.container, {backgroundColor: tokens.colors.bg.surface[2] }]}>
            <Option type="light" Icon={Sun} label="Light" />
            <Option type="dark" Icon={Moon} label="Dark" />
            <Option type="system" Icon={Monitor} label="System" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 4,
        borderRadius: 12,
        marginHorizontal: 12,
        gap: 4
    },
    btn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6
    },
    label: {
        fontSize: 8,
        fontWeight: '600',
        textTransform: 'uppercase'
    }
})