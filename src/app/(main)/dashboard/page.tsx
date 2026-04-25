'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Flame,
  TrendingUp,
  ChevronRight,
  Clock,
  ArrowRight,
} from 'lucide-react';
import RadarChart from '@/components/analytics/RadarChart';
import LineChart from '@/components/analytics/LineChart';

// --- Mock Data ---
const radarData = [
  { subject: '국어', score: 79 },
  { subject: '영어', score: 68 },
  { subject: '한국사', score: 85 },
  { subject: '행정학', score: 75 },
  { subject: '행정법', score: 71 },
  { subject: '사회', score: 62 },
];

function generate30DaysData() {
  const data = [];
  const now = new Date(2026, 3, 2); // April 2, 2026
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const base = 68;
    const trend = ((29 - i) / 29) * 8;
    const noise = (Math.sin(i * 2.5) * 6 + Math.cos(i * 1.3) * 4);
    const score = Math.min(100, Math.max(40, Math.round(base + trend + noise)));
    data.push({ date: `${month}/${day}`, score });
  }
  return data;
}

const recentResults = [
  { id: 1, name: '2025년 국가직 9급 모의고사', date: '2026.04.01', score: 82, duration: '47분', passed: true },
  { id: 2, name: '행정법 집중훈련 Vol.3', date: '2026.03.30', score: 71, duration: '38분', passed: false },
  { id: 3, name: '2024년 지방직 9급 기출', date: '2026.03.28', score: 78, duration: '52분', passed: true },
  { id: 4, name: '국어 어휘·문법 특강', date: '2026.03.27', score: 85, duration: '29분', passed: true },
  { id: 5, name: '영어 독해 심화 훈련', date: '2026.03.25', score: 65, duration: '44분', passed: false },
];

const statCards = [
  {
    label: '오늘 풀이',
    value: '47문제',
    icon: BookOpen,
    iconColor: 'text-linear-accent-violet',
    iconBg: 'bg-linear-brand-indigo/10',
    badge: null,
  },
  {
    label: '오늘 정답률',
    value: '78.7%',
    icon: CheckCircle2,
    iconColor: 'text-linear-status-emerald',
    iconBg: 'bg-linear-status-emerald/10',
    badge: { label: '+3.2%', positive: true },
  },
  {
    label: '연속 학습일',
    value: '14일',
    icon: Flame,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-500/10',
    badge: null,
  },
  {
    label: '전체 정답률',
    value: '74.2%',
    icon: TrendingUp,
    iconColor: 'text-linear-brand-indigo',
    iconBg: 'bg-linear-brand-indigo/10',
    badge: { label: '+1.8%', positive: true },
  },
];

export default function DashboardPage() {
  const trendData = useMemo(() => generate30DaysData(), []);

  return (
    <div className="min-h-screen bg-linear-bg-marketing px-4 py-8 md:px-8 text-linear-text-primary">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Greeting */}
        <div className="space-y-1">
          <h1 className="linear-text-h2 text-linear-text-primary tracking-tight">안녕하세요, 김민준님!</h1>
          <p className="linear-text-small text-linear-text-tertiary">오늘도 목표를 향해 꾸준히 나아가고 있어요.</p>
        </div>

        {/* AI Recommendation Banner */}
        <div className="bg-white/2 border border-white/8 rounded-[12px] p-4 flex gap-4 shadow-[var(--shadow-level-2)]">
          <div className="w-1 rounded-full bg-linear-brand-indigo flex-shrink-0" />
          <div className="space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wide text-linear-text-tertiary">AI 추천</p>
            <p className="linear-text-small text-linear-text-secondary leading-relaxed">
              오늘은 행정법 3단원{' '}
              <span className="text-linear-accent-violet font-medium">&#39;행정행위의 효력&#39;</span>을 집중 공략하세요!
              지난 3회 연속 해당 단원에서 오답이 발생했습니다.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white/2 border border-white/8 rounded-[12px] p-5 space-y-3 shadow-[var(--shadow-level-2)]"
              >
                <div className="flex items-center justify-between">
                  <div className={`${card.iconBg} rounded-[6px] p-2`}>
                    <Icon className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                  {card.badge && (
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        card.badge.positive
                          ? 'bg-linear-status-emerald/10 text-linear-status-emerald'
                          : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {card.badge.label}
                    </span>
                  )}
                </div>
                <div>
                  <p className="linear-text-h3 text-linear-text-primary tracking-tight">
                    {card.value}
                  </p>
                  <p className="linear-text-label text-linear-text-quaternary mt-1">{card.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RadarChart data={radarData} title="과목별 정답률" />
          <LineChart
            data={trendData}
            lines={[{ key: 'score', color: '#0f766e', name: '정답률' }]}
            title="최근 30일 성적 추이"
          />
        </div>

        {/* Recent Results */}
        <div className="bg-white/2 border border-white/8 rounded-[12px] p-6 shadow-[var(--shadow-level-2)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="linear-text-body-medium text-linear-text-primary">최근 응시 결과</h3>
            <Link
              href="/mypage"
              className="linear-text-caption text-linear-accent-violet hover:text-linear-text-primary transition-colors flex items-center gap-1"
            >
              전체보기
              <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="space-y-2">
            {recentResults.map((result) => (
              <div
                key={result.id}
                className="flex items-center gap-3 p-3 rounded-[8px] hover:bg-white/4 transition-colors group border border-transparent hover:border-white/8"
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    result.passed ? 'bg-linear-status-emerald' : 'bg-red-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="linear-text-small-medium text-linear-text-secondary truncate">{result.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="linear-text-caption text-linear-text-quaternary font-signature">{result.date}</span>
                    <span className="flex items-center gap-1 linear-text-caption text-linear-text-quaternary font-signature">
                      <Clock className="w-3 h-3" strokeWidth={1.5} />
                      {result.duration}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span
                    className={`text-sm font-bold font-signature ${
                      result.score >= 75 ? 'text-linear-status-emerald' : 'text-red-500'
                    }`}
                  >
                    {result.score}점
                  </span>
                  <p
                    className={`linear-text-caption mt-0.5 ${
                      result.passed ? 'text-linear-status-emerald' : 'text-red-500'
                    }`}
                  >
                    {result.passed ? '합격권' : '불합격권'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/exam"
            className="flex-1 flex items-center justify-center gap-2 bg-linear-brand-indigo hover:opacity-90 text-white font-medium py-3 px-6 rounded-[8px] transition-colors text-sm"
          >
            <BookOpen className="w-4 h-4" strokeWidth={1.5} />
            시험 응시하기
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
          <Link
            href="/recommend"
            className="flex-1 flex items-center justify-center gap-2 rounded-[8px] border border-border bg-white/70 px-6 py-3 text-sm font-medium text-linear-text-secondary transition-colors hover:bg-white/90 dark:border-white/8 dark:bg-white/2 dark:hover:bg-white/5"
          >
            취약파트 풀기
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>

      </div>
    </div>
  );
}
