'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Shield,
  Flame,
  BarChart2,
  Monitor,
  Building2,
  CheckSquare,
  ChevronRight,
  Clock,
  FileText,
  Zap,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────

interface ExamCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  subjects: string[];
  popular?: boolean;
}

type ExamType = 'mock' | 'part' | 'weakness';
type QuestionCount = 10 | 20 | 40 | 'custom';

interface ExamConfig {
  categoryId: string;
  selectedSubjects: string[];
  examType: ExamType;
  questionCount: QuestionCount;
  customCount: number;
  timeLimit: number; // minutes
}

// ─── Data ────────────────────────────────────────────────────────────────────

const examCategories: ExamCategory[] = [
  {
    id: '9gup-national',
    name: '9급 국가직',
    icon: BookOpen,
    iconColor: 'text-linear-accent-violet',
    iconBg: 'bg-linear-brand-indigo/10',
    subjects: ['국어', '영어', '한국사', '행정학', '행정법'],
    popular: true,
  },
  {
    id: '9gup-local',
    name: '9급 지방직',
    icon: Building2,
    iconColor: 'text-linear-status-emerald',
    iconBg: 'bg-linear-status-emerald/10',
    subjects: ['국어', '영어', '한국사', '행정학', '사회'],
  },
  {
    id: 'police',
    name: '경찰 공채',
    icon: Shield,
    iconColor: 'text-blue-400',
    iconBg: 'bg-[rgba(96,165,250,0.1)]',
    subjects: ['형사법', '경찰학', '헌법', '범죄학', '영어'],
  },
  {
    id: 'fire',
    name: '소방 공채',
    icon: Flame,
    iconColor: 'text-orange-400',
    iconBg: 'bg-[rgba(251,146,60,0.1)]',
    subjects: ['소방학', '소방관계법', '행정학', '영어', '한국사'],
  },
  {
    id: '5gup-psat',
    name: '5급 PSAT',
    icon: BarChart2,
    iconColor: 'text-linear-accent-violet',
    iconBg: 'bg-[rgba(192,132,252,0.1)]',
    subjects: ['언어논리', '자료해석', '상황판단'],
  },
  {
    id: 'computer-9gup',
    name: '전산직 9급',
    icon: Monitor,
    iconColor: 'text-cyan-400',
    iconBg: 'bg-[rgba(34,211,238,0.1)]',
    subjects: ['국어', '영어', '한국사', '컴퓨터일반', '정보보호론'],
  },
];

const examTypeOptions: { value: ExamType; label: string; desc: string; icon: React.ElementType }[] = [
  { value: 'mock', label: '실전 모의고사', desc: '실제 시험과 동일한 환경', icon: FileText },
  { value: 'part', label: '파트별 연습', desc: '과목별 집중 훈련', icon: Target },
  { value: 'weakness', label: '취약점 집중', desc: 'AI가 분석한 약점 보완', icon: Zap },
];

const questionCountOptions: { value: QuestionCount; label: string }[] = [
  { value: 10, label: '10문항' },
  { value: 20, label: '20문항' },
  { value: 40, label: '40문항' },
  { value: 'custom', label: '직접 입력' },
];

