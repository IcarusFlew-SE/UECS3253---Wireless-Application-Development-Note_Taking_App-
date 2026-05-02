import auth from '@react-native-firebase/auth';

const AuthService = {
  getCurrentUser: () => auth().currentUser,

  ensureAnonymousSignIn: async () => {
    const current = auth().currentUser;
    if (current) return current;
    const credential = await auth().signInAnonymously();
    return credential.user;
  },
};

export default AuthService;