'use client';

import { create } from 'zustand';
import type { ExamCategory, User } from '@/types';
import { mockUser } from '@/data/mock/user';
import { authService } from '@/lib/services/authService';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    targetExam: ExamCategory;
    targetScore: number;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<Omit<User, 'id' | 'createdAt'>>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initialize with mock user for demo purposes
  user: mockUser,
  isAuthenticated: true,
  isLoading: false,
  error: null,

  login: async (email: string, password: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const { user } = await authService.login({ email, password });
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '로그인에 실패했습니다.';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  signup: async (data): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const { user } = await authService.signup(data);
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '회원가입에 실패했습니다.';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  logout: async (): Promise<void> => {
    set({ isLoading: true });

    try {
      await authService.logout();
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  updateUser: (updates: Partial<Omit<User, 'id' | 'createdAt'>>) => {
    const { user } = get();
    if (!user) return;
    set({ user: { ...user, ...updates } });
  },

  clearError: () => {
    set({ error: null });
  },
}));
