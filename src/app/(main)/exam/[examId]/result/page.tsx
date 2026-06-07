'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  TrendingUp,
  Bot,
  RotateCcw,
  LayoutDashboard,
  Zap,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import AnswerOption from '@/components/exam/AnswerOption';
import { hasApiBaseUrl } from '@/lib/api/client';
import { examAttemptService } from '@/lib/services/examAttemptService';
import { questionService } from '@/lib/services/questionService';
import { examService } from '@/lib/services/examService';
import type { GetExamAttemptResultResDto, QuestionReview } from '@/types/question-dto';
import { SUBJECT_LABEL } from '@/types/question-dto';

const DEFAULT_QUESTION_IDS = Array.from({ length: 20 }, (_, i) => i + 1);
const EXAM_DURATION_SECONDS = 42 * 60 + 18;
const EXAM_DATE = '2026-05-18 14:30';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function toDisplayScore(value: number): number {
  if (value <= 1) return Math.round(value * 100);
  return Math.round(value);
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}분 ${s}초`;
}

function formatSubmittedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[6px] border border-border bg-linear-bg-panel px-3 py-2 text-xs shadow-[var(--shadow-level-1)]">
      <p className="mb-0.5 text-linear-text-tertiary">{label}</p>
      <p className="font-semibold text-linear-accent-violet">{payload[0].value}점</p>
    </div>
  );
}

export default function ResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const examId = params.examId as string;
  const attemptIdParam = searchParams.get('attemptId');
  const attemptId = attemptIdParam && /^\d+$/.test(attemptIdParam) ? Number(attemptIdParam) : null;
  const useBackendResult = hasApiBaseUrl() && attemptId !== null;

  const [reviews, setReviews] = useState<QuestionReview[]>([]);
  const [attemptResult, setAttemptResult] = useState<GetExamAttemptResultResDto | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadResult() {
      setLoadError(null);

      try {
        const questionIds = await examService.getExamQuestionIds(examId);
        const reviewResponse = await questionService.getQuestionReviewsByIds(
          questionIds.length ? questionIds : DEFAULT_QUESTION_IDS,
        );
        if (!mounted) return;
        setReviews(reviewResponse);

        if (useBackendResult && attemptId !== null) {
          const result = await examAttemptService.getResult(attemptId);
          if (!mounted) return;
          setAttemptResult(result);
        }
      } catch {
        if (!mounted) return;
        setLoadError('시험 결과를 불러오지 못했습니다.');
      }
    }

    void loadResult();

    return () => {
      mounted = false;
    };
  }, [attemptId, examId, useBackendResult]);

  const resultItemsByQuestionId = useMemo(() => {
    if (!attemptResult) return new Map<number, GetExamAttemptResultResDto['items'][number]>();
    return new Map(attemptResult.items.map((item) => [item.questionItemId, item]));
  }, [attemptResult]);

  const results = useMemo(() => {
    return reviews.map((review, index) => {
      const item = resultItemsByQuestionId.get(review.questionId);
      const myAnswer = item?.selectedNumber ?? null;
      const isCorrect = item?.correct ?? (review.correctNumber !== null && myAnswer === review.correctNumber);
      return {
        review,
        displayNumber: index + 1,
        myAnswer,
        isCorrect,
        correctNumber: item?.correctNumber ?? review.correctNumber,
      };
    });
  }, [resultItemsByQuestionId, reviews]);

  const correctCount = attemptResult?.correctCount ?? results.filter((r) => r.isCorrect).length;
  const totalCount = attemptResult?.totalCount ?? results.length;
  const score = attemptResult ? toDisplayScore(attemptResult.score) : (totalCount ? Math.round((correctCount / totalCount) * 100) : 0);
  const accuracyPercent = attemptResult
    ? toDisplayScore(attemptResult.accuracy)
    : (totalCount ? Number(((correctCount / totalCount) * 100).toFixed(1)) : 0);
  const wrongResults = useMemo(() => results.filter((r) => !r.isCorrect), [results]);

  const subjectData = useMemo(() => {
    const subjectMap: Record<string, { correct: number; total: number }> = {};
    results.forEach(({ review, isCorrect }) => {
      const key = review.subject;
      if (!subjectMap[key]) {
        subjectMap[key] = { correct: 0, total: 0 };
      }
      subjectMap[key].total += 1;
      if (isCorrect) subjectMap[key].correct += 1;
    });
    return Object.entries(subjectMap).map(([subject, { correct, total }]) => ({
      subject: SUBJECT_LABEL[subject as keyof typeof SUBJECT_LABEL] ?? subject,
      score: Math.round((correct / total) * 100),
      correct,
      total,
    }));
  }, [results]);

  const formattedDuration = useMemo(
    () => formatDuration(attemptResult?.timeSpentSeconds ?? EXAM_DURATION_SECONDS),
    [attemptResult],
  );

  const formattedSubmittedAt = useMemo(
    () => (attemptResult?.submittedAt ? formatSubmittedAt(attemptResult.submittedAt) : EXAM_DATE),
    [attemptResult],
  );

  const scoreColor =
    score >= 80 ? 'text-linear-status-emerald' : score >= 60 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="min-h-screen bg-linear-bg-marketing px-4 py-8 text-linear-text-primary md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {loadError && (
          <div className="rounded-[10px] border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-500">
            {loadError}
          </div>
        )}

        <div className="rounded-[10px] border border-border bg-linear-bg-panel p-6 text-center shadow-[var(--shadow-level-2)]">
          <p className="mb-4 text-2xl">시험 결과</p>
          <div className={cn('mb-1 text-7xl font-bold tabular-nums tracking-tight', scoreColor)}>
            {score}
            <span className="text-4xl">점</span>
          </div>
          <p className="mb-6 text-sm text-linear-text-tertiary">
            {correctCount} / {totalCount}문항 정답 ({accuracyPercent}%)
          </p>

          <div className="mx-auto flex w-full max-w-xs justify-center gap-6 text-sm">
            <div className="flex items-center gap-1.5 text-linear-text-tertiary">
              <Clock className="h-4 w-4" />
              <span>{formattedDuration}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5 text-linear-text-tertiary">
              <Calendar className="h-4 w-4" />
              <span>{formattedSubmittedAt}</span>
            </div>
          </div>
        </div>

        <div className="rounded-[10px] border border-border bg-linear-bg-panel p-5 shadow-[var(--shadow-level-2)]">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-linear-accent-violet" />
            <h2 className="text-sm font-semibold text-linear-text-primary">과목별 점수</h2>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={subjectData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.22)" vertical={false} />
              <XAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(15,118,110,0.07)' }} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {subjectData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.score >= 80 ? '#10b981' : entry.score >= 60 ? '#0f766e' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-hidden rounded-[10px] border border-border bg-linear-bg-panel shadow-[var(--shadow-level-2)]">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
            <h2 className="text-sm font-semibold text-linear-text-primary">문항별 결과</h2>
            <span className="ml-auto text-xs text-linear-text-tertiary">총 {totalCount}문항</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-2.5 text-left text-xs font-medium text-linear-text-tertiary">번호</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-linear-text-tertiary">내 답</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-linear-text-tertiary">정답</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-linear-text-tertiary">결과</th>
                </tr>
              </thead>
              <tbody>
                {results.map(({ review, displayNumber, myAnswer, isCorrect, correctNumber }) => (
                  <tr
                    key={review.questionId}
                    className={cn(
                      'border-b border-border/70 transition-colors',
                      isCorrect
                        ? 'bg-linear-status-emerald/5 hover:bg-linear-status-emerald/10'
                        : 'bg-red-500/5 hover:bg-red-500/10'
                    )}
                  >
                    <td className="px-5 py-2.5 font-medium text-linear-text-secondary">{displayNumber}</td>
                    <td className="px-3 py-2.5">
                      <span className={cn('font-medium', isCorrect ? 'text-linear-status-emerald' : 'text-red-500')}>
                        {myAnswer ?? '-'}번
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-medium text-linear-status-emerald">{correctNumber ?? '-'}번</td>
                    <td className="px-3 py-2.5">
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-linear-status-emerald">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-xs">정답</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-500">
                          <XCircle className="h-4 w-4" />
                          <span className="text-xs">오답</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {wrongResults.length > 0 && (
          <div className="overflow-hidden rounded-[10px] border border-border bg-linear-bg-panel shadow-[var(--shadow-level-2)]">
            <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
              <XCircle className="h-4 w-4 text-red-500" />
              <h2 className="text-sm font-semibold text-linear-text-primary">
                오답 풀이 <span className="font-normal text-linear-text-tertiary">({wrongResults.length}문제)</span>
              </h2>
            </div>
            <Accordion className="divide-y divide-border/70">
              {wrongResults.map(({ review, displayNumber, myAnswer }) => (
                <AccordionItem key={review.questionId} value={String(review.questionId)}>
                  <div className="px-5">
                    <AccordionTrigger className="py-3 text-sm text-linear-text-secondary hover:no-underline hover:text-linear-text-primary">
                      <div className="flex items-center gap-2 text-left">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-[10px] font-semibold text-red-500">
                          {displayNumber}
                        </span>
                        <span className="line-clamp-1">{review.stem}</span>
                      </div>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent className="px-5 pb-4">
                    <div className="space-y-2">
                      {review.choices.map((choice) => {
                        const isWrong = myAnswer === choice.number && !choice.isCorrect;
                        return (
                          <AnswerOption
                            key={choice.number}
                            number={choice.number as 1 | 2 | 3 | 4 | 5}
                            text={choice.text}
                            isSelected={myAnswer === choice.number}
                            isCorrect={choice.isCorrect}
                            isWrong={isWrong}
                            resultMode
                          />
                        );
                      })}
                    </div>
                    <div className="mt-3 rounded-[6px] border border-linear-brand-indigo/25 bg-linear-brand-indigo/8 px-4 py-3">
                      <p className="mb-1 text-xs font-medium text-linear-accent-violet">해설</p>
                      <p className="text-sm leading-relaxed text-linear-text-secondary">{review.correctReason}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        <div className="rounded-[10px] border border-linear-brand-indigo/20 bg-linear-brand-indigo/8 p-5 shadow-[var(--shadow-level-1)]">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-brand-indigo/18">
              <Bot className="h-4 w-4 text-linear-accent-violet" />
            </div>
            <div>
              <p className="text-sm font-semibold text-linear-text-primary">AI 분석</p>
              <p className="text-xs text-linear-text-tertiary">DTO 기반 문항 데이터로 결과가 구성되었습니다.</p>
            </div>
          </div>
          <p className="text-sm leading-7 text-linear-text-secondary">
            오답 문항의 <span className="font-medium text-red-500">정답 근거(correctReason)</span>와
            <span className="font-medium text-linear-accent-violet"> 오답 해설(incorrectReasons)</span>은 백엔드 DTO 계약에 맞춰 수신/표시됩니다.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/recommend"
            className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-linear-brand-indigo py-3 text-sm font-semibold text-white transition-colors hover:bg-linear-brand-indigo/90"
          >
            <Zap className="h-4 w-4" />
            취약파트 집중 학습 시작
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/exam"
            className="flex flex-1 items-center justify-center gap-2 rounded-[8px] border border-border bg-linear-bg-surface py-3 text-sm font-medium text-linear-text-secondary transition-all hover:bg-black/3 dark:hover:bg-white/6"
          >
            <RotateCcw className="h-4 w-4" />
            다시 풀기
          </Link>
          <Link
            href="/dashboard"
            className="flex flex-1 items-center justify-center gap-2 rounded-[8px] border border-border bg-linear-bg-surface py-3 text-sm font-medium text-linear-text-secondary transition-all hover:bg-black/3 dark:hover:bg-white/6"
          >
            <LayoutDashboard className="h-4 w-4" />
            대시보드로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
