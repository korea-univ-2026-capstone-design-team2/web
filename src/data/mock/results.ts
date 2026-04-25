import type { ExamResult, ExamConfig } from '@/types';
import { mockQuestions } from './questions';

const 국어Questions = mockQuestions.filter((q) => q.subjectId === '국어');
const 한국사Questions = mockQuestions.filter((q) => q.subjectId === '한국사');
const 영어Questions = mockQuestions.filter((q) => q.subjectId === '영어');

function buildExamConfig(
  id: string,
  subjectIds: string[],
  questions: typeof mockQuestions,
): ExamConfig {
  return {
    id,
    categoryId: '9급_국가직',
    subjectIds,
    type: 'mock',
    questionCount: questions.length,
    timeLimit: 100,
    questions,
  };
}

const exam1Questions = [...국어Questions.slice(0, 5), ...한국사Questions.slice(0, 5), ...영어Questions.slice(0, 5)];
const exam2Questions = [...국어Questions.slice(5), ...한국사Questions.slice(5), ...영어Questions.slice(5)];
const exam3Questions = [...국어Questions.slice(0, 4), ...한국사Questions.slice(0, 4), ...영어Questions.slice(0, 4)];
const exam4Questions = [...국어Questions.slice(0, 5), ...한국사Questions.slice(0, 5), ...영어Questions.slice(0, 5)];
const exam5Questions = [...국어Questions.slice(0, 4), ...한국사Questions.slice(0, 4), ...영어Questions.slice(0, 3)];

