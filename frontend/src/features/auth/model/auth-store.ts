import { create } from 'zustand';
import { apiClient } from '@/shared/api/api-client';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

type AuthStore = {
  set: (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>)) => void;
  get: () => AuthState;
};

// Мок-данные для dev-режима
const MOCK_USER: User = {
  id: '1',
  email: 'dev@graviton.ru',
  username: 'Dev User'
};

export const useAuthStore = create<AuthState>((set: AuthStore['set'], get: AuthStore['get']) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // В dev-режиме используем мок-логин
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock login in development mode');
        set({ 
          user: MOCK_USER, 
          isAuthenticated: true, 
          isLoading: false 
        });
        console.log('isAuthenticated:', get().isAuthenticated);
        return;
      }

      // Реальный логин для production
      const response = await apiClient.post('/auth/login', { email, password });
      const userData = await apiClient.get('/user/profile');
      set({ user: userData.data, isAuthenticated: true, isLoading: false });
      console.log('isAuthenticated:', get().isAuthenticated);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to login', 
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (email: string, password: string, username: string) => {
    set({ isLoading: true, error: null });
    try {
      // В dev-режиме используем мок-регистрацию
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock registration in development mode');
        set({ 
          user: { ...MOCK_USER, email, username }, 
          isAuthenticated: true, 
          isLoading: false 
        });
        console.log('isAuthenticated:', get().isAuthenticated);
        return;
      }

      // Реальная регистрация для production
      await apiClient.post('/auth/signup', { email, password, username });
      const response = await apiClient.post('/auth/login', { email, password });
      const userData = await apiClient.get('/user/profile');
      set({ user: userData.data, isAuthenticated: true, isLoading: false });
      console.log('isAuthenticated:', get().isAuthenticated);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to register', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      // В dev-режиме просто очищаем состояние
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock logout in development mode');
        set({ user: null, isAuthenticated: false, isLoading: false });
        console.log('isAuthenticated:', get().isAuthenticated);
        return;
      }

      // Реальный логаут для production
      await apiClient.post('/auth/logout');
      set({ user: null, isAuthenticated: false, isLoading: false });
      console.log('isAuthenticated:', get().isAuthenticated);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to logout', 
        isLoading: false 
      });
      throw error;
    }
  },

  checkAuth: async () => {
    const state = get();
    if (state.isLoading) return;

    set({ isLoading: true, error: null });
    try {
      // В dev-режиме проверяем наличие мок-пользователя
      if (process.env.NODE_ENV === 'development') {
        if (state.user) {
          set({ isLoading: false });
          console.log('isAuthenticated:', get().isAuthenticated);
          return;
        }
        // Если пользователя нет, устанавливаем мок-пользователя
        set({ 
          user: MOCK_USER, 
          isAuthenticated: true, 
          isLoading: false 
        });
        console.log('isAuthenticated:', get().isAuthenticated);
        return;
      }

      // Реальная проверка для production
      const userData = await apiClient.get('/user/profile');
      set({ user: userData.data, isAuthenticated: true, isLoading: false });
      console.log('isAuthenticated:', get().isAuthenticated);
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      console.log('isAuthenticated:', get().isAuthenticated);
    }
  },
})); 