'use client';

import { create } from 'zustand';
import type { ExamConfig, ExamResult, ExamSession, QuestionState } from '@/types';
import { examService } from '@/lib/services/examService';

interface ExamStore {
  currentSession: ExamSession | null;
  currentQuestionIndex: number;
  lastResult: ExamResult | null;
  isSubmitting: boolean;

  startExam: (config: ExamConfig) => void;
  answerQuestion: (questionId: string, answer: number) => void;
  toggleBookmark: (questionId: string) => void;
  toggleUnknown: (questionId: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setCurrentQuestion: (index: number) => void;
  submitExam: () => Promise<ExamResult | null>;
  resetExam: () => void;
  updateTimeSpent: (questionId: string, seconds: number) => void;
}

function createInitialQuestionStates(config: ExamConfig): QuestionState[] {
  return config.questions.map((q) => ({
    questionId: q.id,
    selectedAnswer: undefined,
    isBookmarked: false,
    isUnknown: false,
    timeSpent: 0,
  }));
}

export const useExamStore = create<ExamStore>((set, get) => ({
  currentSession: null,
  currentQuestionIndex: 0,
  lastResult: null,
  isSubmitting: false,

  startExam: (config: ExamConfig) => {
    const session: ExamSession = {
      id: `session_${Date.now()}`,
      examConfig: config,
      questionStates: createInitialQuestionStates(config),
      startedAt: new Date(),
      status: 'in_progress',
    };
    set({ currentSession: session, currentQuestionIndex: 0, lastResult: null });
  },

  answerQuestion: (questionId: string, answer: number) => {
    const { currentSession } = get();
    if (!currentSession) return;

    const updatedStates = currentSession.questionStates.map((state) =>
      state.questionId === questionId ? { ...state, selectedAnswer: answer } : state,
    );

    set({
      currentSession: { ...currentSession, questionStates: updatedStates },
    });
  },

  toggleBookmark: (questionId: string) => {
    const { currentSession } = get();
    if (!currentSession) return;

    const updatedStates = currentSession.questionStates.map((state) =>
      state.questionId === questionId
        ? { ...state, isBookmarked: !state.isBookmarked }
        : state,
    );

    set({
      currentSession: { ...currentSession, questionStates: updatedStates },
    });
  },

  toggleUnknown: (questionId: string) => {
    const { currentSession } = get();
    if (!currentSession) return;

    const updatedStates = currentSession.questionStates.map((state) =>
      state.questionId === questionId
        ? { ...state, isUnknown: !state.isUnknown }
        : state,
    );

    set({
      currentSession: { ...currentSession, questionStates: updatedStates },
    });
  },

  nextQuestion: () => {
    const { currentSession, currentQuestionIndex } = get();
    if (!currentSession) return;
    const maxIndex = currentSession.examConfig.questions.length - 1;
    if (currentQuestionIndex < maxIndex) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  setCurrentQuestion: (index: number) => {
    const { currentSession } = get();
    if (!currentSession) return;
    const maxIndex = currentSession.examConfig.questions.length - 1;
    if (index >= 0 && index <= maxIndex) {
      set({ currentQuestionIndex: index });
    }
  },

  submitExam: async (): Promise<ExamResult | null> => {
    const { currentSession } = get();
    if (!currentSession) return null;

    set({ isSubmitting: true });

    try {
      const completedSession: ExamSession = {
        ...currentSession,
        status: 'completed',
        finishedAt: new Date(),
      };

      const result = await examService.submitExam(completedSession);

      set({
        currentSession: completedSession,
        lastResult: result,
        isSubmitting: false,
      });

      return result;
    } catch {
      set({ isSubmitting: false });
      return null;
    }
  },

  updateTimeSpent: (questionId: string, seconds: number) => {
    const { currentSession } = get();
    if (!currentSession) return;

    const updatedStates = currentSession.questionStates.map((state) =>
      state.questionId === questionId
        ? { ...state, timeSpent: state.timeSpent + seconds }
        : state,
    );

    set({
      currentSession: { ...currentSession, questionStates: updatedStates },
    });
  },

  resetExam: () => {
    set({ currentSession: null, currentQuestionIndex: 0, lastResult: null, isSubmitting: false });
  },
}));
