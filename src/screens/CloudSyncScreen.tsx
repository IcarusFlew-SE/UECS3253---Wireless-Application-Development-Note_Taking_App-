import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Image, Alert } from 'react-native';
import { User, RefreshCw, Moon, DownloadCloud, UploadCloud } from 'lucide-react-native';
import { useTheme } from '../themes/ThemeContext';
import { tokens } from '../themes/theme';
import { CloudSyncService } from '../services/CloudService';
import AuthService from '../services/AuthService';

const CloudSyncScreen = () => {
  const { colors, setMode, isDark } = useTheme();
  const [isSyncing, setIsSyncing] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string>('Never');

  React.useEffect(() => {
    AuthService.ensureAnonymousSignIn().then(user => setUid(user.uid)).catch(console.error);
  }, []);

  const runSync = async (mode: 'all' | 'upload' | 'download') => {
    if (!uid) return Alert.alert('Error', 'Not authenticated');
    setIsSyncing(true);
    try {
      const result =
        mode === 'all'
          ? { ...(await CloudSyncService.syncAll(uid)), at: new Date().toISOString() }
          : mode === 'upload'
          ? { uploaded: await CloudSyncService.syncLocalToCloud(uid), downloaded: 0, at: new Date().toISOString() }
          : { uploaded: 0, downloaded: await CloudSyncService.syncCloudToLocal(uid), at: new Date().toISOString() };

      setLastSync(new Date(result.at).toLocaleString());
      Alert.alert('Sync complete', `Uploaded: ${result.uploaded}\nDownloaded: ${result.downloaded}`);
    } catch (e: any) {
      Alert.alert('Sync failed', e?.message || 'Please check cloud configuration and network.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.brandRow}>
        <Image source={require('../assets/NoteNesterLogo.jpg')} style={styles.logo} />
        <View>
          <Text style={[styles.header, { color: colors.text }]}>Settings</Text>
          <Text style={[styles.subHeader, { color: colors.subtext }]}>Cloud sync, storage and appearance</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.secondaryBg, borderColor: colors.border }]}> 
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: `${tokens.colors.primary.base}20` }]}>
            <User size={18} color={tokens.colors.primary.base} />
          </View>
          <View style={styles.textColumn}>
            <Text style={[styles.label, { color: colors.text }]}>{uid ? `Anonymous User (${uid.substring(0, 6)}...)` : 'Offline'}</Text>
            <Text style={[styles.subLabel, { color: colors.subtext }]}>Persistence: SQLite (local) + Firebase Firestore (cloud)</Text>
            <Text style={[styles.subLabel, { color: colors.subtext, marginTop: 4 }]}>Last sync: {lastSync}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.secondaryBg, borderColor: colors.border }]}>
        <View style={styles.row}>
          <Moon size={16} color={colors.subtext} />
          <Text style={[styles.rowText, { color: colors.text }]}>Dark Mode</Text>
          <Switch value={isDark} onValueChange={() => setMode(isDark ? 'light' : 'dark')} trackColor={{ false: tokens.colors.border.primary, true: tokens.colors.primary.base }} />
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={() => runSync('upload')} disabled={isSyncing}>
          <UploadCloud size={16} color={colors.text} />
          <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={() => runSync('download')} disabled={isSyncing}>
          <DownloadCloud size={16} color={colors.text} />
          <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Receive</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.syncBtn, { backgroundColor: tokens.colors.primary.base }]} onPress={() => runSync('all')} disabled={isSyncing}>
        <RefreshCw size={18} color="#FFF" />
        <Text style={styles.syncBtnText}>{isSyncing ? 'Syncing...' : 'Sync all now'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    paddingBottom: 100 
  },
  brandRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    marginTop: 20, 
    marginBottom: 22 
  },
  logo: { 
    width: 42, 
    height: 42, 
    borderRadius: 12 
  },
  header: { 
    fontSize: 28, 
    fontWeight: '700' 
  },
  subHeader: { 
    fontSize: 14, 
    marginTop: 2 
  },
  section: { 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 14, 
    borderWidth: 1 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  iconBox: { 
    padding: 10, 
    borderRadius: 12, 
    marginRight: 12 
  },
  textColumn: { 
    flex: 1 
  },
  label: { 
    fontSize: 16, 
    fontWeight: '700' 
  },
  subLabel: { 
    fontSize: 13, 
    marginTop: 2 
  },
  rowText: { 
    flex: 1, 
    marginLeft: 12, 
    fontSize: 16 
  },
  actionRow: { 
    flexDirection: 'row', 
    gap: 10 
  },
  secondaryBtn: { 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 8, 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 14 
  },
  secondaryBtnText: { 
    fontWeight: '700' 
  },
  syncBtn: { 
    flexDirection: 'row', 
    padding: 16, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 8, 
    marginTop: 'auto', 
    marginBottom: 20 
  },
  syncBtnText: { 
    color: '#FFF', 
    fontWeight: '700', 
    fontSize: 16 
  },
});

export default CloudSyncScreen;