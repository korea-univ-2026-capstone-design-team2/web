'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  BarChart2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Play,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { hasApiBaseUrl } from '@/lib/api/client';
import { examService } from '@/lib/services/examService';
import type { ExamStatus, ExamSummaryResDto } from '@/types/question-dto';
import { DIFFICULTY_LABEL, QUESTION_TYPE_LABEL, SUBJECT_LABEL } from '@/types/question-dto';

const PAGE_SIZE = 20;

const STATUS_LABEL: Record<ExamStatus, string> = {
  GENERATING: '생성 중',
  READY: '응시 가능',
  FAILED: '생성 실패',
};

const STATUS_STYLE: Record<ExamStatus, string> = {
  GENERATING: 'border-amber-500/25 bg-amber-500/10 text-amber-600',
  READY: 'border-linear-status-emerald/25 bg-linear-status-emerald/10 text-linear-status-emerald',
  FAILED: 'border-red-500/25 bg-red-500/10 text-red-500',
};

function formatDate(value: string): string {
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

function StatusIcon({ status }: { status: ExamStatus }) {
  if (status === 'READY') return <CheckCircle2 className="h-4 w-4" />;
  if (status === 'FAILED') return <XCircle className="h-4 w-4" />;
  return <Loader2 className="h-4 w-4 animate-spin" />;
}

export default function ExamPage() {
  const router = useRouter();
  const [exams, setExams] = useState<ExamSummaryResDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiConfigured = hasApiBaseUrl();

  async function loadExams() {
    setIsLoading(true);
    setError(null);

    if (!apiConfigured) {
      setExams([]);
      setTotalCount(0);
      setError('NEXT_PUBLIC_API_BASE_URL이 설정되어 있지 않습니다.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await examService.getBackendExamList({ page: 0, size: PAGE_SIZE });
      setExams(response.items);
      setTotalCount(response.totalCount);
    } catch {
      setExams([]);
      setTotalCount(0);
      setError('모의고사 목록을 불러오지 못했습니다. 백엔드 서버 상태를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const readyCount = useMemo(() => exams.filter((exam) => exam.status === 'READY').length, [exams]);
  const generatingCount = useMemo(() => exams.filter((exam) => exam.status === 'GENERATING').length, [exams]);

  function handleStart(exam: ExamSummaryResDto) {
    if (exam.status !== 'READY') return;
    router.push(`/exam/${exam.examId}/session`);
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 text-linear-text-primary md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="overflow-hidden rounded-[18px] border border-border bg-white shadow-[var(--shadow-level-2)]">
          <div className="grid gap-6 p-6 md:grid-cols-[1fr_320px] md:p-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-linear-brand-indigo/20 bg-linear-brand-indigo/8 px-3 py-1 text-xs font-medium text-linear-accent-violet">
                <BarChart2 className="h-3.5 w-3.5" />
                5급 PSAT CBT
              </div>
              <div className="space-y-2">
                <h1 className="linear-text-h2 tracking-tight text-linear-text-primary">PSAT 모의고사 목록</h1>
                <p className="max-w-2xl text-sm leading-6 text-linear-text-tertiary">
                  시험을 선택하면 CBT 화면으로 이동합니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 md:grid-cols-1">
              <div className="rounded-[12px] border border-border bg-white px-4 py-3">
                <p className="text-xs text-linear-text-tertiary">전체</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-linear-text-primary">{totalCount}</p>
              </div>
              <div className="rounded-[12px] border border-linear-status-emerald/20 bg-linear-status-emerald/8 px-4 py-3">
                <p className="text-xs text-linear-text-tertiary">응시 가능</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-linear-status-emerald">{readyCount}</p>
              </div>
              <div className="rounded-[12px] border border-amber-500/20 bg-amber-500/8 px-4 py-3">
                <p className="text-xs text-linear-text-tertiary">생성 중</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-amber-600">{generatingCount}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-[14px] border border-border bg-white shadow-[var(--shadow-level-2)]">
          <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-linear-text-primary">생성된 모의고사</h2>
              <p className="mt-0.5 text-xs text-linear-text-tertiary">`GET /exams` 응답 기준</p>
            </div>
            <button
              type="button"
              onClick={() => void loadExams()}
              disabled={isLoading}
              className="ml-auto inline-flex items-center gap-2 rounded-[8px] border border-border bg-white px-3 py-2 text-sm font-medium text-linear-text-secondary transition-colors hover:bg-black/3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
              새로고침
            </button>
          </div>

          {error && (
            <div className="m-5 rounded-[10px] border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-500">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-linear-text-tertiary">
              <Loader2 className="h-8 w-8 animate-spin text-linear-accent-violet" />
              <p className="text-sm">모의고사 목록을 불러오는 중입니다.</p>
            </div>
          ) : exams.length === 0 && !error ? (
            <div className="flex min-h-72 flex-col items-center justify-center gap-3 px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white">
                <FileText className="h-6 w-6 text-linear-text-tertiary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-linear-text-primary">생성된 모의고사가 없습니다.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border/70">
              {exams.map((exam) => {
                const canStart = exam.status === 'READY';
                return (
                  <article key={exam.examId} className="grid gap-4 px-5 py-5 transition-colors hover:bg-black/2 md:grid-cols-[1fr_auto]">
                    <div className="min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold', STATUS_STYLE[exam.status])}>
                          <StatusIcon status={exam.status} />
                          {STATUS_LABEL[exam.status]}
                        </span>
                        <span className="text-xs text-linear-text-tertiary">#{exam.examId}</span>
                      </div>

                      <div>
                        <h3 className="truncate text-base font-semibold text-linear-text-primary">{exam.title}</h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-linear-text-tertiary">
                          <span className="rounded-full border border-border bg-white px-2.5 py-1">{SUBJECT_LABEL[exam.subject]}</span>
                          <span className="rounded-full border border-border bg-white px-2.5 py-1">{QUESTION_TYPE_LABEL[exam.questionType]}</span>
                          <span className="rounded-full border border-border bg-white px-2.5 py-1">{DIFFICULTY_LABEL[exam.difficulty]}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-linear-text-tertiary">
                        <span className="inline-flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          문항 {exam.actualQuestionCount}/{exam.targetQuestionCount}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          예상 {Math.round(exam.targetQuestionCount * 1.5)}분
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(exam.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center md:justify-end">
                      <button
                        type="button"
                        onClick={() => handleStart(exam)}
                        disabled={!canStart}
                        className={cn(
                          'inline-flex w-full items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-semibold transition-colors md:w-auto',
                          canStart
                            ? 'bg-linear-brand-indigo text-white hover:bg-linear-brand-indigo/90'
                            : 'cursor-not-allowed border border-border bg-white text-linear-text-tertiary'
                        )}
                      >
                        <Play className="h-4 w-4" />
                        {canStart ? '응시하기' : STATUS_LABEL[exam.status]}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
