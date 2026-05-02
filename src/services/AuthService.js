import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = 'ws_user_id';

const generateId = () => `user_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const AuthService = {
  getCurrentUser: async () => {
    const uid = await AsyncStorage.getItem(USER_ID_KEY);
    return uid ? { uid } : null;
  },

  ensureAnonymousSignIn: async () => {
    let uid = await AsyncStorage.getItem(USER_ID_KEY);
    if (!uid) {
      uid = generateId();
      await AsyncStorage.setItem(USER_ID_KEY, uid);
    }
    return { uid };
  },
};

export default AuthService;