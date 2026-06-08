'use client';

import { useEffect, useMemo, useState } from 'react';
import { TrendingDown, AlertCircle, BookOpen, Zap, Activity, Target, Loader2 } from 'lucide-react';
import RadarChart from '@/components/analytics/RadarChart';
import LineChart from '@/components/analytics/LineChart';
import BarChart from '@/components/analytics/BarChart';
import { PageHero, SurfacePanel } from '@/components/common/PageHero';
import { cn } from '@/lib/utils';
import {
  ANALYTICS_PERIOD_DAYS,
  calculateAccuracyTrend,
  dailyRecordsToTrendLine,
  dailyRecordsToWeekdayBar,
  findLowestAccuracyDay,
  formatStudyDuration,
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

const heatmapData = [
  {
    subject: '행정법',
    units: [
      { name: '행정법총론', accuracy: 45 },
      { name: '행정행위 효력', accuracy: 38 },
      { name: '행정소송', accuracy: 62 },
      { name: '행정처분', accuracy: 55 },
      { name: '손해배상', accuracy: 71 },
    ],
  },
  {
    subject: '영어',
    units: [
      { name: '어휘', accuracy: 58 },
      { name: '독해', accuracy: 52 },
      { name: '문법', accuracy: 76 },
      { name: '듣기', accuracy: 69 },
    ],
  },
  {
    subject: '행정학',
    units: [
      { name: '행정학개론', accuracy: 72 },
      { name: '조직관리', accuracy: 65 },
      { name: '인사행정', accuracy: 80 },
      { name: '재무행정', accuracy: 58 },
      { name: '정책론', accuracy: 74 },
    ],
  },
  {
    subject: '국어',
    units: [
      { name: '문학', accuracy: 83 },
      { name: '비문학', accuracy: 75 },
      { name: '어휘·문법', accuracy: 79 },
      { name: '화법·작문', accuracy: 68 },
    ],
  },
  {
    subject: '한국사',
    units: [
      { name: '선사·고대', accuracy: 88 },
      { name: '고려시대', accuracy: 82 },
      { name: '조선시대', accuracy: 85 },
      { name: '근현대사', accuracy: 77 },
      { name: '문화사', accuracy: 91 },
    ],
  },
];

const weaknessList = [
  {
    rank: 1,
    subject: '행정법총론',
    unit: '행정행위 효력',
    accuracy: 38.0,
    recommendation: '기본 개념 재학습 후 기출문제 3회 반복 권장',
    icon: AlertCircle,
    iconColor: 'text-red-500',
  },
  {
    rank: 2,
    subject: '영어',
    unit: '독해 종합',
    accuracy: 45.2,
    recommendation: '단락 요지 파악 훈련 + 어휘 암기 병행 필요',
    icon: TrendingDown,
    iconColor: 'text-orange-500',
  },
  {
    rank: 3,
    subject: '행정법',
    unit: '행정소송',
    accuracy: 52.7,
    recommendation: '판례 정리 중심으로 최근 5년 기출 풀기 권장',
    icon: BookOpen,
    iconColor: 'text-amber-500',
  },
  {
    rank: 4,
    subject: '행정학',
    unit: '재무행정',
    accuracy: 58.3,
    recommendation: '예산 과정·제도 개념도 작성 후 기출 연습',
    icon: BookOpen,
    iconColor: 'text-amber-500',
  },
  {
    rank: 5,
    subject: '영어',
    unit: '어휘',
    accuracy: 61.0,
    recommendation: '공무원 빈출 어휘 1000개 우선순위 암기 추천',
    icon: Zap,
    iconColor: 'text-linear-accent-violet',
  },
];

function getHeatColor(accuracy: number): string {
  if (accuracy >= 85) return 'bg-emerald-500/18 text-emerald-900 ring-1 ring-inset ring-emerald-500/20';
  if (accuracy >= 75) return 'bg-emerald-400/12 text-emerald-800 ring-1 ring-inset ring-emerald-400/18';
  if (accuracy >= 65) return 'bg-amber-400/14 text-amber-900 ring-1 ring-inset ring-amber-400/20';
  if (accuracy >= 55) return 'bg-orange-400/14 text-orange-900 ring-1 ring-inset ring-orange-400/20';
  if (accuracy >= 45) return 'bg-rose-400/14 text-rose-900 ring-1 ring-inset ring-rose-400/20';
  return 'bg-red-500/16 text-red-900 ring-1 ring-inset ring-red-500/24';
}

function accuracyTone(accuracy: number): string {
  if (accuracy < 50) return 'border-red-500/20 bg-red-500/8 text-red-500';
  if (accuracy < 65) return 'border-amber-500/20 bg-amber-500/8 text-amber-600';
  return 'border-linear-brand-indigo/20 bg-linear-brand-indigo/8 text-linear-accent-violet';
}

function formatTrendLabel(value: number): string {
  if (value > 0) return `+${value}%p`;
  if (value < 0) return `${value}%p`;
  return '0%p';
}

export default function AnalyticsPage() {
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

  const trendData = useMemo(() => dailyRecordsToTrendLine(dailyRecords), [dailyRecords]);
  const weeklyData = useMemo(() => dailyRecordsToWeekdayBar(dailyRecords), [dailyRecords]);
  const accuracyTrend = useMemo(() => calculateAccuracyTrend(dailyRecords), [dailyRecords]);
  const lowestAccuracy = useMemo(() => findLowestAccuracyDay(dailyRecords), [dailyRecords]);
  const overallAccuracy = summary ? toAccuracyPercent(summary.accuracy) : 0;
  const totalQuestions = summary?.totalQuestions ?? 0;

  return (
    <div className="min-h-screen bg-white px-4 py-8 text-linear-text-primary md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHero
          eyebrow="Analysis"
          title="취약 영역 분석"
          description="취약한 영역과 최근 성적 흐름을 확인하세요."
          icon={Activity}
          stats={[
            { label: '최저 일별', value: isLoading ? '-' : `${lowestAccuracy}%`, tone: 'danger' },
            { label: '추세', value: isLoading ? '-' : formatTrendLabel(accuracyTrend), tone: accuracyTrend >= 0 ? 'success' : 'warning' },
            { label: '총 풀이', value: isLoading ? '-' : `${totalQuestions}문항`, tone: 'warning' },
            { label: '분석 기간', value: `${ANALYTICS_PERIOD_DAYS}일`, tone: 'default' },
          ]}
        />

        {loadError && (
          <div className="rounded-[10px] border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-500">
            {loadError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RadarChart data={radarData} title="과목별 정답률" />
          {isLoading ? (
            <SurfacePanel className="flex min-h-[360px] items-center justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin text-linear-accent-violet" />
            </SurfacePanel>
          ) : (
            <BarChart data={weeklyData} dataKey="count" title="요일별 풀이량" color="#0f766e" labelKey="name" />
          )}
        </div>

        <SurfacePanel className="overflow-hidden p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-linear-text-primary">파트별 취약도 히트맵</h3>
              <p className="mt-1 text-xs text-linear-text-tertiary">색상은 정답률을 나타냅니다. 낮은 정답률일수록 붉은 계열로 표시됩니다.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: '~45%', className: 'bg-red-500/70' },
                { label: '55%', className: 'bg-orange-400/60' },
                { label: '75%', className: 'bg-amber-400/60' },
                { label: '85%+', className: 'bg-emerald-500/70' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-xs text-linear-text-tertiary">
                  <div className={cn('h-2.5 w-2.5 rounded-[3px]', item.className)} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 overflow-x-auto">
            {heatmapData.map((row) => (
              <div key={row.subject} className="flex min-w-0 items-center gap-3 rounded-[10px] px-2 py-1.5 hover:bg-teal-50/50">
                <div className="w-16 shrink-0">
                  <span className="text-xs font-semibold text-linear-text-secondary">{row.subject}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {row.units.map((unit) => (
                    <div
                      key={unit.name}
                      title={`${unit.name}: ${unit.accuracy}%`}
                      className={cn('cursor-default rounded-[6px] px-2.5 py-1.5 text-xs font-semibold transition-opacity hover:opacity-85', getHeatColor(unit.accuracy))}
                    >
                      <span>{unit.name}</span>
                      <span className="ml-1.5 opacity-80">{unit.accuracy}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SurfacePanel>

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

        <SurfacePanel className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <Target className="h-4 w-4 text-linear-accent-violet" />
            <div>
              <h3 className="text-sm font-semibold text-linear-text-primary">기간 요약</h3>
              <p className="mt-0.5 text-xs text-linear-text-tertiary">
                {isLoading
                  ? '통계를 불러오는 중입니다.'
                  : `최근 ${ANALYTICS_PERIOD_DAYS}일 · 정답률 ${overallAccuracy}% · 학습 ${summary ? formatStudyDuration(summary.totalStudySeconds) : '-'}`}
              </p>
            </div>
          </div>
          <div className="divide-y divide-border/70">
            {weaknessList.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.rank} className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-teal-50/60">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-linear-text-tertiary">
                    {item.rank}
                  </div>
                  <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', item.iconColor)} strokeWidth={1.7} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-linear-text-secondary">
                        {item.subject} &gt; {item.unit}
                      </span>
                      <span className={cn('rounded-full border px-2 py-0.5 text-xs font-semibold', accuracyTone(item.accuracy))}>
                        {item.accuracy}% 정답률
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-linear-text-tertiary">
                      <span className="font-medium text-linear-accent-violet">AI 추천:</span> {item.recommendation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SurfacePanel>

        {!isLoading && (
          <BarChart data={weeklyData} dataKey="count" title="학습 패턴 분석" color="#14b8a6" labelKey="name" />
        )}
      </div>
    </div>
  );
}
