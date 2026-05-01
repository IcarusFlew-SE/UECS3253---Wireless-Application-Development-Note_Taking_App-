import React, { useState, useMemo } from "react";
import { View, StyleSheet, Text, FlatList, SafeAreaView, StatusBar, Image } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { useTheme } from "../themes/ThemeContext";
import SearchBar from "../components/SearchBar";
import CategoryChip from "../components/CategoryChip";
import NoteCard from "../components/NoteCard";
import FAB from "../components/FAB";

const dummyNotes = [
    { id: '1', title: 'Project Outline', category: 'Work', body: 'Outlining project scope and sprint goals.', color: '#F8CFA6', isPinned: true },
    { id: '2', title: 'Shopping List', category: 'Personal', body: 'Milk, eggs, bread, and coffee beans.', color: '#BED8FF' },
    { id: '3', title: 'Gym Plan', category: 'Ideas', body: 'Chest day progression and mobility routine.', color: '#FFC0C0' },
    { id: '4', title: 'Book Ideas', category: 'Study', body: 'Sci-fi world-building and chapter sketch.', color: '#D8C4F4' },
];

const CATEGORIES = ['ALL', 'Work', 'Personal', 'Ideas', 'Study'];

const HomeScreen = ({ navigation }: { navigation: NavigationProp<any, any> }) => {
    const {colors, isDark} = useTheme();
    const [search, setSearch] = useState('');
    const [activeCat, setActiveCat] = useState('ALL'); // Track selected category

    const filteredNotes = useMemo(
        () => dummyNotes.filter((n) => (activeCat === 'ALL' || n.category === activeCat) && (`${n.title} ${n.body}`.toLowerCase().includes(search.toLowerCase()))),
        [activeCat, search],
    );

    const renderHeader = () => (
      <View style={styles.headerContainer}>
        <View style={styles.brandRow}>
          <Image source={require('../assets/NoteNesterLogo.jpg')} style={styles.logoImage} />
          <View>
            <Text style={[styles.greeting, { color: colors.subtext }]}>Welcome back!</Text>
            <Text style={[styles.logoText, { color: colors.text }]}>NoteNest</Text>
          </View>
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
                <View style={styles.cardWrap}>
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
            contentContainerStyle={styles.listContent}
            />
            <FAB onPress={() => navigation.navigate('Editor')} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1 
    },
    headerContainer: {
        paddingVertical: 14 
    },
    brandRow: {
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 16, 
        gap: 10 
    },
    logoImage: {
         width: 36, 
         height: 36, 
         borderRadius: 10 
    },
    greeting: { 
        fontSize: 14 
    },
    logoText: { 
        fontSize: 26, 
        fontWeight: '700' 
    },  
    chipList: { 
        paddingHorizontal: 16, 
        paddingTop: 6, 
        paddingBottom: 10 
    },
    gridRow: { 
        paddingHorizontal: 12, 
        justifyContent: 'space-between' 
    },
    cardWrap: { 
        flex: 1, 
        margin: 6 
    },
    listContent: { 
        paddingBottom: 100 
    },
});

export default HomeScreen;