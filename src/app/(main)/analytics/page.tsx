'use client';

import { useMemo } from 'react';
import { TrendingDown, AlertCircle, BookOpen, Zap, Activity, Target } from 'lucide-react';
import RadarChart from '@/components/analytics/RadarChart';
import LineChart from '@/components/analytics/LineChart';
import BarChart from '@/components/analytics/BarChart';
import { PageHero, SurfacePanel } from '@/components/common/PageHero';
import { cn } from '@/lib/utils';

const radarData = [
  { subject: '국어', score: 79 },
  { subject: '영어', score: 68 },
  { subject: '한국사', score: 85 },
  { subject: '행정학', score: 75 },
  { subject: '행정법', score: 71 },
  { subject: '사회', score: 62 },
];

const weeklyData = [
  { name: '월', count: 32 },
  { name: '화', count: 45 },
  { name: '수', count: 28 },
  { name: '목', count: 60 },
  { name: '금', count: 41 },
  { name: '토', count: 78 },
  { name: '일', count: 55 },
];

function generate30DaysMultiData() {
  const data = [];
  const subjects = {
    korean: { base: 72, amplitude: 6 },
    english: { base: 61, amplitude: 8 },
    history: { base: 80, amplitude: 5 },
    adminLaw: { base: 64, amplitude: 9 },
  };
  const now = new Date(2026, 3, 2);
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const trend = ((29 - i) / 29) * 7;
    const entry: Record<string, string | number> = { date: `${month}/${day}` };
    (Object.entries(subjects) as [string, { base: number; amplitude: number }][]).forEach(([key, cfg]) => {
      const noise = Math.sin(i * 2.1 + key.length) * cfg.amplitude;
      entry[key] = Math.min(100, Math.max(30, Math.round(cfg.base + trend + noise)));
    });
    data.push(entry);
  }
  return data;
}

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

export default function AnalyticsPage() {
  const trendData = useMemo(() => generate30DaysMultiData(), []);

  return (
    <div className="min-h-screen bg-white px-4 py-8 text-linear-text-primary md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHero
          eyebrow="Analysis"
          title="취약 영역 분석"
          description="정답률이 낮은 단원과 최근 성적 흐름을 같은 기준으로 정렬했습니다. 색은 강하게, 표면은 낮게 유지해 데이터가 먼저 보이도록 했습니다."
          icon={Activity}
          stats={[
            { label: '최저 단원', value: '38%', tone: 'danger' },
            { label: '추세', value: '+7%', tone: 'success' },
            { label: '주의 파트', value: '5개', tone: 'warning' },
            { label: '분석 기간', value: '30일', tone: 'default' },
          ]}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RadarChart data={radarData} title="과목별 정답률" />
          <BarChart data={weeklyData} dataKey="count" title="요일별 풀이량" color="#0f766e" labelKey="name" />
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

        <LineChart
          data={trendData}
          lines={[
            { key: 'korean', color: '#0f766e', name: '국어' },
            { key: 'english', color: '#14b8a6', name: '영어' },
            { key: 'history', color: '#10b981', name: '한국사' },
            { key: 'adminLaw', color: '#f97316', name: '행정법' },
          ]}
          title="최근 30일 과목별 성적 추이"
        />

        <SurfacePanel className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <Target className="h-4 w-4 text-linear-accent-violet" />
            <div>
              <h3 className="text-sm font-semibold text-linear-text-primary">취약 파트 TOP 5</h3>
              <p className="mt-0.5 text-xs text-linear-text-tertiary">우선순위가 높은 복습 후보입니다.</p>
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

        <BarChart data={weeklyData} dataKey="count" title="학습 패턴 분석" color="#14b8a6" labelKey="name" />
      </div>
    </div>
  );
}
