import type {
  GenerateQuestionReqDto,
  GenerateQuestionResDto,
  IngestFrameReqDto,
} from '@/types/question-dto';
import { apiRequest, getApiBaseUrl } from '@/lib/api/client';

export const questionGenerationService = {
  generateQuestion: async (payload: GenerateQuestionReqDto): Promise<GenerateQuestionResDto> => {
    return apiRequest<GenerateQuestionResDto>('/question-generations', { method: 'POST', body: payload });
  },

  getGenerationEventsUrl: (generationId: string): string | null => {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) return null;
    return `${baseUrl}/question-generations/${generationId}/events`;
  },

  ingestFrames: async (payload: IngestFrameReqDto): Promise<void> => {
    await apiRequest<void>('/question-generations/ingest', { method: 'POST', body: payload });
  },
};
