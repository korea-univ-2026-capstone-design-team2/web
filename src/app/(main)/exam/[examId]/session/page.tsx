'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import QuestionCard, { type Question as ExamQuestion } from '@/components/exam/QuestionCard';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { questionService } from '@/lib/services/questionService';
import type { QuestionPaper } from '@/types/question-dto';
import { DIFFICULTY_LABEL, QUESTION_TYPE_LABEL, SUBJECT_LABEL } from '@/types/question-dto';

const TIME_LIMIT_SECONDS = 45 * 60;
const QUESTIONS_PER_VIEW = 4;
const DEFAULT_QUESTION_IDS = Array.from({ length: 20 }, (_, i) => i + 1);

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function toCardQuestion(paper: QuestionPaper): ExamQuestion {
  return {
    questionId: paper.questionId,
    number: paper.questionId,
    content: paper.stem,
    passage: paper.passageContent ?? undefined,
    options: paper.choices.map((choice) => choice.text),
    correctAnswer: 1,
    type: paper.passageContent ? 'passage_based' : 'multiple_choice',
    subject: SUBJECT_LABEL[paper.subject],
    difficulty:
      paper.difficulty === 'EASY' ? 'easy' : paper.difficulty === 'MEDIUM' ? 'medium' : 'hard',
  };
}

