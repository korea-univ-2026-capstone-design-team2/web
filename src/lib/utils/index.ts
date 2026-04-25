import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    easy: '하',
    medium: '중',
    hard: '상',
  };
  return labels[difficulty] || difficulty;
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    easy: '#27a644',
    medium: '#f59e0b',
    hard: '#ef4444',
  };
  return colors[difficulty] || '#8a8f98';
}
