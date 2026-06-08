'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Flame,
  TrendingUp,
  ChevronRight,
  Clock,
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  Loader2,
} from 'lucide-react';
import RadarChart from '@/components/analytics/RadarChart';
import LineChart from '@/components/analytics/LineChart';
import { PageHero, SurfacePanel } from '@/components/common/PageHero';
import {
  calculateStreakDays,
  dailyRecordsToTrendLine,
  formatStudyDuration,
  getTodayRecord,
  toAccuracyPercent,
} from '@/lib/analytics/helpers';
import { analyticsService } from '@/lib/services/analyticsService';

const radarData = [
  { subject: '국어', score: 79 },
  { subject: '영어', score: 68 },
  { subject: '한국사', score: 85 },
  { subject: '행정학', score: 75 },
  { subject: '행정법', score: 71 },
  { subject: '사회', score: 62 },
];

const recentResults = [
  { id: 1, name: '2025년 국가직 9급 모의고사', date: '2026.04.01', score: 82, duration: '47분', passed: true },
  { id: 2, name: '행정법 집중훈련 Vol.3', date: '2026.03.30', score: 71, duration: '38분', passed: false },
  { id: 3, name: '2024년 지방직 9급 기출', date: '2026.03.28', score: 78, duration: '52분', passed: true },
  { id: 4, name: '국어 어휘·문법 특강', date: '2026.03.27', score: 85, duration: '29분', passed: true },
  { id: 5, name: '영어 독해 심화 훈련', date: '2026.03.25', score: 65, duration: '44분', passed: false },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof analyticsService.getAnalyticsData>>['summary'] | null>(null);
  const [dailyRecords, setDailyRecords] = useState<Awaited<ReturnType<typeof analyticsService.getAnalyticsData>>['dailyRecords']>([]);

  useEffect(() => {
    let mounted = true;

    void analyticsService.getAnalyticsData()
      .then((data) => {
        if (!mounted) return;
        setSummary(data.summary);
        setDailyRecords(data.dailyRecords);
      })
      .catch(() => {
        if (!mounted) return;
        setLoadError('학습 통계를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const todayRecord = useMemo(() => getTodayRecord(dailyRecords), [dailyRecords]);
  const streakDays = useMemo(() => calculateStreakDays(dailyRecords), [dailyRecords]);
  const trendData = useMemo(() => dailyRecordsToTrendLine(dailyRecords), [dailyRecords]);

  const todayQuestions = todayRecord?.questionCount ?? 0;
  const todayAccuracy = todayRecord ? toAccuracyPercent(todayRecord.accuracy) : 0;
  const overallAccuracy = summary ? toAccuracyPercent(summary.accuracy) : 0;
  const totalStudyLabel = summary ? formatStudyDuration(summary.totalStudySeconds) : '-';

  const statCards = useMemo(
    () => [
      {
        label: '오늘 풀이',
        value: `${todayQuestions}문제`,
        icon: BookOpen,
        iconColor: 'text-linear-accent-violet',
        iconBg: 'bg-linear-brand-indigo/10',
      },
      {
        label: '오늘 정답률',
        value: `${todayAccuracy}%`,
        icon: CheckCircle2,
        iconColor: 'text-linear-status-emerald',
        iconBg: 'bg-linear-status-emerald/10',
      },
      {
        label: '연속 학습일',
        value: `${streakDays}일`,
        icon: Flame,
        iconColor: 'text-red-500',
        iconBg: 'bg-red-500/10',
      },
      {
        label: '전체 정답률',
        value: `${overallAccuracy}%`,
        icon: TrendingUp,
        iconColor: 'text-linear-brand-indigo',
        iconBg: 'bg-linear-brand-indigo/10',
      },
    ],
    [overallAccuracy, streakDays, todayAccuracy, todayQuestions],
  );

  return (
    <div className="min-h-screen bg-white px-4 py-8 text-linear-text-primary md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHero
          eyebrow="Dashboard"
          title="오늘의 학습 현황"
          description="오늘 집중할 영역과 최근 흐름을 먼저 확인하세요."
          icon={LayoutDashboard}
          stats={[
            { label: '오늘 풀이', value: isLoading ? '-' : todayQuestions, tone: 'brand' },
            { label: '정답률', value: isLoading ? '-' : `${todayAccuracy}%`, tone: 'success' },
            { label: '연속', value: isLoading ? '-' : `${streakDays}일`, tone: 'warning' },
            { label: '학습 시간', value: isLoading ? '-' : totalStudyLabel, tone: 'default' },
          ]}
        />

        {loadError && (
          <div className="rounded-[10px] border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-500">
            {loadError}
          </div>
        )}

        <SurfacePanel className="overflow-hidden border-linear-brand-indigo/20 bg-[linear-gradient(135deg,rgba(15,118,110,0.08),#ffffff_46%)] p-5">
          <div className="flex gap-4">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-linear-brand-indigo text-white">
              <Sparkles className="h-4 w-4" strokeWidth={1.7} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-linear-accent-violet">AI 추천</p>
              <p className="text-sm leading-6 text-linear-text-secondary">
                오늘은 행정법 3단원{' '}
                <span className="font-medium text-linear-text-primary">&#39;행정행위의 효력&#39;</span>을 집중 공략하세요.
                지난 3회 연속 해당 단원에서 오답이 발생했습니다.
              </p>
            </div>
          </div>
        </SurfacePanel>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <SurfacePanel key={card.label} className="p-5">
                <div className="flex items-center justify-between">
                  <div className={`${card.iconBg} rounded-[8px] p-2.5`}>
                    <Icon className={`h-4 w-4 ${card.iconColor}`} strokeWidth={1.7} />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-semibold tracking-[-0.04em] text-linear-text-primary">
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-linear-text-tertiary" /> : card.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-linear-text-tertiary">{card.label}</p>
                </div>
              </SurfacePanel>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RadarChart data={radarData} title="과목별 정답률" />
          {isLoading ? (
            <SurfacePanel className="flex min-h-[360px] items-center justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin text-linear-accent-violet" />
            </SurfacePanel>
          ) : (
            <LineChart
              data={trendData}
              lines={[{ key: 'score', color: '#0f766e', name: '정답률' }]}
              title="최근 30일 정답률 추이"
            />
          )}
        </div>

        <SurfacePanel className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold text-linear-text-primary">최근 응시 결과</h3>
              <p className="mt-0.5 text-xs text-linear-text-tertiary">최근 풀이 이력과 점수 흐름</p>
            </div>
            <Link
              href="/mypage"
              className="flex items-center gap-1 text-xs font-medium text-linear-accent-violet transition-colors hover:text-linear-text-primary"
            >
              전체보기
              <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="divide-y divide-border/70">
            {recentResults.map((result) => (
              <div key={result.id} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-teal-50/60">
                <div className={`h-2 w-2 shrink-0 rounded-full ${result.passed ? 'bg-linear-status-emerald' : 'bg-red-500'}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-linear-text-secondary">{result.name}</p>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-linear-text-tertiary">
                    <span>{result.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" strokeWidth={1.5} />
                      {result.duration}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`text-sm font-semibold ${result.score >= 75 ? 'text-linear-status-emerald' : 'text-red-500'}`}>
                    {result.score}점
                  </span>
                  <p className={`mt-0.5 text-xs ${result.passed ? 'text-linear-status-emerald' : 'text-red-500'}`}>
                    {result.passed ? '합격권' : '불합격권'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SurfacePanel>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/exam"
            className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-linear-brand-indigo px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-linear-brand-indigo/90"
          >
            <BookOpen className="h-4 w-4" strokeWidth={1.5} />
            시험 응시하기
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <Link
            href="/recommend"
            className="flex flex-1 items-center justify-center gap-2 rounded-[8px] border border-border bg-white px-6 py-3 text-sm font-medium text-linear-text-secondary transition-colors hover:bg-teal-50"
          >
            취약파트 풀기
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
