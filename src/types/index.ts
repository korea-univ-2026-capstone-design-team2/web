// Exam categories
export type ExamCategory =
  | '9급_국가직'
  | '9급_지방직'
  | '경찰_공채'
  | '소방_공채'
  | '5급_PSAT'
  | '전산직_9급';

export interface ExamCategoryInfo {
  id: ExamCategory;
  name: string;
  description: string;
  subjects: SubjectInfo[];
  icon: string;
  color: string;
}

export interface SubjectInfo {
  id: string;
  name: string;
  units: UnitInfo[];
}

export interface UnitInfo {
  id: string;
  name: string;
  subjectId: string;
}

// Questions
export type QuestionType = 'multiple_choice' | 'passage_based' | 'image_based';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  subjectId: string;
  unitId: string;
  type: QuestionType;
  difficulty: Difficulty;
  year?: number;
  passage?: string;
  imageUrl?: string;
  content: string;
  options: string[];
  correctAnswer: number; // 1-5
  explanation: string;
  tags: string[];
}

// Exam session
export type ExamType = 'mock' | 'practice' | 'weakness';

export interface ExamConfig {
  id: string;
  categoryId: ExamCategory;
  subjectIds: string[];
  type: ExamType;
  questionCount: number;
  timeLimit: number; // minutes
  questions: Question[];
}

export interface QuestionState {
  questionId: string;
  selectedAnswer?: number;
  isBookmarked: boolean;
  isUnknown: boolean;
  timeSpent: number; // seconds
}

export interface ExamSession {
  id: string;
  examConfig: ExamConfig;
  questionStates: QuestionState[];
  startedAt: Date;
  finishedAt?: Date;
  status: 'in_progress' | 'completed' | 'abandoned';
}

// Results
export interface ExamResult {
  id: string;
  sessionId: string;
  examConfig: ExamConfig;
  questionStates: QuestionState[];
  totalScore: number;
  correctCount: number;
  totalCount: number;
  accuracy: number;
  timeSpent: number; // seconds
  subjectScores: SubjectScore[];
  finishedAt: Date;
  aiComment: string;
}

export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  correctCount: number;
  totalCount: number;
  accuracy: number;
}

// Analytics
export interface WeaknessAnalysis {
  subjectId: string;
  subjectName: string;
  unitId: string;
  unitName: string;
  accuracy: number;
  attemptCount: number;
  rank: number;
  aiRecommendation: string;
}

export interface DailyStudyRecord {
  date: string; // YYYY-MM-DD
  questionCount: number;
  correctCount: number;
  studyMinutes: number;
  accuracy: number;
}

export interface StudyStats {
  totalQuestions: number;
  totalCorrect: number;
  overallAccuracy: number;
  streakDays: number;
  totalStudyMinutes: number;
  todayQuestions: number;
  todayAccuracy: number;
  recentResults: ExamResult[];
  dailyRecords: DailyStudyRecord[];
  weaknesses: WeaknessAnalysis[];
  subjectAccuracies: { subjectId: string; subjectName: string; accuracy: number }[];
}

// User
export interface User {
  id: string;
  name: string;
  email: string;
  targetExam: ExamCategory;
  targetScore: number;
  createdAt: Date;
  avatarUrl?: string;
}

// Recommended questions
export interface RecommendedQuestion {
  question: Question;
  reason: string;
  priority: number;
  subjectName: string;
  unitName: string;
}
