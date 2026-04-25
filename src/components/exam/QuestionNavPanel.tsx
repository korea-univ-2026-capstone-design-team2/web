'use client';

import { cn } from '@/lib/utils';
import { Bookmark, HelpCircle } from 'lucide-react';

interface QuestionNavPanelProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<number, number>;
  bookmarks: Set<number>;
  unknowns: Set<number>;
  onSelect: (index: number) => void;
}

export default function QuestionNavPanel({
  totalQuestions,
  currentIndex,
  answers,
  bookmarks,
  unknowns,
  onSelect,
}: QuestionNavPanelProps) {
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="flex h-full flex-col">
      {/* Legend */}
      <div className="mb-4 space-y-1.5 px-1">
        <div className="flex items-center gap-2 text-xs text-linear-text-tertiary">
          <div className="h-3 w-3 rounded-full border border-white/15 bg-white/4" />
          <span>미답변</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-linear-text-tertiary">
          <div className="h-3 w-3 rounded-full bg-linear-brand-indigo" />
          <span>답변 완료</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-linear-text-tertiary">
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <span>모르는 문제</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-linear-text-tertiary">
          <Bookmark className="h-3 w-3 text-linear-accent-violet" strokeWidth={1.5} />
          <span>북마크</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4 rounded-[8px] bg-white/2 border border-white/6 px-3 py-2">
        <div className="flex justify-between text-xs text-linear-text-tertiary mb-1.5">
          <span>진행률</span>
          <span className="text-linear-text-secondary">{answeredCount}/{totalQuestions}</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
          <div
            className="h-full rounded-full bg-linear-brand-indigo transition-all duration-300"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-5 gap-1.5 flex-1">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const isAnswered = i in answers;
          const isUnknown = unknowns.has(i);
          const isBookmarked = bookmarks.has(i);
          const isCurrent = i === currentIndex;

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              className={cn(
                'relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all duration-150',
                isCurrent && 'ring-2 ring-white/30 ring-offset-1 ring-offset-linear-bg-panel',
                isUnknown
                  ? 'bg-amber-500/80 text-white'
                  : isAnswered
                    ? 'bg-linear-brand-indigo text-white'
                    : 'border border-white/12 bg-white/4 text-linear-text-tertiary hover:border-white/25 hover:text-linear-text-secondary'
              )}
            >
              {i + 1}
              {isBookmarked && (
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-linear-accent-violet" />
              )}
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="rounded-[6px] bg-linear-brand-indigo/10 border border-linear-brand-indigo/20 py-1.5">
          <div className="font-semibold text-linear-accent-violet">{answeredCount}</div>
          <div className="text-linear-text-tertiary">답변</div>
        </div>
        <div className="rounded-[6px] bg-white/2 border border-white/6 py-1.5">
          <div className="font-semibold text-linear-text-secondary">{unansweredCount}</div>
          <div className="text-linear-text-tertiary">미답변</div>
        </div>
      </div>
    </div>
  );
}
