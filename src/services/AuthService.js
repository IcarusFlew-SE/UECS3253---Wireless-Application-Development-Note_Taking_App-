import { getApp } from '@react-native-firebase/app';
import { getAuth, signInAnonymously } from '@react-native-firebase/auth';

const app = getApp();
const auth = getAuth(app);

const AuthService = {
  ensureAnonymousSignIn: async () => {
    const current = auth.currentUser;
        if (current) return current;
    const credential = await signInAnonymously(auth);
        return credential.user;
  },
};

export default AuthService;