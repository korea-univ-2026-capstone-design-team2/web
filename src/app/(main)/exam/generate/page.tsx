'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Play, Radio, XCircle } from 'lucide-react';
import { hasApiBaseUrl } from '@/lib/api/client';
import { questionGenerationService } from '@/lib/services/questionGenerationService';
import type { DifficultyLevel, GenerateQuestionReqDto, GenerateQuestionResDto, QuestionSubType, QuestionType, Subject } from '@/types/question-dto';
import { Input } from '@/components/ui/input';

const fieldClassName =
  'h-10 w-full rounded-[8px] border border-border bg-white px-3 text-sm text-linear-text-primary outline-none transition-colors focus:border-linear-brand-indigo focus:ring-2 focus:ring-linear-brand-indigo/15';

const subjects: { value: Subject; label: string }[] = [
  { value: 'VERBAL_LOGIC', label: '언어논리' },
  { value: 'DATA_INTERPRETATION', label: '자료해석' },
  { value: 'SITUATIONAL_JUDGMENT', label: '상황판단' },
];

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: 'READING', label: '독해' },
  { value: 'LOGIC_PUZZLE', label: '논리퀴즈' },
  { value: 'ARGUMENTATION', label: '논증' },
];

const subTypes: { value: QuestionSubType; label: string }[] = [
  { value: 'MATCH', label: '일치' },
  { value: 'KNOWABLE', label: '판단 가능' },
  { value: 'CONTEXT_CORRECTION', label: '문맥 수정' },
  { value: 'BLANK_FILLING', label: '빈칸' },
  { value: 'CORE_ARGUMENT', label: '핵심 논지' },
  { value: 'INFERENCE', label: '추론' },
  { value: 'ARGUMENT_ANALYSIS', label: '논증 분석' },
  { value: 'STRENGTHEN_WEAKEN', label: '강화/약화' },
];

const difficulties: { value: DifficultyLevel; label: string }[] = [
  { value: 'EASY', label: '쉬움' },
  { value: 'MEDIUM', label: '보통' },
  { value: 'HARD', label: '어려움' },
];

interface GenerationEventLog {
  id: string;
  label: string;
  detail: string;
}

function eventDetail(value: string): string {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (parsed && typeof parsed === 'object') {
      const record = parsed as Record<string, unknown>;
      return String(record.message ?? record.status ?? record.event ?? value);
    }
  } catch {
    return value;
  }
  return value;
}

