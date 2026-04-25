'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Brain } from 'lucide-react';

// --- Inline Mock Data ---
interface Question {
  id: number;
  subject: string;
  unit: string;
  difficulty: '상' | '중' | '하';
  preview: string;
  aiReason: string;
  priority: 'high' | 'medium' | 'low';
}

const allQuestions: Question[] = [
  {
    id: 1,
    subject: '행정법총론',
    unit: '행정행위 효력',
    difficulty: '상',
    preview: '다음 중 행정행위의 공정력에 관한 설명으로 옳지 않은 것은? ① 공정력은 행정행위가 위법하더라도 취소되기 전까지 유효...',
    aiReason: '지난 2주 동안 해당 단원 정답률 38% — 집중 복습이 필요합니다.',
    priority: 'high',
  },
  {
    id: 2,
    subject: '영어',
    unit: '독해 종합',
    difficulty: '상',
    preview: 'The following passage discusses the concept of administrative discretion in modern governance. Choose the statement that best...',
    aiReason: '독해 단원 최근 5회 연속 오답 발생. 지문 구조 파악 훈련 권장.',
    priority: 'high',
  },
  {
    id: 3,
    subject: '행정법총론',
    unit: '행정소송',
    difficulty: '중',
    preview: '행정소송법상 취소소송의 제기 요건에 대한 설명으로 가장 적절한 것은? ① 처분 등을 안 날로부터 90일 이내에 제기하여야...',
    aiReason: '행정소송 단원 정답률 52% — 유사 문제 반복 오답 패턴 감지됨.',
    priority: 'high',
  },
  {
    id: 4,
    subject: '영어',
    unit: '어휘',
    difficulty: '중',
    preview: 'Choose the word that is closest in meaning to the underlined word: The government promulgated new regulations to curtail...',
    aiReason: '어휘 단원 정답률 61% — 공무원 빈출 어휘 학습 부족 감지.',
    priority: 'medium',
  },
  {
    id: 5,
    subject: '행정학개론',
    unit: '재무행정',
    difficulty: '중',
    preview: '예산의 원칙 중 예산 통일성 원칙에 관한 설명으로 옳은 것은? ① 모든 수입은 국고에 납입하고 그곳에서 지출하여야 한다...',
    aiReason: '재무행정 단원 최근 정답률 58% — 예산 원칙 개념 혼동 패턴 발견.',
    priority: 'medium',
  },
  {
    id: 6,
    subject: '국어',
    unit: '화법·작문',
    difficulty: '중',
    preview: '다음 글의 주제로 가장 적절한 것은? 현대 행정 환경에서 디지털 전환은 피할 수 없는 흐름이다. 그러나 이러한 변화가...',
    aiReason: '화법·작문 단원 정답률 68% — 비문학 지문 독해 전략 보완 필요.',
    priority: 'medium',
  },
  {
    id: 7,
    subject: '행정법총론',
    unit: '행정처분',
    difficulty: '하',
    preview: '행정처분의 취소와 철회의 차이점에 대한 설명으로 옳지 않은 것은? ① 취소는 처분 시부터 소급하여 효력을 상실시킨다...',
    aiReason: '행정처분 기초 개념 오답 2회 — 기본 개념 재정립이 필요한 시점입니다.',
    priority: 'medium',
  },
  {
    id: 8,
    subject: '한국사',
    unit: '근현대사',
    difficulty: '하',
    preview: '다음 중 1919년 3·1운동에 관한 설명으로 옳은 것은? ① 민족 대표 33인이 독립선언서에 서명하였다. ② 운동의 결과 조선총...',
    aiReason: '근현대사 단원 정답률 77% — 지속적 유지를 위한 주기적 복습 권장.',
    priority: 'low',
  },
  {
    id: 9,
    subject: '행정학개론',
    unit: '조직관리',
    difficulty: '중',
    preview: '다음 중 관료제의 병리현상(역기능)에 대한 설명으로 가장 적절한 것은? ① 목표 전치 현상은 수단이 목적화되는 현상...',
    aiReason: '조직관리 단원 정답률 65% — 관료제 관련 문제 오답률 높음.',
    priority: 'medium',
  },
  {
    id: 10,
    subject: '국어',
    unit: '어휘·문법',
    difficulty: '하',
    preview: '다음 밑줄 친 단어의 쓰임이 옳지 않은 것은? ① 그 건물의 조망이 좋아 많은 사람들이 찾아온다. ② 이 정책은 서민들의...',
    aiReason: '어휘·문법 정답률 79% — 자주 틀리는 유형 집중 보완용 추천 문제.',
    priority: 'low',
  },
];

const filterOptions = ['전체', '행정법총론', '영어', '행정학개론', '한국사', '국어'];

const difficultyConfig: Record<
  '상' | '중' | '하',
  { label: string; className: string }
