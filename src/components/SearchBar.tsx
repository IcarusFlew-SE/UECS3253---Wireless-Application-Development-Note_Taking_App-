import React from "react";
import { useTheme } from "../themes/ThemeContext";
import { View, TextInput, StyleSheet } from "react-native";
import { Search } from "lucide-react-native";


const SearchBar = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.searchBox, { backgroundColor: colors.secondaryBg, borderColor: colors.border }]}>
      <Search size={14} color={colors.subtext} />
      <TextInput 
        placeholderTextColor={colors.subtext}
        style={{ color: colors.text, fontSize: 9 }}
        placeholder="Search notes..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
    searchBox: {
        
    },
    input: {

    },
    searchIcon: {
        
    },
});

export default SearchBar;