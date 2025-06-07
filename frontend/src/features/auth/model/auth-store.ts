import { create } from 'zustand';
import { apiClient } from '@/shared/api/api-client';
import { updateSocketAuth } from '@/shared/api/socket-service';
import type { User } from '@/entities/user/model/user';
import axios from 'axios'

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
  clearError: () => void;
}

type AuthStore = {
  set: (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>)) => void;
  get: () => AuthState;
};

/**
 * Zustand store для аутентификации пользователя.
 * Хранит user, статус авторизации, ошибки и методы login/register/logout/checkAuth.
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
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      set({ user, accessToken: token, isAuthenticated: true, isLoading: false });
      console.log('[auth-store] login success:', { user, token });
      updateSocketAuth(token);
    } catch (error) {
      let errorMessage = 'Failed to login';
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = 'Некорректный email или пароль';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({
        error: errorMessage,
        isLoading: false
      });
      console.log('[auth-store] login error:', error);
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
      await apiClient.post('/auth/signup', { email, password, username });
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      set({ user, accessToken: token, isAuthenticated: true, isLoading: false });
      console.log('[auth-store] register success:', { user, token });
      updateSocketAuth(token);
    } catch (error) {
      let errorMessage = 'Failed to register';
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({
        error: errorMessage,
        isLoading: false
      });
      console.log('[auth-store] register error:', error);
    }
  },

  /**
   * Выход пользователя из системы
   */
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post('/auth/logout');
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      console.log('[auth-store] logout success');
      updateSocketAuth(null);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to logout',
        isLoading: false
      });
      console.log('[auth-store] logout error:', error);
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
      // Реальная проверка для production
      const userData = await apiClient.get('/user/profile');
      console.log('[auth-store] checkAuth userData', userData)
      set({ user: userData.data, isAuthenticated: true, isLoading: false });
      console.log('[auth-store] checkAuth success:', { user: userData.data });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      console.log('[auth-store] checkAuth error:', error);
    }
  },

  refresh: async () => {
    set({ isLoading: true, error: null });
    try {
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

  clearError: () => set({ error: null }),
}));