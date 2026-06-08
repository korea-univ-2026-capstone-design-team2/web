import type { Question, RecommendedQuestion } from '@/types';
import type {
  CreateQuestionResDto,
  GetQuestionPapersReqDto,
  GetQuestionReviewsReqDto,
  QuestionDetail,
  QuestionDetailView,
  QuestionPaper,
  QuestionPaperView,
  QuestionReview,
  QuestionReviewView,
  QuestionSummary,
} from '@/types/question-dto';
import { mockQuestions } from '@/data/mock/questions';
import { mockRecommendations } from '@/data/mock/recommendations';
import {
  toQuestionDetailDto,
  toQuestionPaperDto,
  toQuestionReviewDto,
  toQuestionSummaryDto,
} from '@/lib/mappers/questionDtoMapper';
import { apiRequest, hasApiBaseUrl } from '@/lib/api/client';

const bookmarkedQuestionIds = new Set<number>([4, 17, 28]);

function parseMockQuestionId(questionId: string): number | null {
  const parsed = Number(questionId);
  return Number.isFinite(parsed) ? parsed : null;
}

function getQuestionByNumber(questionId: number): Question | undefined {
  return mockQuestions.find((question) => question.questionId === questionId);
}

function normalizePaperView(view: QuestionPaperView): QuestionPaper[] {
  return view.items.map((item) => ({
    ...item,
    questionId: item.questionItemId || item.questionId,
    groupQuestionId: view.questionId,
    generationId: view.generationId,
    sharedContextContent: view.sharedContextContent,
    sharedContextDescription: view.sharedContextDescription,
    passageType: view.sharedContextContent ? 'TEXT' : null,
    passageContent: view.sharedContextContent,
  }));
}

function normalizeReviewView(view: QuestionReviewView): QuestionReview[] {
  return view.items.map((item) => ({
    ...item,
    questionId: item.questionItemId || item.questionId,
    groupQuestionId: view.questionId,
    generationId: view.generationId,
    sharedContextContent: view.sharedContextContent,
    sharedContextDescription: view.sharedContextDescription,
    passageType: view.sharedContextContent ? 'TEXT' : null,
    passageContent: view.sharedContextContent,
    choices: item.choices.map((choice) => ({
      number: choice.number,
      text: choice.text,
      isCorrect: choice.isCorrect,
    })),
  }));
}

function normalizeDetailView(view: QuestionDetailView): QuestionDetail | undefined {
  const first = view.items[0];
  if (!first) return undefined;
  return {
    ...first,
    questionId: first.questionItemId || first.questionId,
    groupQuestionId: view.questionId,
    generationId: view.generationId,
    sharedContextContent: view.sharedContextContent,
    sharedContextDescription: view.sharedContextDescription,
    passageType: view.sharedContextContent ? 'TEXT' : null,
    passageContent: view.sharedContextContent,
    choices: first.choices.map((choice) => ({
      number: choice.number,
      text: choice.text,
      isCorrect: choice.isCorrect,
    })),
    status: first.status,
    qualityScore: first.qualityScore,
    passageTopicCategory: view.passageTopicCategory,
    passageTopicKeyword: view.passageTopicKeyword,
    frameId: '0',
    similarityScore: 0,
    frameType: 'UNSPECIFIED',
  };
}

function getMockPapersByIds(questionIds: string[]): QuestionPaper[] {
  return questionIds
    .map((questionId) => {
      const numericId = parseMockQuestionId(questionId);
      if (numericId === null) return null;
      const question = getQuestionByNumber(numericId);
      if (!question) return null;
      return toQuestionPaperDto(question, numericId - 1);
    })
    .filter((item): item is QuestionPaper => Boolean(item));
}

function getMockReviewsByIds(questionIds: string[]): QuestionReview[] {
  return questionIds
    .map((questionId) => {
      const numericId = parseMockQuestionId(questionId);
      if (numericId === null) return null;
      const question = getQuestionByNumber(numericId);
      if (!question) return null;
      return toQuestionReviewDto(question, numericId - 1);
    })
    .filter((item): item is QuestionReview => Boolean(item));
}

