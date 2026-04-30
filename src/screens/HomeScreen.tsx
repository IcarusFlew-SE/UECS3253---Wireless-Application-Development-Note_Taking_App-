import React, {useState} from "react";
import { View, StyleSheet, Text, FlatList, SafeAreaView, StatusBar } from "react-native";
import { useTheme } from "../themes/ThemeContext";
import { tokens } from "../themes/theme";
import SearchBar from "../components/SearchBar";
import CategoryChip from "../components/CategoryChip";
import NoteCard from "../components/NoteCard";
import FAB from "../components/FAB";

const dummyNotes = [
    { id: '1', title: 'Project Outline', category: 'Work', preview: 'Outlining project scope...', color: '#f8d48c'},
    { id: '2', title: 'Shopping List', category: 'Personal', preview: 'Milk, eggs, bread...', color: '#b6d2ff'},
    { id: '3', title: 'Gym Plan', category: 'Ideas', preview: 'Chest, back, legs...', color: '#ffb2b2'},
    { id: '4', title: 'Book Ideas', category: 'Study', preview: 'Sci-fi novel, fantasy series...', color: '#d3b1e6'}
];

const CATEGORIES = ['ALL', 'Work','Personal', 'Ideas', 'Study'];

const HomeScreen = ({ navigation }) => {
    const {colors, isDark} = useTheme();
    const [search, setSearch] = useState('');
    
}