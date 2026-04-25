import Link from "next/link";
import {
  BarChart3,
  Target,
  Timer,
  TrendingUp,
  BookMarked,
  Smartphone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const features = [
  {
    icon: BarChart3,
    title: "취약 단원 리포트",
    description: "오답 패턴을 정리해 먼저 보완할 단원을 알려줍니다",
  },
  {
    icon: Target,
    title: "맞춤 문제",
    description: "학습 기록을 바탕으로 지금 풀 문제를 우선순위로 제공합니다",
  },
  {
    icon: Timer,
    title: "실전형 CBT",
    description: "실제 시험과 동일한 환경에서 연습합니다",
  },
  {
    icon: TrendingUp,
    title: "성적 추이 리포트",
    description: "일간·주간 성적 흐름을 확인하고 학습 전략을 점검합니다",
  },
  {
    icon: BookMarked,
    title: "오답 노트",
    description: "틀린 문제를 모아 집중 복습합니다",
  },
  {
    icon: Smartphone,
    title: "모바일 최적화",
    description: "언제 어디서나 학습할 수 있습니다",
  },
];

const examCategories = [
  {
    name: "9급 국가직",
    subjects: ["국어", "영어", "한국사", "행정학", "행정법"],
    popular: true,
    count: "18,000+",
  },
  {
    name: "9급 지방직",
    subjects: ["국어", "영어", "한국사", "사회", "수학"],
    popular: false,
    count: "12,000+",
  },
  {
    name: "경찰 공채",
    subjects: ["형사법", "경찰학", "헌법", "범죄학"],
    popular: false,
    count: "8,500+",
  },
  {
    name: "소방 공채",
    subjects: ["소방학", "소방관계법", "행정법", "국어"],
    popular: false,
    count: "6,200+",
  },
  {
    name: "5급 PSAT",
    subjects: ["언어논리", "자료해석", "상황판단"],
    popular: false,
    count: "4,800+",
  },
  {
    name: "전산직 9급",
    subjects: ["컴퓨터일반", "정보보호론", "국어", "영어"],
    popular: false,
    count: "3,500+",
  },
];

const stats = [
  { label: "총 문제 수", value: "50,000+", sub: "매주 업데이트" },
  { label: "누적 사용자", value: "12만+", sub: "공무원 수험생" },
  { label: "평균 성적 향상", value: "23점", sub: "3개월 기준" },
];

const todayPlan = [
  { label: "행정법", detail: "행정행위 효력 20문제" },
  { label: "영어", detail: "독해 세트 2회" },
  { label: "국어", detail: "어휘·문법 오답 복습" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-bg-marketing text-linear-text-primary">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-semibold text-sm lowercase tracking-tight text-linear-brand-indigo">
              oh-my-study
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              <Link href="#features" className="text-sm text-linear-text-tertiary transition-colors hover:text-linear-text-primary">
                기능소개
              </Link>
              <Link href="#exams" className="text-sm text-linear-text-tertiary transition-colors hover:text-linear-text-primary">
                시험 종류
              </Link>
              <Link href="#cta" className="text-sm text-linear-text-tertiary transition-colors hover:text-linear-text-primary">
                시작하기
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="rounded-[8px] px-3 py-2 text-sm text-linear-text-tertiary transition-colors hover:text-linear-text-primary">
              로그인
            </Link>
            <Link
              href="/signup"
              className="rounded-[8px] bg-linear-brand-indigo px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-linear-accent-hover"
            >
              시작하기
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <section className="relative isolate overflow-hidden px-6 py-20 sm:py-28">
          <div className="absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(circle_at_14%_18%,rgba(15,118,110,0.16),transparent_40%),radial-gradient(circle_at_86%_14%,rgba(20,184,166,0.14),transparent_36%),radial-gradient(circle_at_70%_75%,rgba(16,185,129,0.12),transparent_40%)]" />
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-1.5 text-xs text-linear-text-tertiary dark:bg-white/5">
                <span className="h-1.5 w-1.5 rounded-full bg-linear-status-emerald" />
                공무원 수험생 학습 플랫폼
              </div>

              <h1 className="mb-6 text-balance text-4xl font-semibold leading-tight tracking-tight text-linear-text-primary md:text-6xl">
                공무원 시험 준비,
                <br />
                <span className="text-linear-accent-violet">오늘 할 일부터 분명하게</span>
              </h1>

              <p className="mb-10 max-w-2xl text-lg leading-relaxed text-linear-text-tertiary md:text-xl">
                취약 단원 점검, 문제 추천, 실전 CBT, 성적 추이까지.
                <br className="hidden sm:block" />
                필요한 흐름을 한 화면에서 이어서 학습할 수 있습니다.
              </p>

              <div className="flex flex-col items-center justify-start gap-3 sm:flex-row sm:items-stretch">
                <Link
                  href="/signup"
                  className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-linear-brand-indigo px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-linear-accent-hover sm:w-auto"
                >
                  무료로 시작하기
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/exam"
                  className="flex w-full items-center justify-center gap-2 rounded-[8px] border border-border bg-white/70 px-6 py-3 text-sm font-medium text-linear-text-secondary transition-colors hover:bg-white/90 dark:bg-white/5 dark:hover:bg-white/10 sm:w-auto"
                >
                  데모 체험
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-linear-text-quaternary">
                {["9급 국가직", "9급 지방직", "경찰 공채", "소방 공채", "5급 PSAT"].map((item) => (
                  <span key={item} className="rounded-full border border-border bg-white/60 px-3 py-1 dark:bg-white/5">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <aside className="rounded-[14px] border border-border bg-white/80 p-6 shadow-[var(--shadow-level-2)] dark:bg-white/3">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-linear-text-quaternary">Today</p>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-linear-text-primary">오늘의 학습 플랜</h2>
              <ul className="space-y-3">
                {todayPlan.map((item) => (
                  <li key={item.label} className="flex items-start gap-3 rounded-[8px] border border-border bg-background/70 p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-linear-accent-violet" />
                    <div>
                      <p className="text-sm font-medium text-linear-text-primary">{item.label}</p>
                      <p className="text-xs text-linear-text-tertiary">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-linear-accent-violet transition-colors hover:text-linear-brand-indigo"
              >
                학습 이어서 하기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </section>

        <section className="border-y border-border bg-linear-bg-panel px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-border">
              {stats.map((stat) => (
                <div key={stat.label} className="px-8 text-center">
                  <div className="mb-1 text-4xl font-semibold tracking-tight text-linear-text-primary">{stat.value}</div>
                  <div className="mb-0.5 text-sm font-medium text-linear-text-secondary">{stat.label}</div>
                  <div className="text-xs text-linear-text-quaternary">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <div className="mb-3 inline-block text-xs font-medium uppercase tracking-widest text-linear-accent-violet">기능소개</div>
              <h2 className="mb-4 text-3xl font-semibold tracking-tight text-linear-text-primary md:text-5xl">학습 흐름이 끊기지 않게</h2>
              <p className="mx-auto max-w-xl text-linear-text-tertiary">계획부터 풀이, 복습, 추이 확인까지 하나의 루틴으로 연결됩니다.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <article
                    key={feature.title}
                    className="group rounded-[12px] border border-border bg-white/70 p-6 shadow-[var(--shadow-level-1)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[var(--shadow-level-2)] dark:bg-white/2 dark:hover:bg-white/5"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px] bg-linear-brand-indigo/15 transition-colors group-hover:bg-linear-brand-indigo/20">
                      <Icon className="h-5 w-5 text-linear-accent-violet" />
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-linear-text-primary">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-linear-text-tertiary">{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="exams" className="bg-linear-bg-panel px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <div className="mb-3 inline-block text-xs font-medium uppercase tracking-widest text-linear-accent-violet">시험 종류</div>
              <h2 className="mb-4 text-3xl font-semibold tracking-tight text-linear-text-primary md:text-5xl">지원 시험 범위를 확인하세요</h2>
              <p className="mx-auto max-w-xl text-linear-text-tertiary">주요 공무원 시험 전 영역의 문제를 제공합니다.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {examCategories.map((exam) => (
                <article
                  key={exam.name}
                  className="group relative rounded-[12px] border border-border bg-white/70 p-6 shadow-[var(--shadow-level-1)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[var(--shadow-level-2)] dark:bg-white/2 dark:hover:bg-white/5"
                >
                  {exam.popular && (
                    <span className="absolute right-4 top-4 rounded-full border border-linear-brand-indigo/30 bg-linear-brand-indigo/10 px-2 py-0.5 text-[10px] font-semibold text-linear-accent-violet">
                      인기
                    </span>
                  )}

                  <h3 className="mb-1 pr-12 text-base font-semibold text-linear-text-primary">{exam.name}</h3>
                  <div className="mb-4 text-xs text-linear-text-quaternary">{exam.count} 문제</div>

                  <div className="flex flex-wrap gap-1.5">
                    {exam.subjects.map((subject) => (
                      <span key={subject} className="rounded-[6px] border border-border bg-background/70 px-2 py-0.5 text-[11px] text-linear-text-tertiary">
                        {subject}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-xs text-linear-text-quaternary transition-colors group-hover:text-linear-accent-violet">
                    <span>학습 시작</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-[16px] border border-linear-brand-indigo/20 bg-linear-brand-indigo/5 px-6 py-14 text-center shadow-[var(--shadow-level-2)] sm:px-12">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-linear-brand-indigo/8 via-transparent to-linear-status-emerald/6" />
              <div className="relative z-10">
                <h2 className="mb-4 text-3xl font-semibold tracking-tight text-linear-text-primary md:text-5xl">지금 학습 루틴을 시작해보세요</h2>
                <p className="mx-auto mb-8 max-w-lg text-linear-text-tertiary">
                  가입 후 바로 진단부터 풀이, 복습 루틴까지 이어서 학습할 수 있습니다.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-[8px] bg-linear-brand-indigo px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-linear-accent-hover"
                >
                  무료로 회원가입
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-linear-bg-panel px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <div className="mb-2 text-sm font-semibold lowercase tracking-tight text-linear-brand-indigo">oh-my-study</div>
              <p className="max-w-xs text-xs text-linear-text-quaternary">
                공무원 시험 CBT 학습 플랫폼.
                <br />
                스마트한 학습으로 합격을 앞당기세요.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {["서비스 소개", "개인정보 처리방침", "이용약관", "고객센터"].map((label) => (
                <Link key={label} href="#" className="text-xs text-linear-text-quaternary transition-colors hover:text-linear-text-tertiary">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-6 text-xs text-linear-text-quaternary">© 2026 oh-my-study. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
