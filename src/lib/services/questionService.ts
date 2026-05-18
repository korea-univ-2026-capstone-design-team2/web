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

const bookmarkedQuestionIds = new Set<string>(['q_ko_004', 'q_his_002', 'q_eng_003']);

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

  getQuestionById: async (id: string): Promise<Question | undefined> => {
    const question = mockQuestions.find((q) => q.id === id);
    return Promise.resolve(question);
  },

  getRecommendations: async (userId: string): Promise<RecommendedQuestion[]> => {
    void userId;
    return Promise.resolve(mockRecommendations);
  },

  getBookmarks: async (userId: string): Promise<Question[]> => {
    void userId;
    const bookmarked = mockQuestions.filter((q) => bookmarkedQuestionIds.has(q.id));
    return Promise.resolve(bookmarked);
  },

  toggleBookmark: async (userId: string, questionId: string): Promise<boolean> => {
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

  getQuestionReviews: async (): Promise<QuestionReview[]> => {
    return Promise.resolve(mockQuestions.map((question, index) => toQuestionReviewDto(question, index)));
  },

  getQuestionDetail: async (questionId: number): Promise<QuestionDetail | undefined> => {
    const index = questionId - 1;
    const question = mockQuestions[index];
    if (!question) return Promise.resolve(undefined);
    return Promise.resolve(toQuestionDetailDto(question, index));
  },
};
