import type { ExamCategory, ExamCategoryInfo, ExamConfig, ExamResult, ExamSession, ExamType } from '@/types';
import { mockCategories } from '@/data/mock/categories';
import { mockQuestions } from '@/data/mock/questions';
import { mockResults } from '@/data/mock/results';

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function calculateExamResult(session: ExamSession): ExamResult {
  const { examConfig, questionStates } = session;
  const questions = examConfig.questions;

  let correctCount = 0;
  const subjectMap = new Map<string, { correct: number; total: number; name: string }>();

  for (const q of questions) {
    const state = questionStates.find((s) => s.questionId === q.id);
    const isCorrect = state?.selectedAnswer === q.correctAnswer;

    if (isCorrect) correctCount++;

    const existing = subjectMap.get(q.subjectId) ?? { correct: 0, total: 0, name: q.subjectId };
    subjectMap.set(q.subjectId, {
      correct: existing.correct + (isCorrect ? 1 : 0),
      total: existing.total + 1,
      name: q.subjectId,
    });
  }

  const totalCount = questions.length;
  const accuracy = totalCount > 0 ? correctCount / totalCount : 0;
  const totalScore = accuracy * 100;
  const timeSpent = questionStates.reduce((sum, s) => sum + s.timeSpent, 0);

  const subjectScores = Array.from(subjectMap.entries()).map(([subjectId, data]) => ({
    subjectId,
    subjectName: data.name,
    correctCount: data.correct,
    totalCount: data.total,
    accuracy: data.total > 0 ? data.correct / data.total : 0,
  }));

  const aiComments = [
    '꾸준한 노력이 보입니다! 약점 영역을 집중적으로 복습하세요.',
    '전반적으로 좋은 성적입니다. 실전 감각을 더욱 키워보세요.',
    '오답 분석을 통해 반복 실수를 줄이는 것이 중요합니다.',
    '시간 배분을 잘 활용하면 점수를 더 올릴 수 있습니다.',
    '약점 단원 위주의 집중 학습으로 고득점을 노려보세요.',
  ];

  return {
    id: generateId('result'),
    sessionId: session.id,
    examConfig,
    questionStates,
    totalScore,
    correctCount,
    totalCount,
    accuracy,
    timeSpent,
    subjectScores,
    finishedAt: session.finishedAt ?? new Date(),
    aiComment: aiComments[Math.floor(Math.random() * aiComments.length)],
  };
}

export const examService = {
  getCategories: async (): Promise<ExamCategoryInfo[]> => {
    return Promise.resolve(mockCategories);
  },

  getCategory: async (id: ExamCategory): Promise<ExamCategoryInfo | undefined> => {
    const category = mockCategories.find((c) => c.id === id);
    return Promise.resolve(category);
  },

  createExamSession: async (
    config: Omit<ExamConfig, 'id' | 'questions'>,
  ): Promise<ExamConfig> => {
    const { subjectIds, questionCount, type } = config;

    let pool = mockQuestions.filter((q) => subjectIds.includes(q.subjectId));

    if (type === 'weakness') {
      pool = pool.sort(() => Math.random() - 0.5);
    } else {
      pool = pool.sort(() => Math.random() - 0.5);
    }

    const selected = pool.slice(0, questionCount);

    const examConfig: ExamConfig = {
      ...config,
      id: generateId('config'),
      questions: selected,
    };

    return Promise.resolve(examConfig);
  },

  getExamResult: async (sessionId: string): Promise<ExamResult> => {
    const found = mockResults.find((r) => r.sessionId === sessionId);
    if (found) return Promise.resolve(found);

    const fallback = mockResults[0];
    return Promise.resolve({ ...fallback, sessionId });
  },

  submitExam: async (session: ExamSession): Promise<ExamResult> => {
    const completedSession: ExamSession = {
      ...session,
      status: 'completed',
      finishedAt: new Date(),
    };
    const result = calculateExamResult(completedSession);
    return Promise.resolve(result);
  },

  getExamTypes: (): { id: ExamType; label: string; description: string }[] => [
    { id: 'mock', label: '모의고사', description: '실전과 동일한 환경의 모의고사' },
    { id: 'practice', label: '연습', description: '시간 제한 없이 자유롭게 연습' },
    { id: 'weakness', label: '약점 공략', description: 'AI가 분석한 약점 문제 위주' },
  ],
};
