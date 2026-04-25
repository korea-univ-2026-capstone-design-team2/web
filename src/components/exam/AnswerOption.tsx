'use client';

import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

interface AnswerOptionProps {
  number: 1 | 2 | 3 | 4 | 5;
  text: string;
  isSelected: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  resultMode?: boolean;
  onClick?: () => void;
}

const CIRCLE_LABELS = ['①', '②', '③', '④', '⑤'] as const;

export default function AnswerOption({
  number,
  text,
  isSelected,
  isCorrect = false,
  isWrong = false,
  resultMode = false,
  onClick,
}: AnswerOptionProps) {
  const idx = number - 1;
  const label = CIRCLE_LABELS[idx];

  if (resultMode) {
    const isCorrectAnswer = isCorrect;
    const isWrongAnswer = isWrong && isSelected;

    return (
      <div
        className={cn(
          'flex items-start gap-3 rounded-[8px] border px-4 py-3 transition-colors',
          isCorrectAnswer
            ? 'border-linear-status-emerald bg-linear-status-emerald/10'
            : isWrongAnswer
              ? 'border-red-500 bg-red-500/10'
              : 'border-white/6 bg-white/1'
        )}
      >
        <span
          className={cn(
            'mt-0.5 shrink-0 text-base font-medium',
            isCorrectAnswer
              ? 'text-linear-status-emerald'
              : isWrongAnswer
                ? 'text-red-500'
                : 'text-linear-text-tertiary'
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            'flex-1 text-sm leading-relaxed',
            isCorrectAnswer
              ? 'text-linear-status-emerald'
              : isWrongAnswer
                ? 'text-red-500'
                : 'text-linear-text-tertiary'
          )}
        >
          {text}
        </span>
        {isCorrectAnswer && (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-linear-status-emerald" strokeWidth={1.5} />
        )}
        {isWrongAnswer && (
          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" strokeWidth={1.5} />
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-[8px] border px-4 py-3 text-left transition-all duration-150',
        isSelected
          ? 'border-linear-brand-indigo bg-linear-brand-indigo/10'
          : 'border-white/8 bg-white/1 hover:border-white/20 hover:bg-white/3'
      )}
    >
      <span
        className={cn(
          'mt-0.5 shrink-0 text-base font-medium',
          isSelected ? 'text-linear-accent-violet' : 'text-linear-text-tertiary'
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          'flex-1 text-sm leading-relaxed',
          isSelected ? 'text-linear-text-primary' : 'text-linear-text-secondary'
        )}
      >
        {text}
      </span>
      {isSelected && (
        <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-linear-brand-indigo" />
      )}
    </button>
  );
}
