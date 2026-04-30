import React, { useState } from "react";
import { View, StyleSheet, Text, FlatList, SafeAreaView, StatusBar, Image } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { useTheme } from "../themes/ThemeContext";
import { tokens } from "../themes/theme";
import SearchBar from "../components/SearchBar";
import CategoryChip from "../components/CategoryChip";
import NoteCard from "../components/NoteCard";
import FAB from "../components/FAB";

const dummyNotes = [
    { id: '1', title: 'Project Outline', category: 'Work', preview: 'Outlining project scope...', color: '#f8d48c' },
    { id: '2', title: 'Shopping List', category: 'Personal', preview: 'Milk, eggs, bread...', color: '#b6d2ff' },
    { id: '3', title: 'Gym Plan', category: 'Ideas', preview: 'Chest, back, legs...', color: '#ffb2b2' },
    { id: '4', title: 'Book Ideas', category: 'Study', preview: 'Sci-fi novel, fantasy series...', color: '#d3b1e6' }
];

const CATEGORIES = ['ALL', 'Work', 'Personal', 'Ideas', 'Study'];

const HomeScreen = ({ navigation }: { navigation: NavigationProp<any, any> }) => {
    const { colors, isDark } = useTheme();
    const [search, setSearch] = useState('');
    const [activeCat, setActiveCat] = useState('All'); // Track selected category

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
                data={dummyNotes}
                ListHeaderComponent={renderHeader}
                numColumns={2}
                keyExtractor={(item) => item.id}
                columnWrapperStyle={styles.gridRow}
                renderItem={({ item }) => (
                    <View style={{ flex: 1, margin: 4 }}>
                        <NoteCard
                            title={item.title}
                            body={item.body}
                            category={item.category}
                            categoryColor={item.color}
                            timestamp="2h ago"
                            isPinned={item.isPinned}
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