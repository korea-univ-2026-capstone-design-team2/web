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

export function toQuestionPaperDto(question: Question, order: number): QuestionPaper {
  return {
    questionId: order + 1,
    questionSetId: null,
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

export function toQuestionSummaryDto(
  question: Question,
  order: number,
  status: QuestionStatus = 'PUBLISHED'
): QuestionSummary {
  return {
    questionId: order + 1,
    questionSetId: null,
    subject: mapSubject(question.subjectId),
    questionType: mapQuestionType(question.type),
    questionSubType: null,
    difficulty: mapDifficulty(question.difficulty),
    status,
    qualityScore: null,
  };
}

export function toQuestionReviewDto(question: Question, order: number): QuestionReview {
  return {
    questionId: order + 1,
    questionSetId: null,
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

export function toQuestionDetailDto(question: Question, order: number): QuestionDetail {
  const review = toQuestionReviewDto(question, order);
  return {
    questionId: review.questionId,
    generationId: 0,
    questionSetId: review.questionSetId,
    subject: review.subject,
    questionType: review.questionType,
    questionSubType: review.questionSubType,
    difficulty: review.difficulty,
    status: 'PUBLISHED',
    qualityScore: null,
    passageTopicCategory: null,
    passageTopicKeyword: null,
    stem: review.stem,
    passageType: review.passageType,
    passageContent: review.passageContent,
    exhibitType: review.exhibitType,
    exhibitContent: review.exhibitContent,
    propositions: review.propositions,
    answerSheetType: review.answerSheetType,
    correctNumber: review.correctNumber,
    choices: review.choices,
    correctReason: review.correctReason,
    incorrectReasons: review.incorrectReasons,
    frameId: 0,
    similarityScore: 0,
    frameType: 'NONE',
  };
}