export default function ExamSessionPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;

  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isOmrPanelOpen, setIsOmrPanelOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    void questionService.getQuestionPapersByIds(DEFAULT_QUESTION_IDS).then((response) => {
      if (!mounted) return;
      const sorted = [...response].sort((a, b) => a.questionId - b.questionId);
      setPapers(sorted);
      if (sorted.length) {
        setCurrentQuestionId(sorted[0].questionId);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      router.push(`/exam/${examId}/result`);
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, router, examId]);

  const total = papers.length;
  const orderedQuestionIds = useMemo(() => papers.map((paper) => paper.questionId), [papers]);
  const currentIndex = useMemo(
    () => orderedQuestionIds.findIndex((questionId) => questionId === currentQuestionId),
    [orderedQuestionIds, currentQuestionId]
  );

  const pageStart = Math.floor(Math.max(currentIndex, 0) / QUESTIONS_PER_VIEW) * QUESTIONS_PER_VIEW;
  const visiblePapers = papers.slice(pageStart, pageStart + QUESTIONS_PER_VIEW);

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = Math.max(total - answeredCount, 0);
  const progress = total > 0 ? (answeredCount / total) * 100 : 0;
  const isLowTime = timeLeft < 5 * 60;

  function handleAnswer(questionId: number, optionNumber: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionNumber }));
    setCurrentQuestionId(questionId);
  }

  function movePage(direction: 'prev' | 'next') {
    if (!total) return;
    const nextIndex =
      direction === 'prev'
        ? Math.max(0, pageStart - QUESTIONS_PER_VIEW)
        : Math.min(total - 1, pageStart + QUESTIONS_PER_VIEW);
    setCurrentQuestionId(orderedQuestionIds[nextIndex]);
  }

  function handleSubmitConfirm() {
    router.push(`/exam/${examId}/result`);
  }

  function renderOmrPanel() {
    return (
      <div className="flex h-full flex-col rounded-[12px] border border-border bg-white shadow-[var(--shadow-level-2)]">
        <div className="border-b border-border px-4 py-4">
          <div className="rounded-[10px] border border-border bg-white px-3 py-3">
            <div className="text-xs text-linear-text-tertiary">제한 시간</div>
            <div className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-linear-text-secondary">
              <Clock className="h-4 w-4 text-linear-text-tertiary" />
              {formatTime(TIME_LIMIT_SECONDS)}
            </div>
            <div className="mt-2 h-px bg-border" />
            <div className="mt-2 text-xs text-linear-text-tertiary">남은 시간</div>
            <div
              className={cn(
                'mt-0.5 text-lg font-semibold tabular-nums',
                isLowTime ? 'text-red-500' : 'text-linear-brand-indigo'
              )}
            >
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="mt-3 rounded-[10px] border border-border bg-white px-3 py-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-linear-text-tertiary">전체 문제</span>
              <span className="font-semibold text-linear-text-primary">{total}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-linear-text-tertiary">안 푼 문제</span>
              <span className="font-semibold text-red-500">{unansweredCount}</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/6 dark:bg-white/8">
              <div className="h-full bg-linear-brand-indigo transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="border-b border-border px-4 py-3">
          <h2 className="linear-text-small-medium text-linear-text-secondary">답안 표기란</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          <div className="space-y-1.5">
            {papers.map((paper) => {
              const selected = answers[paper.questionId];
              const isCurrent = paper.questionId === currentQuestionId;
              return (
                <div
                  key={paper.questionId}
                  className={cn(
                    'grid grid-cols-[32px_1fr] items-center gap-2 rounded-[8px] border px-2 py-1.5 transition-colors',
                    isCurrent
                      ? 'border-linear-brand-indigo/40 bg-linear-brand-indigo/8'
                      : 'border-border bg-white'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionId(paper.questionId)}
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                      isCurrent
                        ? 'bg-linear-brand-indigo text-white'
                        : selected
                          ? 'bg-linear-brand-indigo/15 text-linear-accent-violet'
                          : 'border border-border text-linear-text-tertiary'
                    )}
                  >
                    {paper.questionId}
                  </button>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((choice) => {
                      const checked = selected === choice;
                      return (
                        <button
                          key={choice}
                          type="button"
                          onClick={() => handleAnswer(paper.questionId, choice)}
                          className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-semibold transition-colors',
                            checked
                              ? 'border-linear-brand-indigo bg-linear-brand-indigo text-white'
                              : 'border-border bg-white text-linear-text-tertiary hover:border-linear-brand-indigo/40 hover:text-linear-text-secondary'
                          )}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="w-full rounded-[8px] bg-linear-brand-indigo py-2.5 text-sm font-semibold text-white transition-colors hover:bg-linear-brand-indigo/90"
          >
            답안 제출하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 text-linear-text-primary md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <header className="rounded-[12px] border border-border bg-white px-4 py-3 shadow-[var(--shadow-level-1)]">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <p className="text-xs text-linear-text-tertiary">실전 응시</p>
              <h1 className="linear-text-body-medium text-linear-text-primary">PSAT 실전 문제</h1>
            </div>

            {papers[currentIndex] && (
              <div className="rounded-[8px] border border-border bg-white px-3 py-1.5 text-xs text-linear-text-tertiary">
                {SUBJECT_LABEL[papers[currentIndex].subject]} · {QUESTION_TYPE_LABEL[papers[currentIndex].questionType]} ·{' '}
                {DIFFICULTY_LABEL[papers[currentIndex].difficulty]}
              </div>
            )}

            <div className="ml-auto flex items-center gap-2">
              <div
                className={cn(
                  'rounded-[8px] border px-3 py-1.5 text-sm font-semibold tabular-nums',
                  isLowTime
                    ? 'border-red-500/25 bg-red-500/8 text-red-500'
                    : 'border-border bg-white text-linear-accent-violet'
                )}
              >
                남은 시간 {formatTime(timeLeft)}
              </div>
              <button
                type="button"
                onClick={() => setIsOmrPanelOpen(true)}
                className="rounded-[8px] border border-border bg-white px-3 py-1.5 text-xs text-linear-text-secondary lg:hidden"
              >
                OMR 보기
              </button>
            </div>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <main className="rounded-[12px] border border-border bg-white shadow-[var(--shadow-level-2)]">
            <div className="border-b border-border px-5 py-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-linear-text-tertiary">
                  현재 묶음:{' '}
                  <span className="font-semibold text-linear-text-primary">
                    {total ? `${pageStart + 1}~${Math.min(pageStart + QUESTIONS_PER_VIEW, total)}번` : '-'}
                  </span>
                </p>
                <p className="text-sm text-linear-text-tertiary">
                  진행도 <span className="font-semibold text-linear-accent-violet">{answeredCount}/{total}</span>
                </p>
              </div>
            </div>

            <div className="max-h-[calc(100vh-210px)] space-y-4 overflow-y-auto px-5 py-5">
              {visiblePapers.map((paper) => {
                const isCurrent = paper.questionId === currentQuestionId;
                return (
                  <section
                    key={paper.questionId}
                    className={cn(
                      'rounded-[12px] border p-4 md:p-5',
                      isCurrent
                        ? 'border-linear-brand-indigo/35 bg-linear-brand-indigo/6'
                        : 'border-border bg-white'
                    )}
                  >
                    <QuestionCard
                      question={toCardQuestion(paper)}
                      selectedAnswer={answers[paper.questionId]}
                      onAnswer={(optionNumber) => handleAnswer(paper.questionId, optionNumber)}
                    />
                  </section>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-border px-5 py-3">
              <button
                type="button"
                onClick={() => movePage('prev')}
                disabled={pageStart === 0}
                className="inline-flex items-center gap-1.5 rounded-[8px] border border-border bg-white px-3 py-2 text-sm text-linear-text-secondary transition-colors hover:bg-black/3 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/6"
              >
                <ChevronLeft className="h-4 w-4" />
                이전 묶음
              </button>

              <button
                type="button"
                onClick={() => movePage('next')}
                disabled={pageStart + QUESTIONS_PER_VIEW >= total}
                className="inline-flex items-center gap-1.5 rounded-[8px] border border-border bg-white px-3 py-2 text-sm text-linear-text-secondary transition-colors hover:bg-black/3 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/6"
              >
                다음 묶음
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </main>

          <aside className="hidden h-[calc(100vh-170px)] lg:block">{renderOmrPanel()}</aside>
        </div>
      </div>

      <Sheet open={isOmrPanelOpen} onOpenChange={setIsOmrPanelOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-hidden rounded-t-[16px] border-t border-border bg-white p-0">
          <SheetHeader className="border-b border-border px-4 py-3">
            <SheetTitle className="text-linear-text-primary">OMR 답안 표기란</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(85vh-60px)] p-3">{renderOmrPanel()}</div>
        </SheetContent>
      </Sheet>

      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="border border-border bg-white text-linear-text-primary sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-linear-text-primary">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              시험 제출
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <p className="text-sm text-linear-text-secondary">시험을 제출하면 더 이상 수정할 수 없습니다.</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[8px] border border-linear-brand-indigo/25 bg-linear-brand-indigo/10 p-3 text-center">
                <span className="text-xs text-linear-text-tertiary">답변 완료</span>
                <p className="mt-1 text-2xl font-bold text-linear-text-primary">{answeredCount}</p>
              </div>
              <div className="rounded-[8px] border border-border bg-white p-3 text-center">
                <span className="text-xs text-linear-text-tertiary">미응답</span>
                <p className="mt-1 text-2xl font-bold text-red-500">{unansweredCount}</p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-row gap-2">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="flex-1 rounded-[8px] border border-border bg-white py-2.5 text-sm text-linear-text-secondary transition-colors hover:bg-black/3 dark:hover:bg-white/6"
            >
              계속 풀기
            </button>
            <button
              type="button"
              onClick={handleSubmitConfirm}
              className="flex-1 rounded-[8px] bg-linear-brand-indigo py-2.5 text-sm font-semibold text-white transition-colors hover:bg-linear-brand-indigo/90"
            >
              최종 제출
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
