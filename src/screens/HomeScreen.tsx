import React, { useState, useMemo, useCallback } from "react";
import { View, StyleSheet, Text, FlatList, SafeAreaView, StatusBar, Image } from "react-native";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../themes/ThemeContext";
import { tokens } from "../themes/theme";
import SearchBar from "../components/SearchBar";
import CategoryChip from "../components/CategoryChip";
import NoteCard from "../components/NoteCard";
import FAB from "../components/FAB";
import { getAllNotes, searchNotes } from "../services/noteService";
import { Note } from "../types";

const CATEGORIES = ['ALL', 'Work', 'Personal', 'Ideas', 'Study'];

const CATEGORY_COLORS: Record<string, string> = {
  Work: '#F8CFA6',
  Personal: '#BED8FF',
  Ideas: '#FFC0C0',
  Study: '#D8C4F4',
  General: '#C4F4D8',
};

const HomeScreen = ({ navigation }: { navigation: NavigationProp<any, any> }) => {
    const { colors, isDark } = useTheme();
    const [search, setSearch] = useState('');
    const [activeCat, setActiveCat] = useState('All'); // Track selected category
    const [notes, setNotes] = useState<Note[]>([]);

    // Reload notes every time this screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadNotes();
        }, [])
    );

    const loadNotes = async () => {
        const allNotes = await getAllNotes();
        setNotes(allNotes);
    };

    const handleSearch = async (text: string) => {
        setSearch(text);
        if (text.trim() === '') {
            loadNotes();
        } else {
            const results = await searchNotes(text);
            setNotes(results);
        }
    };

    // Filter by category on top of whatever notes are loaded
    const filteredNotes = useMemo(
        () => notes.filter(n => activeCat === 'ALL' || n.category === activeCat),
        [activeCat, notes],
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View>
                <Text style={[styles.greeting, { color: tokens.colors.text.subtle }]}>Hello!</Text>
                <Text style={[styles.logo, { color: colors.text }]}>Note<Text style={{ color: colors.primary }}>Nest</Text></Text>
            </View>
            <SearchBar value={search} onChangeText={setSearch} />
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={CATEGORIES}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <CategoryChip
                        label={item}
                        isActive={activeCat === item}
                        onPress={() => setActiveCat(item)}
                    />
                )}
                contentContainerStyle={styles.chipList}
            />
        </View>
    );
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <FlatList
                data={filteredNotes}
                ListHeaderComponent={renderHeader}
                numColumns={2}
                keyExtractor={(item) => item.id}
                columnWrapperStyle={styles.gridRow}
                renderItem={({ item }) => (
                    <View style={{ flex: 1, margin: 4 }}>
                        <NoteCard
                            title={item.title}
                            body={item.content}
                            category={item.category}
                            categoryColor={CATEGORY_COLORS[item.category] ?? '#C4F4D8'}
                            timestamp="2h ago"
                            isPinned={false}
                            onPress={() => navigation.navigate('Editor', { noteId: item.id })}
                        />
                    </View>
                )}
                contentContainerStyle={styles.listContent} />
            <FAB onPress={() => navigation.navigate('Editor')} />
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerContainer: { paddingVertical: 12 },
    greeting: { fontSize: 8, marginLeft: 16, fontWeight: '500' },
    logo: { fontSize: 13, marginLeft: 16, fontWeight: '600', marginBottom: 8 },
    chipList: { paddingHorizontal: 16, paddingBottom: 8 },
    gridRow: { paddingHorizontal: 12, justifyContent: 'space-between' },
    listContent: { paddingBottom: 100 }
});

export default HomeScreen;