> = {
  상: { label: '상', className: 'bg-[rgba(239,68,68,0.15)] text-red-400' },
  중: { label: '중', className: 'bg-[rgba(234,179,8,0.15)] text-yellow-400' },
  하: { label: '하', className: 'bg-[rgba(16,185,129,0.15)] text-[#10b981]' },
};

const priorityConfig: Record<
  'high' | 'medium' | 'low',
  { label: string; dotClass: string }
> = {
  high: { label: '우선순위 높음', dotClass: 'bg-red-400' },
  medium: { label: '우선순위 보통', dotClass: 'bg-yellow-400' },
  low: { label: '우선순위 낮음', dotClass: 'bg-[#10b981]' },
};

export default function RecommendPage() {
  const [activeFilter, setActiveFilter] = useState('전체');

  const filtered =
    activeFilter === '전체'
      ? allQuestions
      : allQuestions.filter((q) =>
          q.subject.startsWith(activeFilter) || activeFilter.includes(q.subject)
        );

  return (
    <div className="min-h-screen bg-linear-bg-marketing px-4 py-8 md:px-8 text-linear-text-primary">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="bg-linear-brand-indigo/10 rounded-[6px] p-1.5 border border-linear-brand-indigo/20">
              <Brain className="w-4 h-4 text-linear-accent-violet" strokeWidth={1.5} />
            </div>
            <h1 className="linear-text-h2 tracking-tight text-linear-text-primary">AI 추천 문제</h1>
          </div>
          <p className="linear-text-small text-linear-text-tertiary">취약 파트 기반으로 선별된 맞춤 문제입니다</p>

          {/* Stats */}
          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-linear-brand-indigo" />
              <span className="linear-text-caption text-linear-text-quaternary font-signature">분석된 취약 파트 5개</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-linear-status-emerald" />
              <span className="linear-text-caption text-linear-text-quaternary font-signature">추천 문제 47개</span>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterOptions.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full linear-text-small font-medium transition-colors ${
                  isActive
                    ? 'bg-linear-brand-indigo text-white border border-linear-brand-indigo'
                    : 'border border-white/8 text-linear-text-tertiary hover:bg-white/4 hover:text-linear-text-secondary'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Question count */}
        <p className="text-[#62666d] text-xs">
          {filtered.length}개 문제 표시 중
        </p>

        {/* Question Cards */}
        <div className="space-y-3">
          {filtered.map((question, index) => {
            const diff = difficultyConfig[question.difficulty];
            const prio = priorityConfig[question.priority];

            return (
              <div
                key={question.id}
                className="bg-white/2 border border-white/8 rounded-[12px] p-5 hover:bg-white/4 hover:border-white/16 transition-all shadow-[var(--shadow-level-1)] hover:shadow-[var(--shadow-level-2)]"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="linear-text-caption text-linear-text-quaternary font-signature">
                      #{String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="bg-linear-brand-indigo/10 text-linear-accent-violet text-[11px] font-medium px-2 py-0.5 rounded-[4px] border border-linear-brand-indigo/20">
                      {question.subject}
                    </span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-[4px] border border-transparent ${diff.className}`}>
                      난이도 {diff.label}
                    </span>
                    <span className="bg-white/4 border border-white/8 text-linear-text-tertiary text-[11px] px-2 py-0.5 rounded-[4px]">
                      {question.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className={`w-1.5 h-1.5 rounded-full ${prio.dotClass}`} />
                    <span className="linear-text-caption text-linear-text-quaternary hidden sm:inline">{prio.label}</span>
                  </div>
                </div>

                {/* Question Preview */}
                <p className="linear-text-small text-linear-text-secondary leading-relaxed line-clamp-2 mb-3">
                  {question.preview}
                </p>

                {/* AI Reason */}
                <div className="flex items-start gap-2 p-3 bg-linear-brand-indigo/5 border border-linear-brand-indigo/10 rounded-[8px] mb-3">
                  <Zap className="w-3.5 h-3.5 text-linear-accent-violet flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p className="linear-text-caption text-linear-text-tertiary leading-relaxed">
                    <span className="text-linear-accent-violet font-medium">AI 추천 이유:</span>{' '}
                    {question.aiReason}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end">
                  <Link
                    href="/exam"
                    className="flex items-center gap-1.5 bg-linear-brand-indigo hover:opacity-90 text-white linear-text-small-medium px-4 py-2 rounded-[6px] transition-opacity"
                  >
                    바로 풀기
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load more hint */}
        <div className="text-center py-4">
          <p className="text-[#62666d] text-xs">총 47개 문제 중 {filtered.length}개 표시됨</p>
          <button className="mt-2 text-[#0f766e] text-sm hover:text-[#14b8a6] transition-colors">
            더 보기
          </button>
        </div>

      </div>
    </div>
  );
}
