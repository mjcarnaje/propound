import { StudentDocType } from "@propound/types";
import create from "zustand";

interface AuthState {
  user: StudentDocType | null;
  loading: boolean;
  setUser: (user: StudentDocType | null) => void;
  setLoading: (loading: boolean) => void;
  setEnrolledGames: (e: string[]) => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  loading: false,
  token: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setEnrolledGames: (enrolledGames) => {
    if (get().user) {
      set((state) => ({
        user: {
          ...state.user,
          enrolledGames,
        },
      }));
    }
  },
}));
