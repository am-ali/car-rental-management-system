import { create } from 'zustand';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (response: { token: string; user: User }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
  setAuth: (response) => {
    localStorage.setItem('token', response.token);
    set({ user: response.user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
}));