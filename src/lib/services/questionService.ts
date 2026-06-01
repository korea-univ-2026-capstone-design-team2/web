import type { Question, RecommendedQuestion } from '@/types';
import type {
  CreateQuestionResDto,
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
      isCorrect: choice.correct,
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
      isCorrect: choice.correct,
    })),
    status: first.status,
    qualityScore: first.qualityScore,
    passageTopicCategory: view.passageTopicCategory,
    passageTopicKeyword: view.passageTopicKeyword,
    frameId: 0,
    similarityScore: 0,
    frameType: 'UNSPECIFIED',
  };
}

function getMockPapersByIds(questionIds: number[]): QuestionPaper[] {
  return questionIds
    .map((questionId) => {
      const question = getQuestionByNumber(questionId);
      if (!question) return null;
      return toQuestionPaperDto(question, questionId - 1);
    })
    .filter((item): item is QuestionPaper => Boolean(item));
}

function getMockReviewsByIds(questionIds: number[]): QuestionReview[] {
  return questionIds
    .map((questionId) => {
      const question = getQuestionByNumber(questionId);
      if (!question) return null;
      return toQuestionReviewDto(question, questionId - 1);
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

  getQuestionById: async (questionId: number): Promise<Question | undefined> => {
    const question = getQuestionByNumber(questionId);
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

  toggleBookmark: async (userId: string, questionId: number): Promise<boolean> => {
    void userId;
    if (bookmarkedQuestionIds.has(questionId)) {
      bookmarkedQuestionIds.delete(questionId);
      return Promise.resolve(false);
    }

    bookmarkedQuestionIds.add(questionId);
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

  getQuestionPaperView: async (questionId: number): Promise<QuestionPaperView> => {
    return apiRequest<QuestionPaperView>(`/questions/${questionId}/paper`);
  },

  getQuestionReviewView: async (questionId: number): Promise<QuestionReviewView> => {
    return apiRequest<QuestionReviewView>(`/questions/${questionId}/review`);
  },

  getQuestionDetailView: async (questionId: number): Promise<QuestionDetailView> => {
    return apiRequest<QuestionDetailView>(`/questions/${questionId}/detail`);
  },

  getQuestionPapers: async (): Promise<QuestionPaper[]> => {
    return Promise.resolve(mockQuestions.map((question, index) => toQuestionPaperDto(question, index)));
  },

  getQuestionPapersByIds: async (questionIds: number[]): Promise<QuestionPaper[]> => {
    if (!questionIds.length) return Promise.resolve([]);

    if (hasApiBaseUrl()) {
      try {
        const views = await Promise.all(questionIds.map((questionId) => questionService.getQuestionPaperView(questionId)));
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

  getQuestionReviewsByIds: async (questionIds: number[]): Promise<QuestionReview[]> => {
    if (!questionIds.length) return Promise.resolve([]);

    if (hasApiBaseUrl()) {
      try {
        const views = await Promise.all(questionIds.map((questionId) => questionService.getQuestionReviewView(questionId)));
        return views.flatMap(normalizeReviewView);
      } catch {
        // Keep local development usable when the configured backend is unavailable.
      }
    }

    return Promise.resolve(getMockReviewsByIds(questionIds));
  },

  getQuestionDetail: async (questionId: number): Promise<QuestionDetail | undefined> => {
    if (hasApiBaseUrl()) {
      try {
        return normalizeDetailView(await questionService.getQuestionDetailView(questionId));
      } catch {
        // fallback to mock mapping
      }
    }

    const question = getQuestionByNumber(questionId);
    if (!question) return Promise.resolve(undefined);
    return Promise.resolve(toQuestionDetailDto(question, questionId - 1));
  },
};
