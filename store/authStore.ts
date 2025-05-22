import { Profile } from '@/models/Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface User {
  _id: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
  profile: Profile | null;
   setProfile: (profile: Profile) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  setUser: (user) => {
    AsyncStorage.setItem('authUser', JSON.stringify(user));
    set({ user });
  },

  loadUser: async () => {
    const storedUser = await AsyncStorage.getItem('authUser');
    if (storedUser) {
      set({ user: JSON.parse(storedUser) });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('authUser');
    await AsyncStorage.removeItem('authToken');
    set({ user: null });
  },
   profile: null,
   setProfile: (profile) => {
    set({ profile });
    AsyncStorage.setItem('selectedProfile', JSON.stringify(profile));
  },
}));
