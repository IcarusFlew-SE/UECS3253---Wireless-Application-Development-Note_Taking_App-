import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Cloud, Wifi, User, RefreshCw, Moon } from 'lucide-react-native';
import { useTheme } from '../themes/ThemeContext';
import { tokens } from '../themes/theme';

const CloudSyncScreen = () => {
  const { colors, mode, setMode, isDark } = useTheme();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000); // Simulated sync
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Settings & Cloud</Text>

      {/* Account Section */}
      <View style={[styles.section, { backgroundColor: colors.secondaryBg }]}>
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: `${tokens.colors.primary.base}22` }]}>
            <User size={16} color={tokens.colors.primary.base} />
          </View>
          <View style={styles.textColumn}>
            <Text style={[styles.label, { color: colors.text }]}>Guest User</Text>
            <Text style={[styles.subLabel, { color: colors.subtext }]}>syncing to cloud-nest-db</Text>
          </View>
        </View>
      </View>

      {/* Theme Toggle Section */}
      <View style={[styles.section, { backgroundColor: colors.secondaryBg }]}>
        <View style={styles.row}>
          <Moon size={16} color={colors.subtext} />
          <Text style={[styles.rowText, { color: colors.text }]}>Dark Mode</Text>
          <Switch 
            value={isDark} 
            onValueChange={() => setMode(isDark ? 'light' : 'dark')}
            trackColor={{ false: tokens.colors.border.primary, true: tokens.colors.primary.base }}
          />
        </View>
      </View>

      {/* Sync Action */}
      <TouchableOpacity 
        style={[styles.syncBtn, { backgroundColor: tokens.colors.primary.base }]}
        onPress={handleSync}
        disabled={isSyncing}
      >
        <View style={isSyncing ? { transform: [{ rotate: '45deg' }] } : {}}>
          <RefreshCw size={16} color="#FFF" />
        </View>
        <Text style={styles.syncBtnText}>{isSyncing ? 'Syncing...' : 'Sync Now'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20 
    },
    header: { 
        fontSize: 13, 
        fontWeight: '600', 
        marginBottom: 24, 
        marginTop: 40 
    },
    section: { 
        borderRadius: 12, 
        padding: 16, 
        marginBottom: 16 
    },
    row: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    iconBox: { 
        padding: 8, 
        borderRadius: 8, 
        marginRight: 12 
    },
    textColumn: { 
        flex: 1 
    },
    label: { 
        fontSize: 10, 
        fontWeight: '600' 
    },
    subLabel: { 
        fontSize: 8 
    },
    rowText: { 
        flex: 1, 
        marginLeft: 12, 
        fontSize: 9 
    },
    syncBtn: { 
        flexDirection: 'row', 
        padding: 14, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 8, 
        marginTop: 'auto', 
        marginBottom: 20 
    },
    syncBtnText: { 
        color: '#FFF', 
        fontWeight: '600', 
        fontSize: 10 
    }
});

export default CloudSyncScreen;