'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
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
import { questionService } from '@/lib/services/questionService';
import type { QuestionReview } from '@/types/question-dto';
import { SUBJECT_LABEL } from '@/types/question-dto';

const DEFAULT_QUESTION_IDS = Array.from({ length: 20 }, (_, i) => i + 1);
const EXAM_DURATION_SECONDS = 42 * 60 + 18;
const EXAM_DATE = '2026-05-18 14:30';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
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
  const [reviews, setReviews] = useState<QuestionReview[]>([]);

  useEffect(() => {
    let mounted = true;
    void questionService.getQuestionReviewsByIds(DEFAULT_QUESTION_IDS).then((response) => {
      if (!mounted) return;
      setReviews([...response].sort((a, b) => a.questionId - b.questionId));
    });
    return () => {
      mounted = false;
    };
  }, []);

  const userAnswers = useMemo(() => {
    const result: Record<number, number> = {};
    for (const review of reviews) {
      if (review.correctNumber === null) continue;
      result[review.questionId] = review.questionId % 4 === 0
        ? ((review.correctNumber % 5) + 1)
        : review.correctNumber;
    }
    return result;
  }, [reviews]);

  const results = useMemo(() => {
    return reviews.map((review) => {
      const myAnswer = userAnswers[review.questionId];
      const isCorrect = review.correctNumber !== null && myAnswer === review.correctNumber;
      return { review, myAnswer, isCorrect };
    });
  }, [reviews, userAnswers]);

  const correctCount = useMemo(() => results.filter((r) => r.isCorrect).length, [results]);
  const totalCount = results.length;
  const score = totalCount ? Math.round((correctCount / totalCount) * 100) : 0;
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

  const formattedDuration = useMemo(() => {
    const m = Math.floor(EXAM_DURATION_SECONDS / 60);
    const s = EXAM_DURATION_SECONDS % 60;
    return `${m}분 ${s}초`;
  }, []);

  const scoreColor =
    score >= 80 ? 'text-linear-status-emerald' : score >= 60 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="min-h-screen bg-linear-bg-marketing px-4 py-8 text-linear-text-primary md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[10px] border border-border bg-linear-bg-panel p-6 text-center shadow-[var(--shadow-level-2)]">
          <p className="mb-4 text-2xl">시험 결과</p>
          <div className={cn('mb-1 text-7xl font-bold tabular-nums tracking-tight', scoreColor)}>
            {score}
            <span className="text-4xl">점</span>
          </div>
          <p className="mb-6 text-sm text-linear-text-tertiary">
            {correctCount} / {totalCount}문항 정답 ({totalCount ? ((correctCount / totalCount) * 100).toFixed(1) : 0}%)
          </p>

          <div className="mx-auto flex w-full max-w-xs justify-center gap-6 text-sm">
            <div className="flex items-center gap-1.5 text-linear-text-tertiary">
              <Clock className="h-4 w-4" />
              <span>{formattedDuration}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5 text-linear-text-tertiary">
              <Calendar className="h-4 w-4" />
              <span>{EXAM_DATE}</span>
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
                {results.map(({ review, myAnswer, isCorrect }) => (
                  <tr
                    key={review.questionId}
                    className={cn(
                      'border-b border-border/70 transition-colors',
                      isCorrect
                        ? 'bg-linear-status-emerald/5 hover:bg-linear-status-emerald/10'
                        : 'bg-red-500/5 hover:bg-red-500/10'
                    )}
                  >
                    <td className="px-5 py-2.5 font-medium text-linear-text-secondary">{review.questionId}</td>
                    <td className="px-3 py-2.5">
                      <span className={cn('font-medium', isCorrect ? 'text-linear-status-emerald' : 'text-red-500')}>
                        {myAnswer ?? '-'}번
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-medium text-linear-status-emerald">{review.correctNumber ?? '-'}번</td>
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
              {wrongResults.map(({ review, myAnswer }) => (
                <AccordionItem key={review.questionId} value={String(review.questionId)}>
                  <div className="px-5">
                    <AccordionTrigger className="py-3 text-sm text-linear-text-secondary hover:no-underline hover:text-linear-text-primary">
                      <div className="flex items-center gap-2 text-left">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-[10px] font-semibold text-red-500">
                          {review.questionId}
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
