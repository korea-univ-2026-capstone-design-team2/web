'use client';

import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface UiStore {
  isSidebarOpen: boolean;
  isTimerRunning: boolean;
  theme: Theme;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTimerRunning: (running: boolean) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useUiStore = create<UiStore>((set, get) => ({
  isSidebarOpen: true,
  isTimerRunning: false,
  theme: 'dark',

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setSidebarOpen: (open: boolean) => {
    set({ isSidebarOpen: open });
  },

  setTimerRunning: (running: boolean) => {
    set({ isTimerRunning: running });
  },

  setTheme: (theme: Theme) => {
    set({ theme });
  },

  toggleTheme: () => {
    const { theme } = get();
    set({ theme: theme === 'dark' ? 'light' : 'dark' });
  },
}));
