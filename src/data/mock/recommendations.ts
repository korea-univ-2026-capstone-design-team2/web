import type { RecommendedQuestion } from '@/types';
import { mockQuestions } from './questions';

const findQuestion = (id: string) => {
  const q = mockQuestions.find((q) => q.id === id);
  if (!q) throw new Error(`Question ${id} not found in mock data`);
  return q;
};

export const mockRecommendations: RecommendedQuestion[] = [
  {
    question: findQuestion('q_his_002'),
    reason: '고려 무신 정권 관련 문제에서 반복적으로 오답을 선택하고 있습니다. 사건 순서 파악이 약점입니다.',
    priority: 1,
    subjectName: '한국사',
    unitName: '고려시대',
  },
  {
    question: findQuestion('q_eng_004'),
    reason: '가정법 문법 문제의 정답률이 낮습니다. 3가지 가정법 형태를 집중 학습하세요.',
    priority: 2,
    subjectName: '영어',
    unitName: '문법',
  },
  {
    question: findQuestion('q_ko_007'),
    reason: '한자 어휘 관련 문제에서 오답이 많습니다. 사자성어와 한자어 학습이 필요합니다.',
    priority: 3,
    subjectName: '국어',
    unitName: '어휘·한자',
  },
  {
    question: findQuestion('q_his_007'),
    reason: '일제강점기 독립운동 단체 관련 문제가 반복 출제됩니다. 단체별 활동을 정리하세요.',
    priority: 4,
    subjectName: '한국사',
    unitName: '근·현대사',
  },
  {
    question: findQuestion('q_eng_008'),
    reason: '고급 문법 오류 찾기 문제에서 취약함이 나타납니다. 수일치 규칙을 복습하세요.',
    priority: 5,
    subjectName: '영어',
    unitName: '문법',
  },
  {
    question: findQuestion('q_ko_010'),
    reason: '비문학 독해에서 세부 내용 파악 문제의 정답률을 높여야 합니다.',
    priority: 6,
    subjectName: '국어',
    unitName: '비문학·독해',
  },
  {
    question: findQuestion('q_his_012'),
    reason: '1920년대 국내 민족운동 관련 문제가 시험에 자주 출제됩니다.',
    priority: 7,
    subjectName: '한국사',
    unitName: '근·현대사',
  },
  {
    question: findQuestion('q_eng_007'),
    reason: '영어 독해 세부 내용 파악 유형에서 개선이 필요합니다.',
    priority: 8,
    subjectName: '영어',
    unitName: '독해',
  },
  {
    question: findQuestion('q_ko_003'),
    reason: '표준어 관련 문제는 암기 중심으로 자주 출제됩니다. 자주 틀리는 표준어 목록을 정리하세요.',
    priority: 9,
    subjectName: '국어',
    unitName: '어법·맞춤법',
  },
  {
    question: findQuestion('q_his_010'),
    reason: '고려 토지제도는 매년 출제되는 핵심 주제입니다. 전시과 체계를 완벽히 이해하세요.',
    priority: 10,
    subjectName: '한국사',
    unitName: '고려시대',
  },
  {
    question: findQuestion('q_eng_006'),
    reason: '고급 어휘 문제에서 동의어 파악 능력이 부족합니다. 어휘력 확장이 필요합니다.',
    priority: 11,
    subjectName: '영어',
    unitName: '어휘',
  },
  {
    question: findQuestion('q_ko_004'),
    reason: '고전 시가의 정서 파악은 자주 출제됩니다. 시조의 3장 구조와 표현 방식을 학습하세요.',
    priority: 12,
    subjectName: '국어',
    unitName: '문학',
  },
  {
    question: findQuestion('q_his_006'),
    reason: '삼국시대 각 국가의 특징을 구분하는 문제가 반복 출제됩니다.',
    priority: 13,
    subjectName: '한국사',
    unitName: '선사시대·고대',
  },
  {
    question: findQuestion('q_eng_010'),
    reason: '최근 시사·기술 관련 독해 지문의 출제 비중이 높아지고 있습니다.',
    priority: 14,
    subjectName: '영어',
    unitName: '독해',
  },
  {
    question: findQuestion('q_ko_005'),
    reason: '고전 소설 관련 지식이 부족합니다. 주요 고전 소설의 줄거리와 특징을 정리하세요.',
    priority: 15,
    subjectName: '국어',
    unitName: '문학',
  },
];
