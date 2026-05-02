import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsService = {
  setTheme: async theme => {
    await AsyncStorage.setItem('@app_theme', theme);
  },
  getTheme: async () => {
    return (await AsyncStorage.getItem('@app_theme')) || 'system';
  },
};