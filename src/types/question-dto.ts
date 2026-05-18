export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export type PropositionLabel = 'ㄱ' | 'ㄴ' | 'ㄷ' | 'ㄹ' | 'ㅁ';

export type QuestionSubType =
  | 'MATCH'
  | 'KNOWABLE'
  | 'CONTEXT_CORRECTION'
  | 'BLANK_FILLING'
  | 'CORE_ARGUMENT'
  | 'INFERENCE'
  | 'ARGUMENT_ANALYSIS'
  | 'STRENGTHEN_WEAKEN';

export type QuestionType = 'READING' | 'LOGIC_PUZZLE' | 'ARGUMENTATION';

export type Subject = 'VERBAL_LOGIC' | 'DATA_INTERPRETATION' | 'SITUATIONAL_JUDGMENT';

export type TopicCategory =
  | 'POLITICS'
  | 'ECONOMY'
  | 'SOCIETY'
  | 'LAW'
  | 'HISTORY'
  | 'PHILOSOPHY'
  | 'SCIENCE'
  | 'TECHNOLOGY'
  | 'CULTURE'
  | 'ENVIRONMENT';

export type QuestionStatus = 'DRAFT' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED' | (string & {});

export interface AnswerChoice {
  number: number;
  text: string;
}

export interface AnswerChoiceResult {
  number: number;
  text: string;
  isCorrect: boolean;
}

export interface QuestionProposition {
  label: PropositionLabel;
  content: string;
}

export interface QuestionSummary {
  questionId: number;
  questionSetId: number | null;
  subject: Subject;
  questionType: QuestionType;
  questionSubType: QuestionSubType | null;
  difficulty: DifficultyLevel;
  status: QuestionStatus;
  qualityScore: number | null;
}

export interface QuestionPaper {
  questionId: number;
  questionSetId: number | null;
  subject: Subject;
  questionType: QuestionType;
  questionSubType: QuestionSubType | null;
  difficulty: DifficultyLevel;
  stem: string;
  passageType: string | null;
  passageContent: string | null;
  exhibitType: string | null;
  exhibitContent: string | null;
  propositions: QuestionProposition[] | null;
  answerSheetType: string;
  choices: AnswerChoice[];
}

export interface QuestionReview {
  questionId: number;
  questionSetId: number | null;
  subject: Subject;
  questionType: QuestionType;
  questionSubType: QuestionSubType | null;
  difficulty: DifficultyLevel;
  stem: string;
  passageType: string | null;
  passageContent: string | null;
  exhibitType: string | null;
  exhibitContent: string | null;
  propositions: QuestionProposition[] | null;
  answerSheetType: string;
  correctNumber: number | null;
  choices: AnswerChoiceResult[];
  correctReason: string;
  incorrectReasons: Record<string, string>;
}

export interface QuestionDetail {
  questionId: number;
  generationId: number;
  questionSetId: number | null;
  subject: Subject;
  questionType: QuestionType;
  questionSubType: QuestionSubType | null;
  difficulty: DifficultyLevel;
  status: QuestionStatus;
  qualityScore: number | null;
  passageTopicCategory: TopicCategory | null;
  passageTopicKeyword: string | null;
  stem: string;
  passageType: string | null;
  passageContent: string | null;
  exhibitType: string | null;
  exhibitContent: string | null;
  propositions: QuestionProposition[] | null;
  answerSheetType: string;
  correctNumber: number | null;
  choices: AnswerChoiceResult[];
  correctReason: string;
  incorrectReasons: Record<string, string>;
  frameId: number;
  similarityScore: number;
  frameType: string;
}

export const SUBJECT_LABEL: Record<Subject, string> = {
  VERBAL_LOGIC: '언어논리',
  DATA_INTERPRETATION: '자료해석',
  SITUATIONAL_JUDGMENT: '상황판단',
};

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  READING: '독해',
  LOGIC_PUZZLE: '논리퀴즈',
  ARGUMENTATION: '논증',
};

export const DIFFICULTY_LABEL: Record<DifficultyLevel, string> = {
  EASY: '쉬움',
  MEDIUM: '보통',
  HARD: '어려움',
};
