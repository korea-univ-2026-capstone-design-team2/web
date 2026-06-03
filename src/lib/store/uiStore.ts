'use client';

import { create } from 'zustand';

interface UiStore {
  isSidebarOpen: boolean;
  isTimerRunning: boolean;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTimerRunning: (running: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  isSidebarOpen: true,
  isTimerRunning: false,

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setSidebarOpen: (open: boolean) => {
    set({ isSidebarOpen: open });
  },

  setTimerRunning: (running: boolean) => {
    set({ isTimerRunning: running });
  },
}));
