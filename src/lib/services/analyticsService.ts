import type { DailyStudyRecord, StudyStats, WeaknessAnalysis } from '@/types';
import { mockStudyStats, mockWeaknesses, mockDailyRecords } from '@/data/mock/study-stats';
import { mockResults } from '@/data/mock/results';

export const analyticsService = {
  getStudyStats: async (userId: string): Promise<StudyStats> => {
    void userId;
    return Promise.resolve({
      ...mockStudyStats,
      recentResults: mockResults.slice(0, 3),
    });
  },

  getWeaknessAnalysis: async (userId: string): Promise<WeaknessAnalysis[]> => {
    void userId;
    return Promise.resolve(mockWeaknesses);
  },

  getDailyRecords: async (userId: string, days: number): Promise<DailyStudyRecord[]> => {
    void userId;
    const records = mockDailyRecords.slice(-days);
    return Promise.resolve(records);
  },

  getSubjectAccuracies: async (userId: string): Promise<
    { subjectId: string; subjectName: string; accuracy: number }[]
  > => {
    void userId;
    return Promise.resolve(mockStudyStats.subjectAccuracies);
  },
};
