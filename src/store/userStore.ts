import { create } from 'zustand';
type UserProfile = 'dilma' | 'carla';
interface UserState {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
}
export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}));