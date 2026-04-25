import type { DailyStudyRecord, StudyStats, WeaknessAnalysis } from '@/types';

// Generate 30 days of realistic study records ending today (2026-04-02)
function generateDailyRecords(): DailyStudyRecord[] {
  const records: DailyStudyRecord[] = [];
  const baseDate = new Date('2026-04-02');

  const dailyData: Array<{ questions: number; accuracy: number; minutes: number }> = [
    { questions: 45, accuracy: 0.78, minutes: 62 },
    { questions: 30, accuracy: 0.80, minutes: 45 },
    { questions: 0, accuracy: 0, minutes: 0 },
    { questions: 55, accuracy: 0.72, minutes: 75 },
    { questions: 40, accuracy: 0.75, minutes: 58 },
    { questions: 50, accuracy: 0.82, minutes: 70 },
    { questions: 35, accuracy: 0.68, minutes: 50 },
    { questions: 60, accuracy: 0.85, minutes: 80 },
    { questions: 0, accuracy: 0, minutes: 0 },
    { questions: 45, accuracy: 0.71, minutes: 65 },
    { questions: 38, accuracy: 0.76, minutes: 52 },
    { questions: 52, accuracy: 0.81, minutes: 72 },
    { questions: 42, accuracy: 0.74, minutes: 60 },
    { questions: 48, accuracy: 0.79, minutes: 68 },
    { questions: 0, accuracy: 0, minutes: 0 },
    { questions: 30, accuracy: 0.70, minutes: 43 },
    { questions: 58, accuracy: 0.86, minutes: 82 },
    { questions: 44, accuracy: 0.77, minutes: 62 },
    { questions: 40, accuracy: 0.73, minutes: 57 },
    { questions: 50, accuracy: 0.80, minutes: 70 },
    { questions: 35, accuracy: 0.67, minutes: 48 },
    { questions: 55, accuracy: 0.83, minutes: 77 },
    { questions: 0, accuracy: 0, minutes: 0 },
    { questions: 48, accuracy: 0.78, minutes: 67 },
    { questions: 42, accuracy: 0.75, minutes: 59 },
    { questions: 60, accuracy: 0.87, minutes: 85 },
    { questions: 38, accuracy: 0.72, minutes: 54 },
    { questions: 50, accuracy: 0.81, minutes: 71 },
    { questions: 45, accuracy: 0.79, minutes: 63 },
    { questions: 52, accuracy: 0.84, minutes: 74 },
  ];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const data = dailyData[29 - i];

    records.push({
      date: dateStr,
      questionCount: data.questions,
      correctCount: Math.round(data.questions * data.accuracy),
      studyMinutes: data.minutes,
      accuracy: data.accuracy,
    });
  }

  return records;
}

export const mockDailyRecords: DailyStudyRecord[] = generateDailyRecords();

export const mockWeaknesses: WeaknessAnalysis[] = [
  {
    subjectId: '한국사',
    subjectName: '한국사',
    unitId: '한국사_고려',
    unitName: '고려시대',
    accuracy: 0.52,
    attemptCount: 48,
    rank: 1,
    aiRecommendation: '고려시대 정치사, 특히 무신정권 시기와 원 간섭기에 대한 집중 학습이 필요합니다. 사건의 순서와 주요 인물을 연결지어 학습하세요.',
  },
  {
    subjectId: '영어',
    subjectName: '영어',
    unitId: '영어_문법',
    unitName: '문법',
    accuracy: 0.58,
    attemptCount: 65,
    rank: 2,
    aiRecommendation: '가정법과 수동태 관련 문법 오류가 잦습니다. 가정법 3가지 유형(1,2,3형)을 구분하여 반복 학습하고, 수동태 변환 연습을 늘려보세요.',
  },
  {
    subjectId: '국어',
    subjectName: '국어',
    unitId: '국어_어휘_한자',
    unitName: '어휘·한자',
    accuracy: 0.61,
    attemptCount: 42,
    rank: 3,
    aiRecommendation: '한자 어휘와 사자성어의 정확한 의미 파악이 부족합니다. 자주 출제되는 한자어 200개를 우선 암기하고 문맥 속에서 활용하는 연습을 하세요.',
  },
  {
    subjectId: '행정학개론',
    subjectName: '행정학개론',
    unitId: '행정학_재무행정론',
    unitName: '재무행정론',
    accuracy: 0.55,
    attemptCount: 35,
    rank: 4,
    aiRecommendation: '재무행정의 예산 과정과 예산 원칙에 대한 이해가 필요합니다. 특히 예산 유형별 특징(품목별, 성과주의, 계획예산제도 등)을 비교 정리하세요.',
  },
  {
    subjectId: '행정법총론',
    subjectName: '행정법총론',
    unitId: '행정법_행정구제법',
    unitName: '행정구제법',
    accuracy: 0.59,
    attemptCount: 38,
    rank: 5,
    aiRecommendation: '행정심판과 행정소송의 차이점, 각각의 요건과 절차를 명확히 구분하여 학습하세요. 특히 취소소송의 요건이 자주 출제됩니다.',
  },
];

export const mockStudyStats: StudyStats = {
  totalQuestions: 1240,
  totalCorrect: 920,
  overallAccuracy: 0.742,
  streakDays: 14,
  totalStudyMinutes: 1876,
  todayQuestions: 52,
  todayAccuracy: 0.84,
  recentResults: [],
  dailyRecords: mockDailyRecords,
  weaknesses: mockWeaknesses,
  subjectAccuracies: [
    { subjectId: '국어', subjectName: '국어', accuracy: 0.78 },
    { subjectId: '영어', subjectName: '영어', accuracy: 0.71 },
    { subjectId: '한국사', subjectName: '한국사', accuracy: 0.65 },
    { subjectId: '행정학개론', subjectName: '행정학개론', accuracy: 0.73 },
    { subjectId: '행정법총론', subjectName: '행정법총론', accuracy: 0.68 },
  ],
};
