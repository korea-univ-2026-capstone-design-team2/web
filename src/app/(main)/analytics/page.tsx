'use client';

import { useMemo } from 'react';
import { TrendingDown, AlertCircle, BookOpen, Zap } from 'lucide-react';
import RadarChart from '@/components/analytics/RadarChart';
import LineChart from '@/components/analytics/LineChart';
import BarChart from '@/components/analytics/BarChart';

// --- Mock Data ---
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

// Heatmap data: subjects × units
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
    iconColor: 'text-red-400',
  },
  {
    rank: 2,
    subject: '영어',
    unit: '독해 종합',
    accuracy: 45.2,
    recommendation: '단락 요지 파악 훈련 + 어휘 암기 병행 필요',
    icon: TrendingDown,
    iconColor: 'text-orange-400',
  },
  {
    rank: 3,
    subject: '행정법',
    unit: '행정소송',
    accuracy: 52.7,
    recommendation: '판례 정리 중심으로 최근 5년 기출 풀기 권장',
    icon: BookOpen,
    iconColor: 'text-yellow-400',
  },
  {
    rank: 4,
    subject: '행정학',
    unit: '재무행정',
    accuracy: 58.3,
    recommendation: '예산 과정·제도 개념도 작성 후 기출 연습',
    icon: BookOpen,
    iconColor: 'text-yellow-400',
  },
  {
    rank: 5,
    subject: '영어',
    unit: '어휘',
    accuracy: 61.0,
    recommendation: '공무원 빈출 어휘 1000개 우선순위 암기 추천',
    icon: Zap,
    iconColor: 'text-[#0f766e]',
  },
];

function getHeatColor(accuracy: number): string {
  if (accuracy >= 85) return 'bg-[rgba(16,185,129,0.75)]';
  if (accuracy >= 75) return 'bg-[rgba(16,185,129,0.45)]';
  if (accuracy >= 65) return 'bg-[rgba(234,179,8,0.45)]';
  if (accuracy >= 55) return 'bg-[rgba(249,115,22,0.45)]';
  if (accuracy >= 45) return 'bg-[rgba(239,68,68,0.5)]';
  return 'bg-[rgba(239,68,68,0.75)]';
}

function getHeatTextColor(accuracy: number): string {
  if (accuracy >= 75) return 'text-[#f7f8f8]';
  if (accuracy >= 55) return 'text-[#f7f8f8]';
  return 'text-[#f7f8f8]';
}

export default function AnalyticsPage() {
  const trendData = useMemo(() => generate30DaysMultiData(), []);

  return (
    <div className="min-h-screen bg-linear-bg-marketing px-4 py-8 md:px-8 text-linear-text-primary">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Page Title */}
        <div className="space-y-1">
          <h1 className="linear-text-h2 tracking-tight text-linear-text-primary">취약점 분석</h1>
          <p className="linear-text-small text-linear-text-tertiary">AI가 분석한 학습 패턴과 취약 영역을 확인하세요.</p>
        </div>

        {/* Top Row: Radar + Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RadarChart data={radarData} title="과목별 정답률" />
          <BarChart
            data={weeklyData}
            dataKey="count"
            title="요일별 풀이량"
            color="#0f766e"
            labelKey="name"
          />
        </div>

        {/* Heatmap */}
        <div className="bg-white/70 border border-border rounded-[12px] p-6 shadow-[var(--shadow-level-2)] overflow-hidden dark:bg-white/2 dark:border-white/8">
          <div className="mb-4">
            <h3 className="linear-text-body-medium text-linear-text-primary">파트별 취약도 히트맵</h3>
            <p className="linear-text-caption text-linear-text-quaternary mt-1">각 셀의 색상은 정답률을 나타냅니다 — 빨강(낮음) → 노랑 → 초록(높음)</p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {[
              { label: '~45%', class: 'bg-[rgba(239,68,68,0.75)]' },
              { label: '45~55%', class: 'bg-[rgba(239,68,68,0.5)]' },
              { label: '55~65%', class: 'bg-[rgba(249,115,22,0.45)]' },
              { label: '65~75%', class: 'bg-[rgba(234,179,8,0.45)]' },
              { label: '75~85%', class: 'bg-[rgba(16,185,129,0.45)]' },
              { label: '85%+', class: 'bg-[rgba(16,185,129,0.75)]' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${item.class}`} />
                <span className="text-linear-text-quaternary text-xs">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 overflow-x-auto">
            {heatmapData.map((row) => (
              <div key={row.subject} className="flex items-center gap-2 min-w-0">
                <div className="w-16 flex-shrink-0">
                  <span className="text-linear-text-tertiary text-xs font-medium">{row.subject}</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {row.units.map((unit) => (
                    <div
                      key={unit.name}
                      title={`${unit.name}: ${unit.accuracy}%`}
                      className={`${getHeatColor(unit.accuracy)} ${getHeatTextColor(unit.accuracy)} rounded-[4px] px-2.5 py-1.5 text-xs font-medium cursor-default transition-opacity hover:opacity-80 whitespace-nowrap`}
                    >
                      <span>{unit.name}</span>
                      <span className="ml-1.5 opacity-80">{unit.accuracy}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score Trend */}
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

        {/* Top 5 Weakness */}
        <div className="bg-white/70 border border-border rounded-[12px] p-6 shadow-[var(--shadow-level-2)] dark:bg-white/2 dark:border-white/8">
          <h3 className="linear-text-body-medium text-linear-text-primary mb-4">취약 파트 TOP 5</h3>
          <div className="space-y-3">
            {weaknessList.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.rank}
                  className="flex items-start gap-4 rounded-[6px] border border-transparent p-3 transition-colors hover:bg-black/3 hover:border-border dark:hover:bg-white/6 dark:hover:border-white/10"
                >
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-border bg-linear-bg-surface dark:border-white/8 dark:bg-white/4">
                    <span className="text-linear-text-quaternary text-xs font-bold">{item.rank}</span>
                  </div>
                  <div className={`flex-shrink-0 mt-0.5`}>
                    <Icon className={`w-4 h-4 ${item.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="linear-text-small-medium text-linear-text-secondary">
                        {item.subject} &gt; {item.unit}
                      </span>
                      <span
                        className={`text-xs font-bold font-signature px-2 py-0.5 rounded-full ${
                          item.accuracy < 50
                            ? 'border border-red-500/25 bg-red-500/10 text-red-500'
                            : item.accuracy < 65
                            ? 'border border-yellow-500/25 bg-yellow-500/10 text-yellow-500'
                            : 'border border-amber-400/25 bg-amber-400/10 text-amber-500'
                        }`}
                      >
                        {item.accuracy}% 정답률
                      </span>
                    </div>
                    <p className="linear-text-caption text-linear-text-quaternary mt-1">
                      <span className="text-linear-accent-violet font-medium">AI 추천:</span> {item.recommendation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Pattern */}
        <BarChart
          data={weeklyData}
          dataKey="count"
          title="학습 패턴 분석"
          color="#14b8a6"
          labelKey="name"
        />

      </div>
    </div>
  );
}
