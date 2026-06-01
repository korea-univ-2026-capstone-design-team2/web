import type {
  GetTokenUsageListResult,
  GetTokenUsageStatisticsResult,
  RecordTokenUsageReqDto,
  RecordTokenUsageResDto,
  TokenUsageFilters,
} from '@/types/question-dto';
import { apiRequest } from '@/lib/api/client';

export const tokenUsageService = {
  getTokenUsages: async (filters: TokenUsageFilters = {}): Promise<GetTokenUsageListResult> => {
    return apiRequest<GetTokenUsageListResult>('/token-usages', { query: filters });
  },

  recordTokenUsage: async (payload: RecordTokenUsageReqDto): Promise<RecordTokenUsageResDto> => {
    return apiRequest<RecordTokenUsageResDto>('/token-usages', { method: 'POST', body: payload });
  },

  getStatistics: async (filters: Omit<TokenUsageFilters, 'page' | 'size'> = {}): Promise<GetTokenUsageStatisticsResult> => {
    return apiRequest<GetTokenUsageStatisticsResult>('/token-usages/statistics', { query: filters });
  },
};
