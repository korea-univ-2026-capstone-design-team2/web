import type {
  GenerateQuestionReqDto,
  GenerateQuestionResDto,
  IngestFrameReqDto,
} from '@/types/question-dto';
import { apiRequest } from '@/lib/api/client';

export const questionGenerationService = {
  generateQuestion: async (payload: GenerateQuestionReqDto): Promise<GenerateQuestionResDto> => {
    return apiRequest<GenerateQuestionResDto>('/question-generations', { method: 'POST', body: payload });
  },

  ingestFrames: async (payload: IngestFrameReqDto): Promise<void> => {
    await apiRequest<void>('/question-generations/ingest', { method: 'POST', body: payload });
  },
};