export const mockResults: ExamResult[] = [
  {
    id: 'result_001',
    sessionId: 'session_001',
    examConfig: buildExamConfig('config_001', ['국어', '한국사', '영어'], exam1Questions),
    questionStates: exam1Questions.map((q, i) => ({
      questionId: q.id,
      selectedAnswer: i % 4 === 0 ? q.correctAnswer + 1 > 5 ? 1 : q.correctAnswer + 1 : q.correctAnswer,
      isBookmarked: i === 2 || i === 7,
      isUnknown: false,
      timeSpent: 45 + Math.floor(Math.random() * 60),
    })),
    totalScore: 86.7,
    correctCount: 13,
    totalCount: 15,
    accuracy: 0.867,
    timeSpent: 4820,
    subjectScores: [
      { subjectId: '국어', subjectName: '국어', correctCount: 5, totalCount: 5, accuracy: 1.0 },
      { subjectId: '한국사', subjectName: '한국사', correctCount: 4, totalCount: 5, accuracy: 0.8 },
      { subjectId: '영어', subjectName: '영어', correctCount: 4, totalCount: 5, accuracy: 0.8 },
    ],
    finishedAt: new Date('2026-04-02T10:30:00'),
    aiComment: '전반적으로 우수한 성적입니다! 특히 국어에서 완벽한 점수를 받았습니다. 한국사 고려시대 파트와 영어 문법 파트에 조금 더 집중하면 더욱 좋은 성적을 기대할 수 있습니다.',
  },
  {
    id: 'result_002',
    sessionId: 'session_002',
    examConfig: buildExamConfig('config_002', ['국어', '한국사', '영어'], exam2Questions),
    questionStates: exam2Questions.map((q, i) => ({
      questionId: q.id,
      selectedAnswer: i % 3 === 0 ? q.correctAnswer + 1 > 5 ? 1 : q.correctAnswer + 1 : q.correctAnswer,
      isBookmarked: i === 1,
      isUnknown: i === 4,
      timeSpent: 40 + Math.floor(Math.random() * 70),
    })),
    totalScore: 80.0,
    correctCount: 16,
    totalCount: 20,
    accuracy: 0.8,
    timeSpent: 5400,
    subjectScores: [
      { subjectId: '국어', subjectName: '국어', correctCount: 6, totalCount: 7, accuracy: 0.857 },
      { subjectId: '한국사', subjectName: '한국사', correctCount: 5, totalCount: 7, accuracy: 0.714 },
      { subjectId: '영어', subjectName: '영어', correctCount: 5, totalCount: 6, accuracy: 0.833 },
    ],
    finishedAt: new Date('2026-03-30T14:15:00'),
    aiComment: '좋은 성적입니다. 한국사에서 일부 어려움을 겪었지만 전체적으로 균형 잡힌 실력을 보여주고 있습니다. 계속해서 꾸준히 학습하세요!',
  },
  {
    id: 'result_003',
    sessionId: 'session_003',
    examConfig: buildExamConfig('config_003', ['국어', '한국사', '영어'], exam3Questions),
    questionStates: exam3Questions.map((q, i) => ({
      questionId: q.id,
      selectedAnswer: i % 5 === 0 ? q.correctAnswer + 1 > 5 ? 1 : q.correctAnswer + 1 : q.correctAnswer,
      isBookmarked: false,
      isUnknown: i === 3 || i === 8,
      timeSpent: 50 + Math.floor(Math.random() * 50),
    })),
    totalScore: 75.0,
    correctCount: 9,
    totalCount: 12,
    accuracy: 0.75,
    timeSpent: 3960,
    subjectScores: [
      { subjectId: '국어', subjectName: '국어', correctCount: 3, totalCount: 4, accuracy: 0.75 },
      { subjectId: '한국사', subjectName: '한국사', correctCount: 3, totalCount: 4, accuracy: 0.75 },
      { subjectId: '영어', subjectName: '영어', correctCount: 3, totalCount: 4, accuracy: 0.75 },
    ],
    finishedAt: new Date('2026-03-27T09:45:00'),
    aiComment: '균형 잡힌 성적이나 목표 점수에 도달하려면 더욱 노력이 필요합니다. 약점 분석을 통해 집중 학습 영역을 파악하고 실전 문제를 많이 풀어보세요.',
  },
  {
    id: 'result_004',
    sessionId: 'session_004',
    examConfig: buildExamConfig('config_004', ['국어', '한국사', '영어'], exam4Questions),
    questionStates: exam4Questions.map((q, i) => ({
      questionId: q.id,
      selectedAnswer: i % 2 === 0 ? q.correctAnswer : q.correctAnswer + 1 > 5 ? 1 : q.correctAnswer + 1,
      isBookmarked: i === 0 || i === 5 || i === 10,
      isUnknown: false,
      timeSpent: 35 + Math.floor(Math.random() * 80),
    })),
    totalScore: 60.0,
    correctCount: 9,
    totalCount: 15,
    accuracy: 0.6,
    timeSpent: 4200,
    subjectScores: [
      { subjectId: '국어', subjectName: '국어', correctCount: 3, totalCount: 5, accuracy: 0.6 },
      { subjectId: '한국사', subjectName: '한국사', correctCount: 3, totalCount: 5, accuracy: 0.6 },
      { subjectId: '영어', subjectName: '영어', correctCount: 3, totalCount: 5, accuracy: 0.6 },
    ],
    finishedAt: new Date('2026-03-22T16:00:00'),
    aiComment: '최근 학습 대비 다소 낮은 점수입니다. 지쳐있거나 컨디션이 좋지 않았을 수 있습니다. 충분한 휴식 후 다시 도전해보세요. AI 추천 문제를 통해 약점을 보완하세요.',
  },
  {
    id: 'result_005',
    sessionId: 'session_005',
    examConfig: buildExamConfig('config_005', ['국어', '한국사', '영어'], exam5Questions),
    questionStates: exam5Questions.map((q, i) => ({
      questionId: q.id,
      selectedAnswer: i % 5 !== 0 ? q.correctAnswer : q.correctAnswer + 1 > 5 ? 1 : q.correctAnswer + 1,
      isBookmarked: i === 6,
      isUnknown: false,
      timeSpent: 42 + Math.floor(Math.random() * 65),
    })),
    totalScore: 81.8,
    correctCount: 9,
    totalCount: 11,
    accuracy: 0.818,
    timeSpent: 3120,
    subjectScores: [
      { subjectId: '국어', subjectName: '국어', correctCount: 3, totalCount: 4, accuracy: 0.75 },
      { subjectId: '한국사', subjectName: '한국사', correctCount: 4, totalCount: 4, accuracy: 1.0 },
      { subjectId: '영어', subjectName: '영어', correctCount: 2, totalCount: 3, accuracy: 0.667 },
    ],
    finishedAt: new Date('2026-03-18T11:20:00'),
    aiComment: '한국사에서 완벽한 성취를 이루었습니다! 영어 독해 부분을 보강하면 전체적인 성적 향상이 기대됩니다. 꾸준한 노력이 빛을 발하고 있습니다.',
  },
];
