'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Bookmark,
  BookmarkCheck,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  LayoutGrid,
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import QuestionCard, { type Question } from '@/components/exam/QuestionCard';
import QuestionNavPanel from '@/components/exam/QuestionNavPanel';
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
  const TIME_LIMIT_SECONDS = 45 * 60; // 45 minutes

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [unknowns, setUnknowns] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isQuestionPanelOpen, setIsQuestionPanelOpen] = useState(false);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitConfirm();
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleAnswer = useCallback((optionNumber: number) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionNumber }));
  }, [currentIndex]);

  const toggleBookmark = useCallback(() => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(currentIndex)) next.delete(currentIndex);
      else next.add(currentIndex);
      return next;
    });
  }, [currentIndex]);

  const toggleUnknown = useCallback(() => {
    setUnknowns((prev) => {
      const next = new Set(prev);
      if (next.has(currentIndex)) next.delete(currentIndex);
      else next.add(currentIndex);
      return next;
    });
  }, [currentIndex]);

  function handleSubmitConfirm() {
    router.push(`/exam/${examId}/result`);
  }

  const question = mockQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = TOTAL - answeredCount;
  const progress = (answeredCount / TOTAL) * 100;
  const isLowTime = timeLeft < 5 * 60;
  const isBookmarked = bookmarks.has(currentIndex);
  const isUnknown = unknowns.has(currentIndex);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#08090a]">

      {/* ── Fixed Header ─────────────────────────────────────────── */}
      <header className="flex shrink-0 flex-col border-b border-[rgba(255,255,255,0.08)] bg-[#0f1011]">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: exam info */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="hidden rounded-[6px] border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-xs text-[#8a8f98] hover:text-[#d0d6e0] transition-colors sm:flex items-center gap-1.5"
            >
              <X className="h-3.5 w-3.5" />
              나가기
            </button>
            <div className="h-4 w-px bg-[rgba(255,255,255,0.08)] hidden sm:block" />
            <div>
              <span className="text-sm font-semibold text-[#f7f8f8]">9급 국가직</span>
              <span className="mx-2 text-[#8a8f98]">·</span>
              <span className="text-sm text-[#8a8f98]">국어</span>
            </div>
          </div>

          {/* Center: question count */}
          <div className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-[#d0d6e0]">
            <span className="text-[#14b8a6] font-semibold">{currentIndex + 1}</span>
            <span className="text-[#8a8f98]"> / {TOTAL} 문제</span>
          </div>

          {/* Right: timer */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex items-center gap-2 rounded-[8px] border px-3 py-1.5 font-mono text-sm font-semibold tabular-nums',
                isLowTime
                  ? 'border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.08)] text-[#ef4444]'
                  : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#d0d6e0]'
              )}
            >
              <Clock className={cn('h-3.5 w-3.5', isLowTime ? 'text-[#ef4444]' : 'text-[#8a8f98]')} />
              {formatTime(timeLeft)}
            </div>

            {/* Mobile: open panel */}
            <button
              type="button"
              onClick={() => setIsQuestionPanelOpen(true)}
              className="flex items-center gap-1.5 rounded-[6px] border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-xs text-[#8a8f98] hover:text-[#d0d6e0] transition-colors lg:hidden"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">문제 목록</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-[rgba(255,255,255,0.04)]">
          <div
            className="h-full bg-[#0f766e] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Desktop Question Nav Panel */}
        <aside className="hidden w-[240px] shrink-0 flex-col border-r border-[rgba(255,255,255,0.08)] bg-[#0f1011] lg:flex">
          <div className="flex-1 overflow-y-auto p-4">
            <QuestionNavPanel
              totalQuestions={TOTAL}
              currentIndex={currentIndex}
              answers={answers}
              bookmarks={bookmarks}
              unknowns={unknowns}
              onSelect={(i) => setCurrentIndex(i)}
            />
          </div>

          {/* Submit button */}
          <div className="border-t border-[rgba(255,255,255,0.08)] p-4">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full rounded-[8px] bg-[#0f766e] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#115e59]"
            >
              제출하기
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Question Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto max-w-3xl">
              <QuestionCard
                question={question}
                selectedAnswer={answers[currentIndex]}
                onAnswer={handleAnswer}
              />

              {/* Action Buttons */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleBookmark}
                  className={cn(
                    'flex items-center gap-2 rounded-[6px] border px-3 py-2 text-sm transition-all',
                    isBookmarked
                      ? 'border-[rgba(20,184,166,0.4)] bg-[rgba(20,184,166,0.1)] text-[#14b8a6]'
                      : 'border-[rgba(255,255,255,0.08)] text-[#8a8f98] hover:border-[rgba(255,255,255,0.2)] hover:text-[#d0d6e0]'
                  )}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">북마크</span>
                </button>

                <button
                  type="button"
                  onClick={toggleUnknown}
                  className={cn(
                    'flex items-center gap-2 rounded-[6px] border px-3 py-2 text-sm transition-all',
                    isUnknown
                      ? 'border-[rgba(245,158,11,0.4)] bg-[rgba(245,158,11,0.1)] text-amber-400'
                      : 'border-[rgba(255,255,255,0.08)] text-[#8a8f98] hover:border-[rgba(255,255,255,0.2)] hover:text-[#d0d6e0]'
                  )}
                >
                  <HelpCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">모르는 문제</span>
                </button>

                {/* Mobile submit */}
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="ml-auto flex items-center gap-1.5 rounded-[6px] border border-[rgba(15,118,110,0.3)] bg-[rgba(15,118,110,0.08)] px-3 py-2 text-sm text-[#14b8a6] transition-all hover:bg-[rgba(15,118,110,0.16)] lg:hidden"
                >
                  제출하기
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="shrink-0 border-t border-[rgba(255,255,255,0.08)] bg-[#0f1011] px-4 py-3 md:px-8">
            <div className="mx-auto flex max-w-3xl items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 rounded-[8px] border border-[rgba(255,255,255,0.08)] px-4 py-2.5 text-sm font-medium text-[#d0d6e0] transition-all hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.04)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </button>

              {/* Center indicators */}
              <div className="hidden items-center gap-1 sm:flex">
                {Array.from({ length: Math.min(TOTAL, 7) }, (_, i) => {
                  const startIdx = Math.max(0, Math.min(currentIndex - 3, TOTAL - 7));
                  const qIdx = startIdx + i;
                  if (qIdx >= TOTAL) return null;
                  const isAnswered = qIdx in answers;
                  const isCurr = qIdx === currentIndex;
                  return (
                    <button
                      key={qIdx}
                      type="button"
                      onClick={() => setCurrentIndex(qIdx)}
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-all',
                        isCurr
                          ? 'bg-[#0f766e] text-white'
                          : isAnswered
                            ? 'bg-[rgba(15,118,110,0.2)] text-[#14b8a6]'
                            : 'text-[#8a8f98] hover:text-[#d0d6e0]'
                      )}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setCurrentIndex((i) => Math.min(TOTAL - 1, i + 1))}
                disabled={currentIndex === TOTAL - 1}
                className="flex items-center gap-2 rounded-[8px] border border-[rgba(255,255,255,0.08)] px-4 py-2.5 text-sm font-medium text-[#d0d6e0] transition-all hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.04)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                다음
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ── Mobile Question Panel Sheet ──────────────────────────── */}
      <Sheet open={isQuestionPanelOpen} onOpenChange={setIsQuestionPanelOpen}>
        <SheetContent side="bottom" className="bg-[#0f1011] border-t border-[rgba(255,255,255,0.08)] max-h-[80vh]">
          <SheetHeader className="border-b border-[rgba(255,255,255,0.08)] pb-3">
            <SheetTitle className="text-[#f7f8f8]">문제 목록</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto p-4">
            <QuestionNavPanel
              totalQuestions={TOTAL}
              currentIndex={currentIndex}
              answers={answers}
              bookmarks={bookmarks}
              unknowns={unknowns}
              onSelect={(i) => {
                setCurrentIndex(i);
                setIsQuestionPanelOpen(false);
              }}
            />
          </div>
          <div className="border-t border-[rgba(255,255,255,0.08)] p-4">
            <button
              type="button"
              onClick={() => {
                setIsQuestionPanelOpen(false);
                setIsSubmitModalOpen(true);
              }}
              className="w-full rounded-[8px] bg-[#0f766e] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#115e59]"
            >
              제출하기
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Submit Modal ──────────────────────────────────────────── */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="bg-[#191a1b] border border-[rgba(255,255,255,0.1)] text-[#f7f8f8] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#f7f8f8]">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              시험 제출
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <p className="text-sm text-[#d0d6e0]">
              시험을 제출하면 다시 수정할 수 없습니다. 제출하시겠습니까?
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[8px] bg-[rgba(15,118,110,0.08)] border border-[rgba(15,118,110,0.2)] p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                  <span className="text-xs text-[#8a8f98]">답변 완료</span>
                </div>
                <p className="text-xl font-bold text-[#f7f8f8]">{answeredCount}</p>
                <p className="text-xs text-[#8a8f98]">문항</p>
              </div>
              <div className="rounded-[8px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <HelpCircle className="h-4 w-4 text-[#8a8f98]" />
                  <span className="text-xs text-[#8a8f98]">미답변</span>
                </div>
                <p className="text-xl font-bold text-[#f7f8f8]">{unansweredCount}</p>
                <p className="text-xs text-[#8a8f98]">문항</p>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div className="flex items-start gap-2 rounded-[6px] bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)] px-3 py-2.5">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <p className="text-xs text-amber-300">
                  아직 {unansweredCount}개 문항에 답하지 않았습니다.
                  제출 후에는 수정이 불가능합니다.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="bg-transparent border-0 p-0 flex-row gap-2">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="flex-1 rounded-[8px] border border-[rgba(255,255,255,0.12)] py-2.5 text-sm font-medium text-[#d0d6e0] transition-colors hover:bg-[rgba(255,255,255,0.04)]"
            >
              계속 풀기
            </button>
            <button
              type="button"
              onClick={handleSubmitConfirm}
              className="flex-1 rounded-[8px] bg-[#0f766e] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#115e59]"
            >
              최종 제출
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
