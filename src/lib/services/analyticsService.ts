import type { DailyStudyRecord, StudyStats, WeaknessAnalysis } from '@/types';
import type {
  AnalyticsDailyRecordResDto,
  AnalyticsDateRangeParams,
  AnalyticsSummaryResDto,
  GetAnalyticsDailyRecordsResDto,
} from '@/types/question-dto';
import {
  ANALYTICS_PERIOD_DAYS,
  getAnalyticsDateRange,
  mockDailyRecordsAsDto,
  summarizeDailyRecords,
} from '@/lib/analytics/helpers';
import { mockStudyStats, mockWeaknesses, mockDailyRecords } from '@/data/mock/study-stats';
import { mockResults } from '@/data/mock/results';
import { apiRequest, hasApiBaseUrl } from '@/lib/api/client';

export interface AnalyticsDashboardData {
  summary: AnalyticsSummaryResDto;
  dailyRecords: AnalyticsDailyRecordResDto[];
}

async function loadMockAnalyticsData(days: number): Promise<AnalyticsDashboardData> {
  const dailyRecords = mockDailyRecordsAsDto().slice(-days);
  return {
    summary: summarizeDailyRecords(dailyRecords),
    dailyRecords,
  };
}

export const analyticsService = {
  getAnalyticsSummary: async (params: AnalyticsDateRangeParams): Promise<AnalyticsSummaryResDto> => {
    return apiRequest<AnalyticsSummaryResDto>('/analytics/summary', { query: params });
  },

  getAnalyticsDailyRecords: async (params: AnalyticsDateRangeParams): Promise<GetAnalyticsDailyRecordsResDto> => {
    return apiRequest<GetAnalyticsDailyRecordsResDto>('/analytics/daily-records', { query: params });
  },

  getAnalyticsData: async (days = ANALYTICS_PERIOD_DAYS): Promise<AnalyticsDashboardData> => {
    const range = getAnalyticsDateRange(days);

    if (hasApiBaseUrl()) {
      try {
        const [summary, dailyRecords] = await Promise.all([
          analyticsService.getAnalyticsSummary(range),
          analyticsService.getAnalyticsDailyRecords(range),
        ]);
        return {
          summary,
          dailyRecords: dailyRecords.items,
        };
      } catch {
        // Keep pages usable when the configured backend is unavailable.
      }
    }

    return loadMockAnalyticsData(days);
  },

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