export const questionService = {
  getQuestions: async (subjectId?: string, unitId?: string): Promise<Question[]> => {
    let result = mockQuestions;

    if (subjectId) {
      result = result.filter((q) => q.subjectId === subjectId);
    }

    if (unitId) {
      result = result.filter((q) => q.unitId === unitId);
    }

    return Promise.resolve(result);
  },

  getQuestionById: async (questionId: string): Promise<Question | undefined> => {
    const numericId = parseMockQuestionId(questionId);
    if (numericId === null) return Promise.resolve(undefined);
    const question = getQuestionByNumber(numericId);
    return Promise.resolve(question);
  },

  getRecommendations: async (userId: string): Promise<RecommendedQuestion[]> => {
    void userId;
    return Promise.resolve(mockRecommendations);
  },

  getBookmarks: async (userId: string): Promise<Question[]> => {
    void userId;
    const bookmarked = mockQuestions.filter((question) => bookmarkedQuestionIds.has(question.questionId));
    return Promise.resolve(bookmarked);
  },

  toggleBookmark: async (userId: string, questionId: string): Promise<boolean> => {
    void userId;
    const numericId = parseMockQuestionId(questionId);
    if (numericId === null) return Promise.resolve(false);

    if (bookmarkedQuestionIds.has(numericId)) {
      bookmarkedQuestionIds.delete(numericId);
      return Promise.resolve(false);
    }

    bookmarkedQuestionIds.add(numericId);
    return Promise.resolve(true);
  },

  getQuestionsByDifficulty: async (
    difficulty: 'easy' | 'medium' | 'hard',
    subjectId?: string,
  ): Promise<Question[]> => {
    let result = mockQuestions.filter((q) => q.difficulty === difficulty);
    if (subjectId) {
      result = result.filter((q) => q.subjectId === subjectId);
    }
    return Promise.resolve(result);
  },

  getQuestionSummaries: async (): Promise<QuestionSummary[]> => {
    return Promise.resolve(mockQuestions.map((question, index) => toQuestionSummaryDto(question, index)));
  },

  createQuestion: async (payload: unknown): Promise<CreateQuestionResDto> => {
    return apiRequest<CreateQuestionResDto>('/questions', { method: 'POST', body: payload });
  },

  getQuestionPaperView: async (questionId: string): Promise<QuestionPaperView> => {
    return apiRequest<QuestionPaperView>(`/questions/${questionId}/paper`);
  },

  getQuestionReviewView: async (questionId: string): Promise<QuestionReviewView> => {
    return apiRequest<QuestionReviewView>(`/questions/${questionId}/review`);
  },

  getQuestionDetailView: async (questionId: string): Promise<QuestionDetailView> => {
    return apiRequest<QuestionDetailView>(`/questions/${questionId}/detail`);
  },

  getQuestionPaperViewsByIds: async (questionIds: string[]): Promise<QuestionPaperView[]> => {
    const body: GetQuestionPapersReqDto = { questionIds };
    return apiRequest<QuestionPaperView[]>('/questions/papers', { method: 'POST', body });
  },

  getQuestionReviewViewsByIds: async (questionIds: string[]): Promise<QuestionReviewView[]> => {
    const body: GetQuestionReviewsReqDto = { questionIds };
    return apiRequest<QuestionReviewView[]>('/questions/reviews', { method: 'POST', body });
  },

  getQuestionPapers: async (): Promise<QuestionPaper[]> => {
    return Promise.resolve(mockQuestions.map((question, index) => toQuestionPaperDto(question, index)));
  },

  getQuestionPapersByIds: async (questionIds: string[]): Promise<QuestionPaper[]> => {
    if (!questionIds.length) return Promise.resolve([]);

    if (hasApiBaseUrl()) {
      try {
        const views = await questionService.getQuestionPaperViewsByIds(questionIds);
        return views.flatMap(normalizePaperView);
      } catch {
        // Keep local development usable when the configured backend is unavailable.
      }
    }

    return Promise.resolve(getMockPapersByIds(questionIds));
  },

  getQuestionReviews: async (): Promise<QuestionReview[]> => {
    return Promise.resolve(mockQuestions.map((question, index) => toQuestionReviewDto(question, index)));
  },

  getQuestionReviewsByIds: async (questionIds: string[]): Promise<QuestionReview[]> => {
    if (!questionIds.length) return Promise.resolve([]);

    if (hasApiBaseUrl()) {
      try {
        const views = await questionService.getQuestionReviewViewsByIds(questionIds);
        return views.flatMap(normalizeReviewView);
      } catch {
        // Keep local development usable when the configured backend is unavailable.
      }
    }

    return Promise.resolve(getMockReviewsByIds(questionIds));
  },

  getQuestionDetail: async (questionId: string): Promise<QuestionDetail | undefined> => {
    if (hasApiBaseUrl()) {
      try {
        return normalizeDetailView(await questionService.getQuestionDetailView(questionId));
      } catch {
        // fallback to mock mapping
      }
    }

    const numericId = parseMockQuestionId(questionId);
    if (numericId === null) return Promise.resolve(undefined);
    const question = getQuestionByNumber(numericId);
    if (!question) return Promise.resolve(undefined);
    return Promise.resolve(toQuestionDetailDto(question, numericId - 1));
  },
};
