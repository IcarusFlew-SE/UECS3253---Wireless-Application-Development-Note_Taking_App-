import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, Settings } from 'lucide-react-native';
import { useTheme } from '../themes/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import EditorScreen from '../screens/EditorScreen';
import CloudSyncScreen from '../screens/CloudSyncScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.secondaryBg, borderTopColor: colors.border, height: 68, paddingTop: 8, paddingBottom: 8, },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' }
    }}>
        <Tab.Screen name="Notes" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <Home size={20} color={color} /> }} />
        <Tab.Screen name="Sync" component={CloudSyncScreen} options={{ tabBarIcon: ({ color }) => <Settings size={20} color={color} /> }} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="Editor" component={EditorScreen} />
    </Stack.Navigator>
);