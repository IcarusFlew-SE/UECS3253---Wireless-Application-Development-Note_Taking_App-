import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Archive, Home, Settings } from 'lucide-react-native';
import { useTheme } from '../themes/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import EditorScreen from '../screens/EditorScreen';
import CloudSyncScreen from '../screens/CloudSyncScreen';
import ArchiveScreen from '../screens/ArchiveScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const NotesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="NotesGrid" component={HomeScreen} options={{ title: 'Notes' }} />
    <Stack.Screen name="Editor" component={EditorScreen} options={{ title: 'Edit Note' }} />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="SettingsHome" component={CloudSyncScreen} options={{ title: 'Settings & Cloud' }} />
  </Stack.Navigator>
);

const HomeTabs = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator 
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.secondaryBg,
          borderTopColor: colors.border,
          height: 68,
          paddingTop: 8,
          paddingBottom: 8 
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700' 
        }
      }}>
      <Tab.Screen name="Notes" component={NotesStack} options={{ tabBarIcon: ({ color }) => <Home size={20} color={color} /> }} />
      <Tab.Screen name="Archived" component={ArchiveScreen} options={{ tabBarIcon: ({ color }) => <Archive size={20} color={color} /> }} />
    </Tab.Navigator>
  );
};


export const AppNavigator = () => {
  const { colors } = useTheme();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.secondaryBg },
        headerTintColor: colors.text,
        drawerStyle: { backgroundColor: colors.background },
        drawerActiveTintColor: colors.primary,
      }}>
      <Drawer.Screen name="Home" component={HomeTabs} options={{ drawerIcon: ({ color }) => <Home size={18} color={color} /> }} />
      <Drawer.Screen name="Settings" component={SettingsStack} options={{ drawerIcon: ({ color }) => <Settings size={18} color={color} /> }} />
    </Drawer.Navigator>
  );
};