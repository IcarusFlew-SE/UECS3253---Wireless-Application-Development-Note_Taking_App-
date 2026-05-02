import React, { useState, useMemo, useEffect, useCallback } from "react";
import { View, StyleSheet, Text, FlatList, SafeAreaView, StatusBar, Image } from "react-native";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useTheme } from "../themes/ThemeContext";
import SearchBar from "../components/SearchBar";
import CategoryChip from "../components/CategoryChip";
import NoteCard from "../components/NoteCard";
import FAB from "../components/FAB";
import NoteService from "../services/NoteService"; 

const CATEGORIES = ['ALL', 'Work', 'Personal', 'Ideas', 'Study'];

const HomeScreen = ({ navigation }: { navigation: NavigationProp<any, any> }) => {
    const {colors, isDark} = useTheme();
    const [search, setSearch] = useState('');
    const [activeCat, setActiveCat] = useState('ALL'); // Track selected category
    const [notes, setNotes] = useState<any[]>([]);

    const loadNotes = useCallback(() => NoteService.getAllNotes(setNotes), []);
    useEffect(loadNotes, [loadNotes]);
    useFocusEffect(useCallback(() => loadNotes(), [loadNotes]));
    
    const filteredNotes = useMemo(
        () => notes.filter(n => (activeCat === 'ALL' || n.category === activeCat) && (`${n.title} ${n.body}`.toLowerCase().includes(search.toLowerCase()))),
        [activeCat, search, notes],
    );

     return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={{flex: 1}}>
        <FlashList
          data={filteredNotes}
          ListHeaderComponent={
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
                keyExtractor={item => item} 
                renderItem={({ item }) => <CategoryChip label={item} isActive={activeCat === item} onPress={() => setActiveCat(item)} />} 
                contentContainerStyle={styles.chipList} />
            </View>
          }
          ListEmptyComponent={<Text style={{ color: colors.subtext, textAlign: 'center', marginTop: 40 }}>No notes found. Tap + to create your first note.</Text>}
          numColumns={2}
          estimatedItemSize={200}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardWrap}>
              <NoteCard 
                  title={item.title || 'Untitled'} 
                  body={item.body || ''} 
                  category={item.category || 'Ideas'} 
                  categoryColor={item.categoryColor || '#BED8FF'} 
                  timestamp="recent" 
                  isPinned={item.isPinned} 
                  onPress={() => navigation.navigate('Editor', { noteId: item.id })} 
              />
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>
      <FAB onPress={() => navigation.navigate('Editor')} />
    </SafeAreaView>
  );
}

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
    cardWrap: { 
        flex: 1, 
        margin: 6,
        paddingHorizontal: 6
    }, 
    listContent: { 
        paddingBottom: 100 
    } 
});

export default HomeScreen;