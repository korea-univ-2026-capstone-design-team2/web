'use client';

import { cn } from '@/lib/utils';
import AnswerOption from './AnswerOption';

export interface Question {
  id: string;
  number: number;
  content: string;
  passage?: string;
  options: string[];
  correctAnswer: number; // 1-indexed
  type: 'multiple_choice' | 'passage_based';
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: number;
  resultMode?: boolean;
  onAnswer?: (optionNumber: number) => void;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  resultMode = false,
  onAnswer,
}: QuestionCardProps) {
  if (question.type === 'passage_based' && question.passage) {
    return (
      <div className="flex h-full flex-col gap-4 lg:flex-row">
        {/* Passage */}
        <div className="flex-1 rounded-[8px] bg-white/2 border border-white/8 p-4 lg:overflow-y-auto lg:max-h-[calc(100vh-200px)]">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-linear-text-tertiary">
            지문
          </div>
          <p className="text-sm leading-7 text-linear-text-secondary whitespace-pre-line">
            {question.passage}
          </p>
        </div>

        {/* Question & Options */}
        <div className="flex-1 space-y-3">
          <QuestionContent question={question} selectedAnswer={selectedAnswer} resultMode={resultMode} onAnswer={onAnswer} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <QuestionContent question={question} selectedAnswer={selectedAnswer} resultMode={resultMode} onAnswer={onAnswer} />
    </div>
  );
}

interface QuestionContentProps {
  question: Question;
  selectedAnswer?: number;
  resultMode?: boolean;
  onAnswer?: (optionNumber: number) => void;
}

function QuestionContent({ question, selectedAnswer, resultMode, onAnswer }: QuestionContentProps) {
  return (
    <>
      {/* Question Text */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-brand-indigo text-xs font-semibold text-white shrink-0">
            {question.number}
          </span>
          <span className="text-xs text-linear-text-tertiary font-medium">{question.subject}</span>
          <span
            className={cn(
              'ml-auto text-xs px-2 py-0.5 rounded-full',
              question.difficulty === 'easy'
                ? 'bg-linear-status-emerald/10 text-linear-status-emerald'
                : question.difficulty === 'medium'
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'bg-red-500/10 text-red-500'
            )}
          >
            {question.difficulty === 'easy' ? '하' : question.difficulty === 'medium' ? '중' : '상'}
          </span>
        </div>
        <p className="linear-text-body text-linear-text-primary">
          {question.content}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2 pt-2">
        {question.options.map((optionText, idx) => {
          const optionNumber = (idx + 1) as 1 | 2 | 3 | 4 | 5;
          const isSelected = selectedAnswer === optionNumber;
          const isCorrect = resultMode && question.correctAnswer === optionNumber;
          const isWrong = resultMode && selectedAnswer === optionNumber && selectedAnswer !== question.correctAnswer;

          return (
            <AnswerOption
              key={idx}
              number={optionNumber}
              text={optionText.replace(/^[①②③④⑤]\s?/, '')}
              isSelected={isSelected}
              isCorrect={isCorrect}
              isWrong={isWrong}
              resultMode={resultMode}
              onClick={!resultMode ? () => onAnswer?.(optionNumber) : undefined}
            />
          );
        })}
      </div>
    </>
  );
}
