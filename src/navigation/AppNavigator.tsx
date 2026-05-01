import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Home, Settings } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../themes/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import EditorScreen from '../screens/EditorScreen';
import CloudSyncScreen from '../screens/CloudSyncScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const TabNavigator = () => {
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
      <Tab.Screen name="Notes" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <Home size={20} color={color} /> }} />
      <Tab.Screen name="Sync" component={CloudSyncScreen} options={{ tabBarIcon: ({ color }) => <Settings size={20} color={color} /> }} />
    </Tab.Navigator>
  );
};

const DrawerNavigator = () => {
  const { colors } = useTheme();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.secondaryBg },
        headerTintColor: colors.text,
        drawerStyle: { backgroundColor: colors.background },
        drawerActiveTintColor: colors.primary,
      }}>
      <Drawer.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
      <Drawer.Screen name="Settings" component={CloudSyncScreen} />
    </Drawer.Navigator>
  );
};

export const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Main" component={DrawerNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="Editor" component={EditorScreen} options={{ title: 'Edit Note' }} />
  </Stack.Navigator>
);