function getTimeLimit(count: number): number {
  return Math.round(count * 1.5); // 1.5 min per question
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ExamPage() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<ExamCategory | null>(null);
  const [config, setConfig] = useState<ExamConfig>({
    categoryId: '',
    selectedSubjects: [],
    examType: 'mock',
    questionCount: 20,
    customCount: 20,
    timeLimit: 30,
  });

  function handleCategorySelect(cat: ExamCategory) {
    setSelectedCategory(cat);
    setConfig((prev) => ({
      ...prev,
      categoryId: cat.id,
      selectedSubjects: [...cat.subjects],
    }));
    // Scroll to config panel
    setTimeout(() => {
      document.getElementById('exam-config')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  function toggleSubject(subject: string) {
    setConfig((prev) => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subject)
        ? prev.selectedSubjects.filter((s) => s !== subject)
        : [...prev.selectedSubjects, subject],
    }));
  }

  function handleQuestionCountChange(value: QuestionCount) {
    const count = value === 'custom' ? config.customCount : (value as number);
    setConfig((prev) => ({
      ...prev,
      questionCount: value,
      timeLimit: getTimeLimit(count),
    }));
  }

  function handleCustomCountChange(value: number) {
    const clamped = Math.min(100, Math.max(5, value));
    setConfig((prev) => ({
      ...prev,
      customCount: clamped,
      timeLimit: getTimeLimit(clamped),
    }));
  }

  function handleStartExam() {
    router.push('/exam/mock-001/session');
  }

  const effectiveCount =
    config.questionCount === 'custom' ? config.customCount : config.questionCount;

  return (
    <div className="min-h-screen bg-linear-bg-marketing px-4 py-8 md:px-8 text-linear-text-primary">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="linear-text-h2 tracking-tight text-linear-text-primary">
            시험 유형 선택
          </h1>
          <p className="linear-text-small text-linear-text-tertiary">
            응시할 시험을 선택하고 학습을 시작하세요
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {examCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory?.id === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={cn(
                  'group relative flex flex-col gap-4 rounded-[12px] border p-5 text-left transition-all duration-200 shadow-[var(--shadow-level-2)]',
                  isSelected
                    ? 'border-linear-brand-indigo bg-linear-brand-indigo/10'
                    : 'border-white/8 bg-white/2 hover:bg-white/4'
                )}
              >
                {/* Popular badge */}
                {cat.popular && (
                  <span className="absolute top-3 right-3 rounded-full bg-linear-brand-indigo/10 px-2 py-0.5 text-xs font-medium text-linear-accent-violet border border-linear-brand-indigo/20">
                    인기
                  </span>
                )}

                {/* Icon + name */}
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-[8px]', cat.iconBg)}>
                    <Icon className={cn('h-5 w-5', cat.iconColor)} />
                  </div>
                  <div>
                    <p className="linear-text-body-medium text-linear-text-primary">{cat.name}</p>
                    <p className="linear-text-caption text-linear-text-tertiary">과목 수: {cat.subjects.length}개</p>
                  </div>
                </div>

                {/* Subject tags */}
                <div className="flex flex-wrap gap-1.5">
                  {cat.subjects.map((s) => (
                    <span
                      key={s}
                      className="rounded-[4px] border border-white/8 bg-white/4 px-2 py-0.5 text-[11px] text-linear-text-tertiary"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Select button */}
                <div
                  className={cn(
                    'flex items-center justify-between rounded-[6px] px-3 py-2 text-sm font-medium transition-colors',
                    isSelected
                      ? 'bg-linear-brand-indigo text-white'
                      : 'bg-white/4 text-linear-text-secondary group-hover:bg-white/8'
                  )}
                >
                  {isSelected ? '선택됨' : '선택하기'}
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Exam Config Panel */}
        {selectedCategory && (
          <div
            id="exam-config"
            className="rounded-[12px] border border-white/8 bg-white/2 p-6 space-y-6 shadow-[var(--shadow-level-2)]"
          >
            <div className="flex items-center gap-3 border-b border-white/6 pb-4">
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-[8px]', selectedCategory.iconBg)}>
                <selectedCategory.icon className={cn('h-4.5 w-4.5', selectedCategory.iconColor)} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="linear-text-body-medium text-linear-text-primary">{selectedCategory.name} 시험 설정</h2>
                <p className="linear-text-caption text-linear-text-tertiary">응시 조건을 설정하세요</p>
              </div>
            </div>

            {/* Subject Selection */}
            <div className="space-y-3">
              <label className="block linear-text-small-medium text-linear-text-secondary">
                응시 과목 선택
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedCategory.subjects.map((s) => {
                  const checked = config.selectedSubjects.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSubject(s)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-[6px] border px-3 py-1.5 linear-text-small transition-all',
                        checked
                          ? 'border-linear-brand-indigo bg-linear-brand-indigo/10 text-linear-text-primary'
                          : 'border-white/8 bg-transparent text-linear-text-tertiary hover:border-white/20'
                      )}
                    >
                      <CheckSquare
                        strokeWidth={1.5}
                        className={cn('h-3.5 w-3.5', checked ? 'text-linear-accent-violet' : 'text-linear-text-tertiary')}
                      />
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exam Type */}
            <div className="space-y-3">
              <label className="block linear-text-small-medium text-linear-text-secondary">
                시험 유형
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {examTypeOptions.map((opt) => {
                  const TypeIcon = opt.icon;
                  const isActive = config.examType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, examType: opt.value }))}
                      className={cn(
                        'flex items-center gap-3 rounded-[8px] border p-3 text-left transition-all',
                        isActive
                          ? 'border-linear-brand-indigo bg-linear-brand-indigo/10'
                          : 'border-white/8 bg-transparent hover:border-white/16'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-[6px] shrink-0',
                          isActive
                            ? 'bg-linear-brand-indigo/20'
                            : 'bg-white/4'
                        )}
                      >
                        <TypeIcon
                          strokeWidth={1.5}
                          className={cn('h-4 w-4', isActive ? 'text-linear-accent-violet' : 'text-linear-text-tertiary')}
                        />
                      </div>
                      <div>
                        <p className={cn('linear-text-small-medium', isActive ? 'text-linear-text-primary' : 'text-linear-text-secondary')}>
                          {opt.label}
                        </p>
                        <p className="linear-text-caption text-linear-text-tertiary mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Count */}
            <div className="space-y-3">
              <label className="block linear-text-small-medium text-linear-text-secondary">
                문제 수
              </label>
              <div className="flex flex-wrap gap-2">
                {questionCountOptions.map((opt) => {
                  const isActive = config.questionCount === opt.value;
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => handleQuestionCountChange(opt.value)}
                      className={cn(
                        'rounded-[6px] border px-4 py-2 linear-text-small transition-all',
                        isActive
                          ? 'border-linear-brand-indigo bg-linear-brand-indigo/10 text-linear-text-primary'
                          : 'border-white/8 text-linear-text-tertiary hover:border-white/20 hover:text-linear-text-secondary'
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              {config.questionCount === 'custom' && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={config.customCount}
                    onChange={(e) => handleCustomCountChange(Number(e.target.value))}
                    className="w-24 rounded-[6px] border border-white/12 bg-white/4 px-3 py-1.5 linear-text-small text-linear-text-primary outline-none focus:border-linear-brand-indigo transition-colors"
                  />
                  <span className="linear-text-small text-linear-text-tertiary">문항 (5~100)</span>
                </div>
              )}
            </div>

            {/* Time Limit Summary */}
            <div className="flex items-center gap-2 rounded-[8px] bg-white/2 border border-white/6 px-4 py-3 shadow-[var(--shadow-level-1)]">
              <Clock className="h-4 w-4 text-linear-text-tertiary" strokeWidth={1.5} />
              <span className="linear-text-small text-linear-text-tertiary">
                제한 시간:{' '}
                <span className="font-medium text-linear-text-secondary">
                  {config.timeLimit}분
                </span>
                {' '}({effectiveCount}문항 × 1.5분)
              </span>
            </div>

            {/* Start Button */}
            <button
              type="button"
              onClick={handleStartExam}
              disabled={config.selectedSubjects.length === 0}
              className="w-full rounded-[8px] bg-linear-brand-indigo px-6 py-3 linear-text-small-medium text-white transition-all hover:bg-linear-brand-indigo/90 disabled:cursor-not-allowed disabled:opacity-40 shadow-[var(--shadow-level-2)]"
            >
              시험 시작하기 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
