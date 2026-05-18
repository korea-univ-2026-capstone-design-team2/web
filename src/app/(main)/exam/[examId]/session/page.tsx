'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import QuestionCard, { type Question } from '@/components/exam/QuestionCard';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

// ─── Mock Questions ──────────────────────────────────────────────────────────

const mockQuestions: Question[] = [
  {
    id: 'q1',
    number: 1,
    content: '다음 중 맞춤법이 올바른 것은?',
    options: ['되었다', '됬다', '돼었다', '되여다', '됩니다'],
    correctAnswer: 1,
    type: 'multiple_choice',
    subject: '국어',
    difficulty: 'easy',
  },
  {
    id: 'q2',
    number: 2,
    content: '다음 중 표준어가 아닌 것은?',
    options: ['짜장면', '자장면', '짬뽕', '볶음밥', '냉면'],
    correctAnswer: 1,
    type: 'multiple_choice',
    subject: '국어',
    difficulty: 'easy',
  },
  {
    id: 'q3',
    number: 3,
    content: '다음 중 띄어쓰기가 올바른 것은?',
    options: ['밥을먹다', '책을읽다', '집에 가다', '학교에가다', '공부를하다'],
    correctAnswer: 3,
    type: 'multiple_choice',
    subject: '국어',
    difficulty: 'medium',
  },
  {
    id: 'q4',
    number: 4,
    content: '다음 중 이중 피동 표현이 포함된 문장은?',
    options: [
      '문이 바람에 열렸다.',
      '그 일이 잘 되어졌다.',
      '책이 도서관에 반납되었다.',
      '물이 빠르게 흘렀다.',
      '꽃이 피었다.',
    ],
    correctAnswer: 2,
    type: 'multiple_choice',
    subject: '국어',
    difficulty: 'medium',
  },
  {
    id: 'q5',
    number: 5,
    content: '다음 중 높임법의 사용이 적절한 것은?',
    options: [
      '할아버지가 진지를 드신다.',
      '선생님이 집에 가다.',
      '어머니가 식사를 먹다.',
      '아버지가 말씀을 했다.',
      '할머니가 주무시다.',
    ],
    correctAnswer: 1,
    type: 'multiple_choice',
    subject: '국어',
    difficulty: 'medium',
  },
  {
    id: 'q6',
    number: 6,
    content: "다음 중 '가르치다'와 '가르키다'의 구별이 올바르게 사용된 것은?",
    options: [
      '선생님이 수학을 가르키신다.',
      '손가락으로 방향을 가르친다.',
      '선생님이 학생들을 가르친다.',
      '지도에서 위치를 가르친다.',
      '화살표로 출구를 가르키는 것은 틀렸다.',
    ],
    correctAnswer: 3,
    type: 'multiple_choice',
    subject: '국어',
    difficulty: 'hard',
  },
  {
    id: 'q7',
    number: 7,
    content: '다음 시조의 작가와 작품명이 올바르게 연결된 것은?',
    options: [
      '청산리 벽계수야 - 황진이',
      '이 몸이 죽고 죽어 - 이황',
      '동창이 밝았느냐 - 정철',
      '청구영언 - 김천택',
      '산은 옛 산이로되 - 황희',
    ],
    correctAnswer: 1,
    type: 'multiple_choice',
    subject: '국어',
    difficulty: 'hard',
  },
  {
    id: 'q8',
    number: 8,
    content: '다음 중 외래어 표기가 올바른 것은?',
    options: ['쥬스', '리더쉽', '리더십', '에너지', '쥬니어'],
    correctAnswer: 3,
    type: 'multiple_choice',
    subject: '국어',
    difficulty: 'easy',
  },
  {
    id: 'q9',
    number: 9,
    content: '다음 중 어법에 맞는 문장은?',
    options: [
      '그는 친구에게 선물을 주었다.',
      '나는 어제 도서관을 갔다.',
      '그녀는 학교에서 공부를 하였다.',
      '우리는 산에서 등산했다.',
      '철수는 영희한테 편지를 보냈었다.',
    ],
    correctAnswer: 1,
    type: 'multiple_choice',
    subject: '국어',
    difficulty: 'medium',
  },
  {
    id: 'q10',
    number: 10,
    content: "다음 한자 성어 중 '어떤 일이 일어날 조짐이나 기미'를 뜻하는 것은?",
    options: ['일촉즉발(一觸卽發)', '조짐(兆朕)', '전조(前兆)', '기미(幾微)', '징조(徵兆)'],
    correctAnswer: 3,
    type: 'multiple_choice',
    subject: '국어',
    difficulty: 'hard',
  },
  {
    id: 'q11',
    number: 11,
    content: '다음 글을 읽고 글쓴이의 주된 주장으로 가장 알맞은 것을 고르시오.',
    passage: `  현대 사회에서 독서의 중요성은 아무리 강조해도 지나치지 않다. 디지털 기기가 넘쳐나는 오늘날, 많은 사람들이 짧은 영상이나 단편적인 정보에 익숙해져 있다. 그러나 깊이 있는 사고와 풍부한 어휘력, 논리적 추론 능력은 결국 독서를 통해 길러진다.

  최근 연구에 따르면, 하루 30분 이상 책을 읽는 학생은 그렇지 않은 학생에 비해 언어 능력과 창의적 문제 해결 능력이 현저히 높은 것으로 나타났다. 독서는 단순히 정보를 습득하는 행위를 넘어, 타인의 경험과 관점을 간접적으로 체험하고 공감 능력을 키우는 중요한 수단이기도 하다.

  따라서 학교와 가정에서는 아이들이 자연스럽게 책과 친해질 수 있는 환경을 만들어야 한다. 독서는 미래를 살아갈 다음 세대에게 가장 필요한 능력을 기르는 토대가 될 것이다.`,
    options: [
      '디지털 기기 사용을 줄여야 한다.',
      '독서 교육 환경 조성이 필요하다.',
      '영상 미디어는 교육에 해롭다.',
      '학교 교육 개혁이 시급하다.',
      '창의적 문제 해결이 중요하다.',
    ],
    correctAnswer: 2,
    type: 'passage_based',
    subject: '국어',
    difficulty: 'medium',
  },
  {
    id: 'q12',
    number: 12,
    content: '윗글에서 독서의 효과로 언급되지 않은 것은?',
    passage: `  현대 사회에서 독서의 중요성은 아무리 강조해도 지나치지 않다. 디지털 기기가 넘쳐나는 오늘날, 많은 사람들이 짧은 영상이나 단편적인 정보에 익숙해져 있다. 그러나 깊이 있는 사고와 풍부한 어휘력, 논리적 추론 능력은 결국 독서를 통해 길러진다.

  최근 연구에 따르면, 하루 30분 이상 책을 읽는 학생은 그렇지 않은 학생에 비해 언어 능력과 창의적 문제 해결 능력이 현저히 높은 것으로 나타났다. 독서는 단순히 정보를 습득하는 행위를 넘어, 타인의 경험과 관점을 간접적으로 체험하고 공감 능력을 키우는 중요한 수단이기도 하다.

  따라서 학교와 가정에서는 아이들이 자연스럽게 책과 친해질 수 있는 환경을 만들어야 한다. 독서는 미래를 살아갈 다음 세대에게 가장 필요한 능력을 기르는 토대가 될 것이다.`,
    options: [
      '어휘력 향상',
      '논리적 추론 능력 향상',
      '수학적 계산 능력 향상',
      '공감 능력 향상',
      '창의적 문제 해결 능력 향상',
    ],
    correctAnswer: 3,
    type: 'passage_based',
    subject: '국어',
    difficulty: 'easy',
  },
  {
    id: 'q13',
    number: 13,
    content: '다음 중 고유어와 한자어의 연결이 바르지 않은 것은?',
    options: [
      '이름 - 명칭(名稱)',
      '하늘 - 천공(天空)',
      '바다 - 해양(海洋)',
      '사람 - 인간(人間)',
      '마음 - 심장(心臟)',
    ],
    correctAnswer: 5,
    type: 'multiple_choice',
    subject: '국어',
    difficulty: 'hard',
  },
  {
    id: 'q14',
    number: 14,
    content: '다음 중 수동태와 능동태의 전환이 올바른 것은?',
    options: [
      '경찰이 도둑을 잡았다 → 도둑이 경찰에게 잡혔다.',
      '선생님이 학생을 칭찬했다 → 학생이 선생님한테 칭찬받았다.',
      '바람이 문을 열었다 → 문이 바람에 의해 열렸다.',
      '엄마가 밥을 먹었다 → 밥이 엄마에 의해 먹혔다.',
      '이상 모두 올바르다.',
    ],
    correctAnswer: 5,
    type: 'multiple_choice',
    subject: '국어',
    difficulty: 'hard',
  },
  {
    id: 'q15',
    number: 15,
    content: '다음 중 로마자 표기가 올바른 것은?',
    options: ['서울 - Seoull', '부산 - Pusan', '인천 - Incheon', '대구 - Daegoo', '광주 - Kwangju'],
    correctAnswer: 3,
    type: 'multiple_choice',
    subject: '국어',
    difficulty: 'medium',
  },
  {
    id: 'q16',
    number: 16,
    content: "다음 중 '-(으)ㄹ 뻔하다'의 쓰임이 올바른 문장은?",
    options: [
      '그가 넘어질 뻔했다.',
      '나는 밥을 먹을 뻔했다.',
      '그녀는 공부를 할 뻔했다.',
      '우리는 영화를 볼 뻔했다.',
      '철수는 집에 갈 뻔했다.',
    ],
    correctAnswer: 1,
    type: 'multiple_choice',
    subject: '국어',
    difficulty: 'medium',
  },
  {
    id: 'q17',
    number: 17,
    content: "다음 중 '부사'가 아닌 것은?",
    options: ['매우', '빨리', '참', '아름답게', '꽤'],
    correctAnswer: 4,
    type: 'multiple_choice',
    subject: '국어',
    difficulty: 'easy',
  },
  {
    id: 'q18',
    number: 18,
    content: '다음 중 속담의 의미가 잘못 연결된 것은?',
    options: [
      '가는 말이 고와야 오는 말이 곱다 - 언행을 조심해야 한다.',
      '빈 수레가 요란하다 - 실속 없는 사람이 더 떠든다.',
      '소 잃고 외양간 고친다 - 일이 지난 후에 후회해도 소용없다.',
      '호랑이도 제 말 하면 온다 - 말을 함부로 하면 안 된다.',
      '세 살 버릇 여든까지 간다 - 어릴 때 습관이 평생 간다.',
    ],
    correctAnswer: 4,
    type: 'multiple_choice',
    subject: '국어',
    difficulty: 'medium',
  },
  {
    id: 'q19',
    number: 19,
    content: '다음 중 문장 성분 중 서술어의 자릿수가 다른 하나는?',
    options: [
      '꽃이 피었다.',
      '철수가 밥을 먹었다.',
      '하늘이 맑다.',
      '새가 날았다.',
      '비가 왔다.',
    ],
    correctAnswer: 2,
    type: 'multiple_choice',
    subject: '국어',
    difficulty: 'hard',
  },
  {
    id: 'q20',
    number: 20,
    content: '다음 중 직접 인용과 간접 인용의 전환이 올바른 것은?',
    options: [
      '그는 "나는 학생이다"라고 말했다 → 그는 자신이 학생이라고 말했다.',
      '그녀는 "나는 집에 간다"라고 했다 → 그녀는 집에 간다고 했다.',
      '선생님은 "너희가 잘했다"라고 하셨다 → 선생님은 우리가 잘했다고 하셨다.',
      '이상 모두 올바르다.',
      '이상 모두 틀렸다.',
    ],
    correctAnswer: 4,
    type: 'multiple_choice',
    subject: '국어',
    difficulty: 'hard',
  },
];

