import type { Question } from '@/types';
import type {
  DifficultyLevel,
  QuestionDetail,
  QuestionPaper,
  QuestionReview,
  QuestionStatus,
  QuestionSummary,
  QuestionType,
  Subject,
} from '@/types/question-dto';

function mapDifficulty(difficulty: Question['difficulty']): DifficultyLevel {
  if (difficulty === 'easy') return 'EASY';
  if (difficulty === 'medium') return 'MEDIUM';
  return 'HARD';
}

function mapQuestionType(type: Question['type']): QuestionType {
  if (type === 'passage_based') return 'ARGUMENTATION';
  if (type === 'image_based') return 'LOGIC_PUZZLE';
  return 'READING';
}

function mapSubject(subjectId: string): Subject {
  if (subjectId === '자료해석') return 'DATA_INTERPRETATION';
  if (subjectId === '상황판단') return 'SITUATIONAL_JUDGMENT';
  return 'VERBAL_LOGIC';
}

function buildIncorrectReasons(question: Question): Record<string, string> {
  return question.options.reduce<Record<string, string>>((acc, option, index) => {
    const optionNumber = index + 1;
    if (optionNumber !== question.correctAnswer) {
      acc[String(optionNumber)] = `"${option}"는 정답 근거와 일치하지 않습니다.`;
    }
    return acc;
  }, {});
}

function basePaper(question: Question, order?: number): QuestionPaper {
  const questionId = order !== undefined ? order + 1 : question.questionId;
  return {
    questionId,
    questionItemId: questionId,
    groupQuestionId: questionId,
    generationId: 0,
    sharedContextContent: question.passage ?? null,
    sharedContextDescription: null,
    subject: mapSubject(question.subjectId),
    questionType: mapQuestionType(question.type),
    questionSubType: null,
    difficulty: mapDifficulty(question.difficulty),
    stem: question.content,
    passageType: question.passage ? 'TEXT' : null,
    passageContent: question.passage ?? null,
    exhibitType: question.imageUrl ? 'IMAGE' : null,
    exhibitContent: question.imageUrl ?? null,
    propositions: null,
    answerSheetType: 'SINGLE_CHOICE',
    choices: question.options.map((text, index) => ({ number: index + 1, text })),
  };
}

export function toQuestionPaperDto(question: Question, order?: number): QuestionPaper {
  return basePaper(question, order);
}

export function toQuestionSummaryDto(
  question: Question,
  order?: number,
  status: QuestionStatus = 'PUBLISHED'
): QuestionSummary {
  const paper = basePaper(question, order);
  return {
    questionId: paper.questionId,
    questionSetId: null,
    subject: paper.subject,
    questionType: paper.questionType,
    questionSubType: paper.questionSubType,
    difficulty: paper.difficulty,
    status,
    qualityScore: null,
  };
}

export function toQuestionReviewDto(question: Question, order?: number): QuestionReview {
  const paper = basePaper(question, order);
  return {
    ...paper,
    correctNumber: question.correctAnswer,
    choices: question.options.map((text, index) => ({
      number: index + 1,
      text,
      isCorrect: index + 1 === question.correctAnswer,
    })),
    correctReason: question.explanation,
    incorrectReasons: buildIncorrectReasons(question),
  };
}

export function toQuestionDetailDto(question: Question, order?: number): QuestionDetail {
  const review = toQuestionReviewDto(question, order);
  return {
    ...review,
    status: 'PUBLISHED',
    qualityScore: null,
    passageTopicCategory: null,
    passageTopicKeyword: null,
    frameId: 0,
    similarityScore: 0,
    frameType: 'NONE',
  };
}
