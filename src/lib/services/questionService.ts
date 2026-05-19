import type { Question, RecommendedQuestion } from '@/types';
import type {
  QuestionDetail,
  QuestionPaper,
  QuestionReview,
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

interface ApiSuccess<T> {
  data: T;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
const bookmarkedQuestionIds = new Set<number>([4, 17, 28]);

async function fetchApi<T>(path: string): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const body = (await response.json()) as ApiSuccess<T>;
  return body.data;
}

function getQuestionByNumber(questionId: number): Question | undefined {
  return mockQuestions.find((question) => question.questionId === questionId);
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
    } else {
      bookmarkedQuestionIds.add(questionId);
      return Promise.resolve(true);
    }
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

  getQuestionPapers: async (): Promise<QuestionPaper[]> => {
    return Promise.resolve(mockQuestions.map((question, index) => toQuestionPaperDto(question, index)));
  },

  getQuestionPapersByIds: async (questionIds: number[]): Promise<QuestionPaper[]> => {
    if (!questionIds.length) return Promise.resolve([]);

    if (API_BASE_URL) {
      try {
        const papers = await Promise.all(
          questionIds.map((questionId) => fetchApi<QuestionPaper>(`/questions/${questionId}/paper`))
        );
        return papers;
      } catch {
        // fallback to mock mapping
      }
    }

    return Promise.resolve(
      questionIds
        .map((questionId) => {
          const question = getQuestionByNumber(questionId);
          if (!question) return null;
          return toQuestionPaperDto(question, questionId - 1);
        })
        .filter((item): item is QuestionPaper => Boolean(item))
    );
  },

  getQuestionReviews: async (): Promise<QuestionReview[]> => {
    return Promise.resolve(mockQuestions.map((question, index) => toQuestionReviewDto(question, index)));
  },

  getQuestionReviewsByIds: async (questionIds: number[]): Promise<QuestionReview[]> => {
    if (!questionIds.length) return Promise.resolve([]);

    if (API_BASE_URL) {
      try {
        const reviews = await Promise.all(
          questionIds.map((questionId) => fetchApi<QuestionReview>(`/questions/${questionId}/review`))
        );
        return reviews;
      } catch {
        // fallback to mock mapping
      }
    }

    return Promise.resolve(
      questionIds
        .map((questionId) => {
          const question = getQuestionByNumber(questionId);
          if (!question) return null;
          return toQuestionReviewDto(question, questionId - 1);
        })
        .filter((item): item is QuestionReview => Boolean(item))
    );
  },

  getQuestionDetail: async (questionId: number): Promise<QuestionDetail | undefined> => {
    const question = getQuestionByNumber(questionId);
    if (!question) return Promise.resolve(undefined);
    return Promise.resolve(toQuestionDetailDto(question, questionId - 1));
  },
};
