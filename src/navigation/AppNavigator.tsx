import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, AppState } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { BlurView } from '@react-native-community/blur';
import { Archive, Home, Settings, Trash2 } from 'lucide-react-native';
import { useTheme } from '../themes/ThemeContext';
import { CloudSyncService } from '../services/CloudService';
import AuthService from '../services/AuthService';

import HomeScreen from '../screens/HomeScreen';
import EditorScreen from '../screens/EditorScreen';
import CloudSyncScreen from '../screens/CloudSyncScreen';
import ArchiveScreen from '../screens/ArchiveScreen';
import TrashScreen from '../screens/TrashScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const NotesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="NotesGrid" component={HomeScreen} options={{ title: 'Notes' }} />
    <Stack.Screen name="Editor" component={EditorScreen} options={{ title: 'Edit Note' }} />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SettingsHome" component={CloudSyncScreen} options={{ title: 'Settings & Cloud' }} />
  </Stack.Navigator>
);

const HomeTabs = () => {
  const { colors, isDark } = useTheme();
  return (
    <Tab.Navigator 
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
          position: 'absolute',
          elevation: 0,
        },
        tabBarBackground: () => (
          <View style={{ flex: 1, overflow: 'hidden' }}>
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType={isDark ? "dark" : "light"}
              blurAmount={20}
              reducedTransparencyFallbackColor={colors.secondaryBg}
            />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.glassBg }]} />
          </View>
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700' 
        }
      }}>
      <Tab.Screen name="Notes" component={NotesStack} 
        options={{ 
          tabBarIcon: ({ color }) => <Home size={20} color={color} />
          }} />
      <Tab.Screen name="Archived" component={ArchiveScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <Archive size={20} color={color} />
          }} />
      <Tab.Screen name="Trash" component={TrashScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <Trash2 size={20} color={color} />
          }} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { colors } = useTheme();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
  const subscription = AppState.addEventListener('change', nextAppState => {
    if (
      appState.current.match(/active/) &&
      nextAppState.match(/inactive|background/)
    ) {
      AuthService.ensureAnonymousSignIn()
        .then(user => CloudSyncService.syncAll(user.uid))
        .catch(err => console.warn('[AutoSync] Failed:', err.message));
    }
    appState.current = nextAppState;
  });
  return () => subscription.remove();
}, []);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.secondaryBg, elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: colors.border },
        headerTintColor: colors.text,
        drawerStyle: { backgroundColor: colors.background, width: 280 },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.subtext,
        drawerLabelStyle: { fontWeight: '600' }
      }}>
      <Drawer.Screen name="Home" component={HomeTabs} options={{ drawerIcon: ({ color }) => <Home size={18} color={color} /> }} />
      <Drawer.Screen name="Settings" component={SettingsStack} options={{ drawerIcon: ({ color }) => <Settings size={18} color={color} /> }} />
    </Drawer.Navigator>
  );
};