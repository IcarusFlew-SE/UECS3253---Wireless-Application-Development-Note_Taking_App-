import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from './src/themes/ThemeContext';
import {AppNavigator} from './src/navigation/AppNavigator';
import {initDatabase} from './src/database/db';

const App = () => {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDatabase()
      .then(() => {
        console.log('[App] Database initialized ✓');
        setDbReady(true);
      })
      .catch(err => {
        console.error('[App] DB init failed:', err);
        // Still allow app to load - DB may still work even if init "fails"
        setDbReady(true);
      });
  }, []);

  if (!dbReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#8579f3" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d0e1a',
  },
});

export default App;