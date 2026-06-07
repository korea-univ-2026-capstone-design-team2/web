'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  BarChart2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Plus,
  Play,
  RefreshCw,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { hasApiBaseUrl } from '@/lib/api/client';
import { examService } from '@/lib/services/examService';
import type { DifficultyLevel, ExamStatus, ExamSummaryResDto, GenerateExamReqDto, QuestionType, Subject, TopicCategory } from '@/types/question-dto';
import { DIFFICULTY_LABEL, QUESTION_TYPE_LABEL, SUBJECT_LABEL } from '@/types/question-dto';
import { PageHero, SurfacePanel } from '@/components/common/PageHero';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const PAGE_SIZE = 20;

const SUBJECT_OPTIONS: { value: Subject; label: string }[] = [
  { value: 'VERBAL_LOGIC', label: '언어논리' },
  { value: 'DATA_INTERPRETATION', label: '자료해석' },
  { value: 'SITUATIONAL_JUDGMENT', label: '상황판단' },
];

const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: 'READING', label: '독해' },
  { value: 'LOGIC_PUZZLE', label: '논리퀴즈' },
  { value: 'ARGUMENTATION', label: '논증' },
];

const DIFFICULTY_OPTIONS: { value: DifficultyLevel; label: string }[] = [
  { value: 'EASY', label: '쉬움' },
  { value: 'MEDIUM', label: '보통' },
  { value: 'HARD', label: '어려움' },
];

const TOPIC_CATEGORY_OPTIONS: { value: TopicCategory; label: string }[] = [
  { value: 'POLITICS', label: '정치' },
  { value: 'ECONOMY', label: '경제' },
  { value: 'SOCIETY', label: '사회' },
  { value: 'LAW', label: '법' },
  { value: 'HISTORY', label: '역사' },
  { value: 'PHILOSOPHY', label: '철학' },
  { value: 'SCIENCE', label: '과학' },
  { value: 'TECHNOLOGY', label: '기술' },
  { value: 'CULTURE', label: '문화' },
  { value: 'ENVIRONMENT', label: '환경' },
];

const fieldClassName =
  'h-10 w-full rounded-[8px] border border-border bg-white px-3 text-sm text-linear-text-primary outline-none transition-colors focus:border-linear-brand-indigo focus:ring-2 focus:ring-linear-brand-indigo/15';

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<GenerateExamReqDto>({
    title: 'PSAT 실전 모의고사',
    subject: 'VERBAL_LOGIC',
    questionType: 'READING',
    questionSubType: null,
    difficulty: 'MEDIUM',
    topicCategory: 'LAW',
    topicKeyword: '',
    topicDescription: '',
    targetQuestionCount: 5,
  });

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

  async function handleCreateExam(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCreating(true);
    setCreateError(null);

    try {
      await examService.generateBackendExam({
        ...createForm,
        topicKeyword: createForm.topicKeyword?.trim() || null,
        topicDescription: createForm.topicDescription?.trim() || null,
      });
      setIsCreateOpen(false);
      await loadExams();
    } catch {
      setCreateError('모의고사 생성에 실패했습니다.');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 text-linear-text-primary md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHero
          eyebrow="5급 PSAT CBT"
          title="PSAT 모의고사 목록"
          description="시험을 선택하면 CBT 화면으로 이동합니다."
          icon={BarChart2}
          stats={[
            { label: '전체', value: totalCount, tone: 'default' },
            { label: '응시 가능', value: readyCount, tone: 'success' },
            { label: '생성 중', value: generatingCount, tone: 'warning' },
          ]}
        />

        <SurfacePanel className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-linear-text-primary">생성된 모의고사</h2>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/exam/generate"
                className="inline-flex items-center gap-2 rounded-[8px] border border-border bg-white px-3 py-2 text-sm font-medium text-linear-text-secondary transition-colors hover:bg-black/3"
              >
                <Sparkles className="h-4 w-4" />
                문제 생성
              </Link>
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                disabled={!apiConfigured}
                className="inline-flex items-center gap-2 rounded-[8px] bg-linear-brand-indigo px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-linear-brand-indigo/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                모의고사 생성
              </button>
              <button
                type="button"
                onClick={() => void loadExams()}
                disabled={isLoading}
                aria-label="모의고사 목록 새로고침"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-border bg-white text-linear-text-secondary transition-colors hover:bg-black/3 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
              </button>
            </div>
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
        </SurfacePanel>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="border border-border bg-white text-linear-text-primary sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-linear-text-primary">모의고사 생성</DialogTitle>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={handleCreateExam}>
            <label className="grid gap-1.5 text-xs font-medium text-linear-text-secondary">
              제목
              <Input
                value={createForm.title}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, title: event.target.value }))}
                required
                className="border-border bg-white text-linear-text-primary"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-medium text-linear-text-secondary">
                과목
                <select
                  value={createForm.subject}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, subject: event.target.value as Subject }))}
                  className={fieldClassName}
                >
                  {SUBJECT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1.5 text-xs font-medium text-linear-text-secondary">
                유형
                <select
                  value={createForm.questionType}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, questionType: event.target.value as QuestionType }))}
                  className={fieldClassName}
                >
                  {QUESTION_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1.5 text-xs font-medium text-linear-text-secondary">
                난이도
                <select
                  value={createForm.difficulty}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, difficulty: event.target.value as DifficultyLevel }))}
                  className={fieldClassName}
                >
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1.5 text-xs font-medium text-linear-text-secondary">
                주제
                <select
                  value={createForm.topicCategory}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, topicCategory: event.target.value as TopicCategory }))}
                  className={fieldClassName}
                >
                  {TOPIC_CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="grid gap-1.5 text-xs font-medium text-linear-text-secondary">
              문항 수
              <Input
                type="number"
                min={1}
                max={20}
                value={createForm.targetQuestionCount}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, targetQuestionCount: Number(event.target.value) }))}
                className="border-border bg-white text-linear-text-primary"
              />
            </label>

            <label className="grid gap-1.5 text-xs font-medium text-linear-text-secondary">
              키워드
              <Input
                value={createForm.topicKeyword ?? ''}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, topicKeyword: event.target.value }))}
                className="border-border bg-white text-linear-text-primary"
              />
            </label>

            {createError && (
              <div className="rounded-[8px] border border-red-500/20 bg-red-500/8 px-3 py-2 text-sm text-red-500">
                {createError}
              </div>
            )}

            <DialogFooter className="border-border bg-white">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-[8px] border border-border bg-white px-4 py-2 text-sm text-linear-text-secondary transition-colors hover:bg-black/3"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="rounded-[8px] bg-linear-brand-indigo px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-linear-brand-indigo/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreating ? '생성 중' : '생성'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
