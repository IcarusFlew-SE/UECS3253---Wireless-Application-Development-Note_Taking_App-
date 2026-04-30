import React, { useEffect} from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useTheme } from "../themes/ThemeContext";
import { tokens } from "../themes/theme";

const LoadingSkeleton = () => {
    const {colors} = useTheme();
    const opacity = React.useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true}),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true}),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[
            styles.card,
            { backgroundColor: colors.secondaryBg, opacity, borderColor: colors.border }
        ]}>
            <View style={[styles.tag, { backgroundColor: tokens.colors.text.faint}]}/>
            <View style={[styles.title, {backgroundColor: tokens.colors.text.faint}]}/>
            <View style={[styles.body, {backgroundColor: tokens.colors.text.faint, width: '60%'}]}/>

        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
    },
    tag: {
        width: 40,
        height: 12,
        borderRadius: 6,
        marginBottom: 8,
    },
    title: {
        width: '80%',
        height: 14,
        borderRadius: 4,
        marginBottom: 10,
    },
    body: {
        width: '100%',
        height: 10,
        borderRadius: 4,
        marginBottom: 6,
    },
});

export default LoadingSkeleton;