// ─── Timer Formatter ─────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ExamSessionPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;

  const TOTAL = mockQuestions.length;
  const TIME_LIMIT_SECONDS = 45 * 60;
  const QUESTIONS_PER_VIEW = 4;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isOmrPanelOpen, setIsOmrPanelOpen] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      router.push(`/exam/${examId}/result`);
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, router, examId]);

  const pageStart = Math.floor(currentIndex / QUESTIONS_PER_VIEW) * QUESTIONS_PER_VIEW;
  const visibleQuestions = mockQuestions.slice(pageStart, pageStart + QUESTIONS_PER_VIEW);
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = TOTAL - answeredCount;
  const progress = (answeredCount / TOTAL) * 100;
  const isLowTime = timeLeft < 5 * 60;

  function handleAnswer(questionIndex: number, optionNumber: number) {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionNumber }));
    setCurrentIndex(questionIndex);
  }

  function movePage(direction: 'prev' | 'next') {
    if (direction === 'prev') {
      setCurrentIndex((idx) => Math.max(0, idx - QUESTIONS_PER_VIEW));
      return;
    }
    setCurrentIndex((idx) => Math.min(TOTAL - 1, idx + QUESTIONS_PER_VIEW));
  }

  function handleSubmitConfirm() {
    router.push(`/exam/${examId}/result`);
  }

  function renderOmrPanel() {
    return (
      <div className="flex h-full flex-col rounded-[12px] border border-border bg-linear-bg-panel shadow-[var(--shadow-level-2)]">
        <div className="border-b border-border px-4 py-4">
          <div className="rounded-[10px] border border-border bg-linear-bg-surface px-3 py-3">
            <div className="text-xs text-linear-text-tertiary">제한 시간</div>
            <div className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-linear-text-secondary">
              <Clock className="h-4 w-4 text-linear-text-tertiary" />
              {formatTime(TIME_LIMIT_SECONDS)}
            </div>
            <div className="mt-2 h-px bg-border" />
            <div className="mt-2 text-xs text-linear-text-tertiary">남은 시간</div>
            <div
              className={cn(
                'mt-0.5 text-lg font-semibold tabular-nums',
                isLowTime ? 'text-red-500' : 'text-linear-brand-indigo'
              )}
            >
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="mt-3 rounded-[10px] border border-border bg-linear-bg-surface px-3 py-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-linear-text-tertiary">전체 문제</span>
              <span className="font-semibold text-linear-text-primary">{TOTAL}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-linear-text-tertiary">안 푼 문제</span>
              <span className="font-semibold text-red-500">{unansweredCount}</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/6 dark:bg-white/8">
              <div className="h-full bg-linear-brand-indigo transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="border-b border-border px-4 py-3">
          <h2 className="linear-text-small-medium text-linear-text-secondary">답안 표기란</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          <div className="space-y-1.5">
            {Array.from({ length: TOTAL }, (_, index) => {
              const selected = answers[index];
              const isCurrent = index === currentIndex;
              return (
                <div
                  key={index}
                  className={cn(
                    'grid grid-cols-[32px_1fr] items-center gap-2 rounded-[8px] border px-2 py-1.5 transition-colors',
                    isCurrent
                      ? 'border-linear-brand-indigo/40 bg-linear-brand-indigo/8'
                      : 'border-border bg-linear-bg-surface'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                      isCurrent
                        ? 'bg-linear-brand-indigo text-white'
                        : selected
                          ? 'bg-linear-brand-indigo/15 text-linear-accent-violet'
                          : 'border border-border text-linear-text-tertiary'
                    )}
                  >
                    {index + 1}
                  </button>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((choice) => {
                      const checked = selected === choice;
                      return (
                        <button
                          key={choice}
                          type="button"
                          onClick={() => handleAnswer(index, choice)}
                          className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-semibold transition-colors',
                            checked
                              ? 'border-linear-brand-indigo bg-linear-brand-indigo text-white'
                              : 'border-border bg-linear-bg-surface text-linear-text-tertiary hover:border-linear-brand-indigo/40 hover:text-linear-text-secondary'
                          )}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="w-full rounded-[8px] bg-linear-brand-indigo py-2.5 text-sm font-semibold text-white transition-colors hover:bg-linear-brand-indigo/90"
          >
            답안 제출하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-bg-marketing px-3 py-4 text-linear-text-primary md:px-6 md:py-6">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4">
        <header className="rounded-[12px] border border-border bg-linear-bg-panel px-4 py-3 shadow-[var(--shadow-level-1)]">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <p className="text-xs text-linear-text-tertiary">실전 응시</p>
              <h1 className="linear-text-body-medium text-linear-text-primary">
                9급 국가직 국어 시험
              </h1>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div
                className={cn(
                  'rounded-[8px] border px-3 py-1.5 text-sm font-semibold tabular-nums',
                  isLowTime
                    ? 'border-red-500/25 bg-red-500/8 text-red-500'
                    : 'border-border bg-linear-bg-surface text-linear-accent-violet'
                )}
              >
                남은 시간 {formatTime(timeLeft)}
              </div>
              <button
                type="button"
                onClick={() => setIsOmrPanelOpen(true)}
                className="rounded-[8px] border border-border bg-linear-bg-surface px-3 py-1.5 text-xs text-linear-text-secondary lg:hidden"
              >
                OMR 보기
              </button>
            </div>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <main className="rounded-[12px] border border-border bg-linear-bg-panel shadow-[var(--shadow-level-2)]">
            <div className="border-b border-border px-5 py-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-linear-text-tertiary">
                  현재 묶음: <span className="font-semibold text-linear-text-primary">{pageStart + 1}~{Math.min(pageStart + QUESTIONS_PER_VIEW, TOTAL)}번</span>
                </p>
                <p className="text-sm text-linear-text-tertiary">
                  진행도 <span className="font-semibold text-linear-accent-violet">{answeredCount}/{TOTAL}</span>
                </p>
              </div>
            </div>

            <div className="max-h-[calc(100vh-210px)] space-y-4 overflow-y-auto px-5 py-5">
              {visibleQuestions.map((question, idx) => {
                const absoluteIndex = pageStart + idx;
                const isCurrent = absoluteIndex === currentIndex;
                return (
                  <section
                    key={question.id}
                    className={cn(
                      'rounded-[12px] border p-4 md:p-5',
                      isCurrent
                        ? 'border-linear-brand-indigo/35 bg-linear-brand-indigo/6'
                        : 'border-border bg-linear-bg-surface'
                    )}
                  >
                    <QuestionCard
                      question={question}
                      selectedAnswer={answers[absoluteIndex]}
                      onAnswer={(optionNumber) => handleAnswer(absoluteIndex, optionNumber)}
                    />
                  </section>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-border px-5 py-3">
              <button
                type="button"
                onClick={() => movePage('prev')}
                disabled={pageStart === 0}
                className="inline-flex items-center gap-1.5 rounded-[8px] border border-border bg-linear-bg-surface px-3 py-2 text-sm text-linear-text-secondary transition-colors hover:bg-black/3 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/6"
              >
                <ChevronLeft className="h-4 w-4" />
                이전 묶음
              </button>

              <button
                type="button"
                onClick={() => movePage('next')}
                disabled={pageStart + QUESTIONS_PER_VIEW >= TOTAL}
                className="inline-flex items-center gap-1.5 rounded-[8px] border border-border bg-linear-bg-surface px-3 py-2 text-sm text-linear-text-secondary transition-colors hover:bg-black/3 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/6"
              >
                다음 묶음
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </main>

          <aside className="hidden h-[calc(100vh-170px)] lg:block">
            {renderOmrPanel()}
          </aside>
        </div>
      </div>

      <Sheet open={isOmrPanelOpen} onOpenChange={setIsOmrPanelOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-hidden rounded-t-[16px] border-t border-border bg-linear-bg-marketing p-0">
          <SheetHeader className="border-b border-border px-4 py-3">
            <SheetTitle className="text-linear-text-primary">OMR 답안 표기란</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(85vh-60px)] p-3">
            {renderOmrPanel()}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="sm:max-w-md border border-border bg-linear-bg-panel text-linear-text-primary">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-linear-text-primary">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              시험 제출
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <p className="text-sm text-linear-text-secondary">
              시험을 제출하면 더 이상 수정할 수 없습니다.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[8px] border border-linear-brand-indigo/25 bg-linear-brand-indigo/10 p-3 text-center">
                <span className="text-xs text-linear-text-tertiary">답변 완료</span>
                <p className="mt-1 text-2xl font-bold text-linear-text-primary">{answeredCount}</p>
              </div>
              <div className="rounded-[8px] border border-border bg-linear-bg-surface p-3 text-center">
                <span className="text-xs text-linear-text-tertiary">미응답</span>
                <p className="mt-1 text-2xl font-bold text-red-500">{unansweredCount}</p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-row gap-2">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="flex-1 rounded-[8px] border border-border bg-linear-bg-surface py-2.5 text-sm text-linear-text-secondary transition-colors hover:bg-black/3 dark:hover:bg-white/6"
            >
              계속 풀기
            </button>
            <button
              type="button"
              onClick={handleSubmitConfirm}
              className="flex-1 rounded-[8px] bg-linear-brand-indigo py-2.5 text-sm font-semibold text-white transition-colors hover:bg-linear-brand-indigo/90"
            >
              최종 제출
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
