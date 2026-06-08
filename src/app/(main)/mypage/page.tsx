"use client";

import { useState } from "react";
import { PageHero, SurfacePanel } from '@/components/common/PageHero';
import {
  UserRound,
  BookOpen,
  Clock,
  Target,
  Flame,
  BookMarked,
  Bell,
  Mail,
  ChevronRight,
  Pencil,
} from "lucide-react";

// ── Mock Data ────────────────────────────────────────────────────────────────

const mockUser = {
  name: "사용자",
  email: "user@example.com",
  targetExam: "5급 PSAT",
  targetScore: 90,
  initials: "U",
};

const mockStats = [
  {
    label: "총 풀이 수",
    value: "1,240",
    unit: "문제",
    icon: BookOpen,
    color: "text-linear-accent-violet",
    bgColor: "bg-linear-brand-indigo/10",
  },
  {
    label: "누적 학습 시간",
    value: "127",
    unit: "시간",
    icon: Clock,
    color: "text-linear-status-emerald",
    bgColor: "bg-linear-status-emerald/10",
  },
  {
    label: "평균 정답률",
    value: "74.2",
    unit: "%",
    icon: Target,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    label: "연속 학습일",
    value: "14",
    unit: "일",
    icon: Flame,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
];

const mockBookmarks = [
  {
    id: 1,
    preview: "다음 중 행정행위의 효력으로 옳지 않은 것은?",
    subject: "행정법",
    year: "2023",
  },
  {
    id: 2,
    preview: "헌법상 기본권의 제한에 관한 설명으로 옳은 것은?",
    subject: "헌법",
    year: "2022",
  },
  {
    id: 3,
    preview: "국어의 로마자 표기법에서 된소리되기에 관한 설명으로 옳지 않은 것은?",
    subject: "국어",
    year: "2023",
  },
  {
    id: 4,
    preview: "영어 어법상 빈칸에 들어갈 말로 가장 적절한 것은?",
    subject: "영어",
    year: "2022",
  },
  {
    id: 5,
    preview: "조선 시대 붕당 정치에 관한 설명으로 옳지 않은 것은?",
    subject: "한국사",
    year: "2023",
  },
];

// Generate 52 weeks × 7 days of mock activity data
function generateMockActivity(): number[] {
  const days = 52 * 7;
  return Array.from({ length: days }, (_, i) => {
    const wave = Math.abs(Math.sin(i * 12.9898) * Math.cos(i * 0.618));
    const recencyBoost = i > days * 0.7 ? 1.25 : 1;
    const score = wave * recencyBoost;
    if (score < 0.24) return 0;
    if (score < 0.48) return (i % 5) + 1;
    if (score < 0.72) return (i % 10) + 6;
    return (i % 10) + 16;
  });
}

const activityData = generateMockActivity();

function getActivityColor(count: number): string {
  if (count === 0) return "#eef2f7";
  if (count <= 5) return "#ccfbf1";
  if (count <= 15) return "#5eead4";
  return "#0f766e";
}

function CalendarHeatmap() {
  const weeks = 52;
  const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];
  const cellSize = 11;
  const cellGap = 2;
  const weekWidth = cellSize + cellGap;
  const gridWidth = weeks * weekWidth - cellGap;

  // Generate month labels
  const today = new Date();
  const monthLabels: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks; w++) {
    const date = new Date(today);
    date.setDate(today.getDate() - (weeks - 1 - w) * 7);
    if (date.getMonth() !== lastMonth) {
      monthLabels.push({
        label: `${date.getMonth() + 1}월`,
        weekIndex: w,
      });
      lastMonth = date.getMonth();
    }
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="min-w-[680px]">
        {/* Month labels */}
        <div className="mb-1 ml-8">
          <div className="relative h-4" style={{ width: `${gridWidth}px` }}>
            {monthLabels.map(({ label, weekIndex }) => (
              <span
                key={`month-${weekIndex}-${label}`}
                className="absolute text-[10px] text-linear-text-quaternary"
                style={{ left: `${weekIndex * weekWidth}px` }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-1 mt-4">
          {/* Day labels */}
          <div className="flex flex-col gap-[2px] mr-1">
            {dayLabels.map((day, i) => (
              <div
                key={day}
                className="h-[11px] text-[9px] text-linear-text-quaternary flex items-center"
                style={{ opacity: i % 2 === 0 ? 1 : 0 }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[2px]">
            {Array.from({ length: weeks }, (_, w) => (
              <div key={w} className="flex flex-col gap-[2px]">
                {Array.from({ length: 7 }, (_, d) => {
                  const idx = w * 7 + d;
                  const count = activityData[idx] ?? 0;
                  return (
                    <div
                      key={d}
                      title={`${count}문제`}
                      className="h-[11px] w-[11px] rounded-[2px] cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: getActivityColor(count) }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-[10px] text-linear-text-quaternary">적음</span>
          {[0, 3, 10, 20].map((count) => (
            <div
              key={count}
              className="h-[11px] w-[11px] rounded-[2px]"
              style={{ backgroundColor: getActivityColor(count) }}
            />
          ))}
          <span className="text-[10px] text-linear-text-quaternary">많음</span>
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-linear-text-secondary">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full border transition-colors focus:outline-none ${
          checked
            ? "border-linear-brand-indigo bg-linear-brand-indigo"
            : "border-border bg-white dark:border-white/12 dark:bg-white/10"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[18px]" : "translate-x-[2px]"
          }`}
        />
      </button>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MyPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-8 text-linear-text-primary md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <PageHero
          eyebrow="Profile"
          title="내 학습 프로필"
          description="계정 정보, 저장한 문제, 학습 활동을 한 화면에서 관리합니다. 반복 표면은 낮추고 필요한 상태만 또렷하게 남겼습니다."
          icon={UserRound}
          stats={[
            { label: '목표 시험', value: mockUser.targetExam, tone: 'brand' },
            { label: '목표 점수', value: `${mockUser.targetScore}점`, tone: 'success' },
          ]}
        />

        {/* Profile Card */}
        <SurfacePanel className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {/* Avatar */}
            <div className="h-16 w-16 rounded-full bg-linear-brand-indigo/10 border border-linear-brand-indigo/20 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-signature text-linear-accent-violet">{mockUser.initials}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="linear-text-h3 text-linear-text-primary mb-1">{mockUser.name}</h2>
                  <p className="linear-text-small text-linear-text-quaternary">{mockUser.email}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 linear-text-label text-linear-accent-violet bg-linear-brand-indigo/10 border border-linear-brand-indigo/20 rounded-full px-3 py-1">
                      <Target size={14} strokeWidth={1.5} />
                      목표 시험: {mockUser.targetExam}
                    </span>
                    <span className="inline-flex items-center gap-1.5 linear-text-label text-linear-text-tertiary bg-white border border-border rounded-full px-3 py-1">
                      목표 점수: {mockUser.targetScore}점
                    </span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-signature text-linear-text-tertiary bg-white border border-border rounded-[6px] px-3 py-2 hover:bg-teal-50 hover:text-linear-text-secondary transition-colors flex-shrink-0 dark:hover:bg-white/6">
                  <Pencil size={14} strokeWidth={1.5} />
                  프로필 수정
                </button>
              </div>
            </div>
          </div>
        </SurfacePanel>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {mockStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-[14px] border border-border bg-white p-5"
              >
                <div
                  className={`h-8 w-8 rounded-[8px] ${stat.bgColor} flex items-center justify-center mb-4`}
                >
                  <Icon size={16} className={`${stat.color}`} strokeWidth={1.5} />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="linear-text-display text-linear-text-primary" style={{ fontSize: '1.5rem', letterSpacing: '-0.03em' }}>
                    {stat.value}
                  </span>
                  <span className="linear-text-small text-linear-text-quaternary">{stat.unit}</span>
                </div>
                <div className="linear-text-label text-linear-text-tertiary mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Learning Calendar */}
        <SurfacePanel className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="linear-text-body-medium text-linear-text-primary">학습 캘린더</h2>
              <p className="linear-text-small text-linear-text-quaternary mt-1">최근 52주 학습 활동</p>
            </div>
            <div className="linear-text-small text-linear-text-tertiary">
              총{" "}
              <span className="text-linear-text-primary font-signature">
                {activityData.filter((d) => d > 0).length}
              </span>
              일 학습
            </div>
          </div>
          <CalendarHeatmap />
        </SurfacePanel>

        {/* Bookmarks */}
        <SurfacePanel className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="linear-text-body-medium text-linear-text-primary">북마크된 문제</h2>
              <p className="linear-text-small text-linear-text-quaternary mt-1">{mockBookmarks.length}개의 저장된 문제</p>
            </div>
            <button className="linear-text-caption text-linear-accent-violet hover:text-linear-accent-hover transition-colors flex items-center gap-1">
              전체 보기
              <ChevronRight size={14} strokeWidth={1.5} />
            </button>
          </div>

          <div className="divide-y divide-border/70">
            {mockBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex items-start justify-between gap-4 rounded-[10px] px-3 py-3 transition-colors group hover:bg-teal-50/60"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <BookMarked size={16} strokeWidth={1.5} className="text-linear-accent-violet flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="linear-text-small-medium text-linear-text-secondary leading-relaxed line-clamp-1">
                      {bookmark.preview}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] font-signature text-linear-accent-violet bg-linear-brand-indigo/10 border border-linear-brand-indigo/15 rounded-[4px] px-1.5 py-0.5">
                        {bookmark.subject}
                      </span>
                      <span className="text-[11px] text-linear-text-quaternary font-signature">{bookmark.year}년</span>
                    </div>
                  </div>
                </div>
                <button className="flex-shrink-0 rounded-[6px] border border-border bg-white px-3 py-1.5 linear-text-label text-linear-text-tertiary transition-colors hover:bg-teal-50 hover:text-linear-text-primary whitespace-nowrap">
                  풀기
                </button>
              </div>
            ))}
          </div>
        </SurfacePanel>

        {/* Settings */}
        <SurfacePanel className="p-6">
          <h2 className="linear-text-body-medium text-linear-text-primary mb-1">알림 설정</h2>
          <p className="linear-text-small text-linear-text-quaternary mb-6">알림 수신 방법을 설정하세요</p>

          <div className="divide-y divide-border">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-[8px] bg-linear-brand-indigo/10 flex items-center justify-center">
                  <Bell size={16} strokeWidth={1.5} className="text-linear-accent-violet" />
                </div>
                <div>
                  <div className="linear-text-small-medium text-linear-text-primary">학습 알림</div>
                  <div className="linear-text-caption text-linear-text-quaternary mt-0.5">매일 오후 8시 학습 리마인더</div>
                </div>
              </div>
              <ToggleSwitchInline defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-[8px] bg-linear-status-emerald/10 flex items-center justify-center">
                  <Mail size={16} strokeWidth={1.5} className="text-linear-status-emerald" />
                </div>
                <div>
                  <div className="linear-text-small-medium text-linear-text-primary">이메일 수신</div>
                  <div className="linear-text-caption text-linear-text-quaternary mt-0.5">주간 성적 리포트 및 공지사항</div>
                </div>
              </div>
              <ToggleSwitchInline defaultChecked={false} />
            </div>
          </div>
        </SurfacePanel>

        {/* Danger Zone */}
        <div className="pb-8">
          <button className="text-xs text-[#62666d] hover:text-red-400 transition-colors">
            계정 탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}

// Inline toggle to avoid prop type issues
function ToggleSwitchInline({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => setChecked(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full border transition-colors focus:outline-none ${
        checked
          ? "border-linear-brand-indigo bg-linear-brand-indigo"
          : "border-border bg-white dark:border-white/12 dark:bg-white/10"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-[var(--shadow-level-1)] transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

// Export the unused component to satisfy linting
export { ToggleSwitch };
