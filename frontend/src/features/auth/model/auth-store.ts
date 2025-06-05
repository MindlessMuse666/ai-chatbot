import { create } from 'zustand';
import { apiClient } from '@/shared/api/api-client';
import { getSocket, updateSocketAuth } from '@/shared/api/socket-service';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refresh: () => Promise<void>;
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

/**
 * Zustand store для аутентификации пользователя.
 * Хранит user, статус авторизации, ошибки и методы login/register/logout/checkAuth.
 * В dev-режиме использует мок-данные, в production — реальные API-запросы.
 */
export const useAuthStore = create<AuthState>((set: AuthStore['set'], get: AuthStore['get']) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  /**
   * Авторизация пользователя
   * @param email — email пользователя
   * @param password — пароль
   */
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      if (process.env.NODE_ENV === 'development') {
        set({
          user: MOCK_USER,
          accessToken: 'mock-token',
          isAuthenticated: true,
          isLoading: false
        });
        updateSocketAuth('mock-token');
        return;
      }
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      set({ user, accessToken: token, isAuthenticated: true, isLoading: false });
      updateSocketAuth(token);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to login',
        isLoading: false
      });
      throw error;
    }
  },

  /**
   * Регистрация пользователя
   * @param email — email пользователя
   * @param password — пароль
   * @param username — имя пользователя
   */
  register: async (email: string, password: string, username: string) => {
    set({ isLoading: true, error: null });
    try {
      if (process.env.NODE_ENV === 'development') {
        set({
          user: { ...MOCK_USER, email, username },
          accessToken: 'mock-token',
          isAuthenticated: true,
          isLoading: false
        });
        updateSocketAuth('mock-token');
        return;
      }
      await apiClient.post('/auth/signup', { email, password, username });
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      set({ user, accessToken: token, isAuthenticated: true, isLoading: false });
      updateSocketAuth(token);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to register',
        isLoading: false
      });
      throw error;
    }
  },

  /**
   * Выход пользователя из системы
   */
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      if (process.env.NODE_ENV === 'development') {
        set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
        updateSocketAuth(null);
        return;
      }
      await apiClient.post('/auth/logout');
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      updateSocketAuth(null);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to logout',
        isLoading: false
      });
      throw error;
    }
  },

  /**
   * Проверка статуса авторизации пользователя
   */
  checkAuth: async () => {
    const state = get();
    if (state.isLoading) return;

    set({ isLoading: true, error: null });
    try {
      // В dev-режиме проверяем наличие мок-пользователя
      if (process.env.NODE_ENV === 'development') {
        if (state.user) {
          set({ isLoading: false });
          return;
        }
        // Если пользователя нет, устанавливаем мок-пользователя
        set({
          user: MOCK_USER,
          isAuthenticated: true,
          isLoading: false
        });
        return;
      }

      // Реальная проверка для production
      const userData = await apiClient.get('/user/profile');
      console.log('userData', userData)
      set({ user: userData.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  refresh: async () => {
    set({ isLoading: true, error: null });
    try {
      if (process.env.NODE_ENV === 'development') {
        set({ accessToken: 'mock-token', isAuthenticated: true, isLoading: false });
        updateSocketAuth('mock-token');
        return;
      }
      const response = await apiClient.post('/auth/refresh');
      const { token } = response.data;
      set({ accessToken: token, isAuthenticated: true, isLoading: false });
      updateSocketAuth(token);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to refresh',
        isLoading: false
      });
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    try {
      const response = await apiClient.post('/api/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}));