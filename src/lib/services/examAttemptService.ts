import type {
  GetExamAttemptResultResDto,
  SaveExamAttemptAnswersReqDto,
  SaveExamAttemptAnswersResDto,
  StartExamAttemptReqDto,
  StartExamAttemptResDto,
  SubmitExamAttemptReqDto,
  SubmitExamAttemptResDto,
} from '@/types/question-dto';
import { apiRequest } from '@/lib/api/client';

export const examAttemptService = {
  startAttempt: async (payload: StartExamAttemptReqDto): Promise<StartExamAttemptResDto> => {
    return apiRequest<StartExamAttemptResDto>('/exam-attempts', { method: 'POST', body: payload });
  },

  saveAnswers: async (
    attemptId: number,
    payload: SaveExamAttemptAnswersReqDto,
  ): Promise<SaveExamAttemptAnswersResDto> => {
    return apiRequest<SaveExamAttemptAnswersResDto>(`/exam-attempts/${attemptId}/answers`, {
      method: 'PATCH',
      body: payload,
    });
  },

  submit: async (attemptId: number, payload: SubmitExamAttemptReqDto): Promise<SubmitExamAttemptResDto> => {
    return apiRequest<SubmitExamAttemptResDto>(`/exam-attempts/${attemptId}/submit`, {
      method: 'POST',
      body: payload,
    });
  },

  getResult: async (attemptId: number): Promise<GetExamAttemptResultResDto> => {
    return apiRequest<GetExamAttemptResultResDto>(`/exam-attempts/${attemptId}/result`);
  },
};
