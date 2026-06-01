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

export type QuestionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'REJECTED' | (string & {});
export type ExamStatus = 'GENERATING' | 'READY' | 'FAILED';
export type TokenUsageTargetDomain =
  | 'QUESTION_GENERATION'
  | 'FRAME_RETRIEVAL'
  | 'FRAME_INGESTION'
  | 'EXPLANATION_GENERATION'
  | 'EXAM_GENERATION';
export type AiProvider = 'OPENAI' | 'ANTHROPIC';
export type AiModel = 'GPT_5_MINI' | 'GPT_5_4_MINI' | 'CLAUDE_HAIKU_4_5';
export type TokenUsageStatus = 'SUCCESS' | 'FAILED';

export interface AnswerChoiceView {
  number: number;
  text: string;
}

export interface AnswerChoiceViewWithAnswer extends AnswerChoiceView {
  correct: boolean;
}

export interface QuestionItemPropositionView {
  label: PropositionLabel | string;
  content: string;
}

export interface QuestionItemPaperView {
  questionItemId: number;
  questionId: number;
  subject: Subject;
  questionType: QuestionType;
  questionSubType: QuestionSubType | null;
  difficulty: DifficultyLevel;
  stem: string;
  exhibitType: string | null;
  exhibitContent: string | null;
  propositions: QuestionItemPropositionView[] | null;
  answerSheetType: string;
  choices: AnswerChoiceView[];
}

export interface QuestionPaperView {
  questionId: number;
  generationId: number;
  subject: Subject;
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  sharedContextContent: string | null;
  sharedContextDescription: string | null;
  items: QuestionItemPaperView[];
}

export interface QuestionItemReviewView extends Omit<QuestionItemPaperView, 'choices'> {
  correctNumber: number;
  choices: AnswerChoiceViewWithAnswer[];
  correctReason: string;
  incorrectReasons: Record<string, string>;
}

export interface QuestionReviewView extends Omit<QuestionPaperView, 'items'> {
  items: QuestionItemReviewView[];
}

export interface QuestionItemDetailView extends QuestionItemReviewView {
  generationId: number;
  status: 'DRAFT' | 'PUBLISHED' | 'REJECTED';
  qualityScore: number | null;
}

export interface QuestionDetailView extends Omit<QuestionReviewView, 'items'> {
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  passageTopicCategory: string | null;
  passageTopicKeyword: string | null;
  items: QuestionItemDetailView[];
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

export interface QuestionPaper extends Omit<QuestionItemPaperView, 'questionId'> {
  questionId: number;
  groupQuestionId: number;
  generationId: number;
  sharedContextContent: string | null;
  sharedContextDescription: string | null;
  passageType: string | null;
  passageContent: string | null;
}

export interface AnswerChoiceResult extends AnswerChoiceView {
  isCorrect: boolean;
}

export interface QuestionReview extends Omit<QuestionPaper, 'choices'> {
  correctNumber: number | null;
  choices: AnswerChoiceResult[];
  correctReason: string;
  incorrectReasons: Record<string, string>;
}

export interface QuestionDetail extends QuestionReview {
  status: QuestionStatus;
  qualityScore: number | null;
  passageTopicCategory: TopicCategory | string | null;
  passageTopicKeyword: string | null;
  frameId: number;
  similarityScore: number;
  frameType: string;
}

export interface GenerateQuestionReqDto {
  subject: Subject;
  questionType?: QuestionType | null;
  questionSubType?: QuestionSubType | null;
  difficulty?: DifficultyLevel | null;
  topicCategory?: string | null;
  topicKeyword?: string | null;
  topicDescription?: string | null;
  quantity?: number;
}

export interface GenerateQuestionResDto {
  generationId: number;
  questionIds: number[];
  successCount: number;
  failCount: number;
  status: string;
}

export interface CreateQuestionResDto {
  questionId: number;
  questionItemIds: number[];
}

export interface GenerateExamReqDto {
  title: string;
  subject: Subject;
  questionType: QuestionType;
  questionSubType?: QuestionSubType | null;
  difficulty: DifficultyLevel;
  topicCategory: TopicCategory;
  topicKeyword?: string | null;
  topicDescription?: string | null;
  targetQuestionCount: number;
  frameSearchTopK?: number;
}

export interface GenerateExamResDto {
  examId: number;
  status: ExamStatus;
  generationId: number | null;
  successCount: number;
  failCount: number;
}

export interface GetExamListParams {
  subject?: Subject;
  questionType?: QuestionType;
  difficulty?: DifficultyLevel;
  status?: ExamStatus;
  page?: number;
  size?: number;
}

export interface ExamSummaryResDto {
  examId: number;
  title: string;
  subject: Subject;
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  targetQuestionCount: number;
  actualQuestionCount: number;
  status: ExamStatus;
  createdAt: string;
}

export interface GetExamListResDto {
  items: ExamSummaryResDto[];
  totalCount: number;
  page: number;
  size: number;
}

export interface ExamItemResDto {
  examItemId: number;
  questionId: number;
  ordering: number;
}

export interface GetExamDetailResDto {
  examId: number;
  title: string;
  subject: Subject;
  questionType: QuestionType;
  questionSubType: QuestionSubType | null;
  difficulty: DifficultyLevel;
  topicCategory: TopicCategory;
  topicKeyword: string | null;
  topicDescription: string | null;
  targetQuestionCount: number;
  status: ExamStatus;
  generationId: number | null;
  generationSuccessCount: number | null;
  generationFailCount: number | null;
  items: ExamItemResDto[];
  createdAt: string;
  updatedAt: string;
}

export interface TokenUsageFilters {
  targetDomain?: TokenUsageTargetDomain;
  targetReferenceId?: number;
  provider?: AiProvider;
  model?: AiModel;
  status?: TokenUsageStatus;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}

export interface TokenUsageSummaryView {
  tokenUsageId: number;
  targetDomain: TokenUsageTargetDomain;
  targetReferenceId: number;
  provider: AiProvider;
  model: AiModel;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  totalCost: number;
  currency: string;
  status: TokenUsageStatus;
  createdAt: string;
}

export interface GetTokenUsageListResult {
  items: TokenUsageSummaryView[];
  totalCount: number;
}

export interface RecordTokenUsageReqDto {
  targetDomain: TokenUsageTargetDomain;
  targetReferenceId: number;
  provider: AiProvider;
  model: AiModel;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  promptCost: number;
  completionCost: number;
  totalCost: number;
  currency: string;
}

export interface RecordTokenUsageResDto {
  tokenUsageId: number;
}

export interface TokenUsageStatisticsView {
  totalRequests: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalTokens: number;
  totalCost: number;
}

export interface TokenUsageDailyStatisticsView extends TokenUsageStatisticsView {
  date: string;
}

export interface GetTokenUsageStatisticsResult {
  summary: TokenUsageStatisticsView;
  daily: TokenUsageDailyStatisticsView[];
}

export interface IngestFrameReqDto {
  frames: unknown[];
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