export default function QuestionGeneratePage() {
  const eventSourceRef = useRef<EventSource | null>(null);
  const [form, setForm] = useState<GenerateQuestionReqDto>({
    subject: 'VERBAL_LOGIC',
    questionType: 'READING',
    questionSubType: null,
    difficulty: 'MEDIUM',
    topicCategory: null,
    topicKeyword: '',
    topicDescription: '',
    quantity: 1,
  });
  const [result, setResult] = useState<GenerateQuestionResDto | null>(null);
  const [events, setEvents] = useState<GenerationEventLog[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamStatus, setStreamStatus] = useState<'idle' | 'connecting' | 'open' | 'closed' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const apiConfigured = hasApiBaseUrl();
  const canSubmit = apiConfigured && !isGenerating;

  const statusLabel = useMemo(() => {
    if (streamStatus === 'open') return 'SSE 연결됨';
    if (streamStatus === 'connecting') return 'SSE 연결 중';
    if (streamStatus === 'error') return 'SSE 오류';
    if (streamStatus === 'closed') return 'SSE 종료';
    return '대기';
  }, [streamStatus]);

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  function appendEvent(label: string, detail: string) {
    setEvents((prev) => [
      { id: `${Date.now()}-${prev.length}`, label, detail },
      ...prev,
    ].slice(0, 20));
  }

  function connectEvents(generationId: string) {
    eventSourceRef.current?.close();

    const url = questionGenerationService.getGenerationEventsUrl(generationId);
    if (!url) {
      setStreamStatus('error');
      appendEvent('SSE', 'NEXT_PUBLIC_API_BASE_URL 없음');
      return;
    }

    setStreamStatus('connecting');
    const source = new EventSource(url);
    eventSourceRef.current = source;

    source.onopen = () => {
      setStreamStatus('open');
      appendEvent('SSE', '연결됨');
    };

    source.onmessage = (event) => {
      appendEvent('message', eventDetail(event.data));
    };

    source.onerror = () => {
      setStreamStatus('error');
      appendEvent('SSE', '연결 오류');
      source.close();
      eventSourceRef.current = null;
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsGenerating(true);
    setError(null);
    setEvents([]);
    setResult(null);

    try {
      const response = await questionGenerationService.generateQuestion({
        ...form,
        questionSubType: form.questionSubType || null,
        topicCategory: form.topicCategory?.trim() || null,
        topicKeyword: form.topicKeyword?.trim() || null,
        topicDescription: form.topicDescription?.trim() || null,
        quantity: Number(form.quantity ?? 1),
      });
      setResult(response);
      appendEvent('generation', `generationId ${response.generationId}`);
      connectEvents(response.generationId);
    } catch {
      setError('문제 생성 요청에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 text-linear-text-primary md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center gap-3 rounded-[18px] border border-border bg-white px-5 py-4 shadow-[var(--shadow-level-1)]">
          <Link
            href="/exam"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-border text-linear-text-secondary transition-colors hover:bg-black/3"
            aria-label="모의고사 목록으로 이동"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold tracking-[-0.03em] text-linear-text-primary">문제 생성</h1>
          </div>
          <div className="ml-auto inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs text-linear-text-tertiary">
            <Radio className="h-3.5 w-3.5 text-linear-accent-violet" />
            {statusLabel}
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <form className="rounded-[14px] border border-border bg-white p-5" onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-xs font-medium text-linear-text-secondary">
                  과목
                  <select
                    value={form.subject}
                    onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value as Subject }))}
                    className={fieldClassName}
                  >
                    {subjects.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1.5 text-xs font-medium text-linear-text-secondary">
                  유형
                  <select
                    value={form.questionType ?? ''}
                    onChange={(event) => setForm((prev) => ({ ...prev, questionType: event.target.value as QuestionType }))}
                    className={fieldClassName}
                  >
                    {questionTypes.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1.5 text-xs font-medium text-linear-text-secondary">
                  세부 유형
                  <select
                    value={form.questionSubType ?? ''}
                    onChange={(event) => setForm((prev) => ({ ...prev, questionSubType: event.target.value ? event.target.value as QuestionSubType : null }))}
                    className={fieldClassName}
                  >
                    <option value="">랜덤</option>
                    {subTypes.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1.5 text-xs font-medium text-linear-text-secondary">
                  난이도
                  <select
                    value={form.difficulty ?? ''}
                    onChange={(event) => setForm((prev) => ({ ...prev, difficulty: event.target.value as DifficultyLevel }))}
                    className={fieldClassName}
                  >
                    {difficulties.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-xs font-medium text-linear-text-secondary">
                  문항 수
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={form.quantity}
                    onChange={(event) => setForm((prev) => ({ ...prev, quantity: Number(event.target.value) }))}
                    className="border-border bg-white text-linear-text-primary"
                  />
                </label>

                <label className="grid gap-1.5 text-xs font-medium text-linear-text-secondary">
                  카테고리
                  <Input
                    value={form.topicCategory ?? ''}
                    onChange={(event) => setForm((prev) => ({ ...prev, topicCategory: event.target.value }))}
                    className="border-border bg-white text-linear-text-primary"
                  />
                </label>
              </div>

              <label className="grid gap-1.5 text-xs font-medium text-linear-text-secondary">
                키워드
                <Input
                  value={form.topicKeyword ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, topicKeyword: event.target.value }))}
                  className="border-border bg-white text-linear-text-primary"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-medium text-linear-text-secondary">
                설명
                <Input
                  value={form.topicDescription ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, topicDescription: event.target.value }))}
                  className="border-border bg-white text-linear-text-primary"
                />
              </label>

              {!apiConfigured && (
                <div className="rounded-[8px] border border-amber-500/20 bg-amber-500/8 px-3 py-2 text-sm text-amber-600">
                  NEXT_PUBLIC_API_BASE_URL 없음
                </div>
              )}

              {error && (
                <div className="rounded-[8px] border border-red-500/20 bg-red-500/8 px-3 py-2 text-sm text-red-500">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-linear-brand-indigo px-4 text-sm font-semibold text-white transition-colors hover:bg-linear-brand-indigo/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {isGenerating ? '요청 중' : '생성 시작'}
              </button>
            </div>
          </form>

          <aside className="rounded-[14px] border border-border bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-linear-text-primary">진행 이벤트</h2>
              {streamStatus === 'open' && (
                <button
                  type="button"
                  onClick={() => {
                    eventSourceRef.current?.close();
                    eventSourceRef.current = null;
                    setStreamStatus('closed');
                    appendEvent('SSE', '수동 종료');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-[6px] border border-border px-2 py-1 text-xs text-linear-text-tertiary transition-colors hover:bg-black/3"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  종료
                </button>
              )}
            </div>

            {result && (
              <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-[8px] border border-border px-3 py-2">
                  <div className="text-linear-text-tertiary">generationId</div>
                  <div className="mt-1 font-semibold text-linear-text-primary">{result.generationId}</div>
                </div>
                <div className="rounded-[8px] border border-border px-3 py-2">
                  <div className="text-linear-text-tertiary">status</div>
                  <div className="mt-1 font-semibold text-linear-text-primary">{result.status}</div>
                </div>
                <div className="rounded-[8px] border border-linear-status-emerald/20 bg-linear-status-emerald/8 px-3 py-2">
                  <div className="text-linear-text-tertiary">success</div>
                  <div className="mt-1 font-semibold text-linear-status-emerald">{result.successCount}</div>
                </div>
                <div className="rounded-[8px] border border-red-500/20 bg-red-500/8 px-3 py-2">
                  <div className="text-linear-text-tertiary">fail</div>
                  <div className="mt-1 font-semibold text-red-500">{result.failCount}</div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {events.length === 0 ? (
                <div className="rounded-[8px] border border-dashed border-border px-3 py-8 text-center text-sm text-linear-text-tertiary">
                  이벤트 없음
                </div>
              ) : (
                events.map((item) => (
                  <div key={item.id} className="rounded-[8px] border border-border px-3 py-2">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-linear-accent-violet">{item.label}</div>
                    <div className="mt-1 break-words text-xs leading-5 text-linear-text-secondary">{item.detail}</div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
