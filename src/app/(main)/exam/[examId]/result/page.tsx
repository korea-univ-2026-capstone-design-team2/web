'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  TrendingUp,
  Bot,
  RotateCcw,
  LayoutDashboard,
  Zap,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import AnswerOption from '@/components/exam/AnswerOption';
import type { Question } from '@/components/exam/QuestionCard';

// ─── Mock Result Data ────────────────────────────────────────────────────────

const mockQuestions: Question[] = [
  { id: 'q1', number: 1, content: '다음 중 맞춤법이 올바른 것은?', options: ['되었다', '됬다', '돼었다', '되여다', '됩니다'], correctAnswer: 1, type: 'multiple_choice', subject: '국어', difficulty: 'easy' },
  { id: 'q2', number: 2, content: '다음 중 표준어가 아닌 것은?', options: ['짜장면', '자장면', '짬뽕', '볶음밥', '냉면'], correctAnswer: 1, type: 'multiple_choice', subject: '국어', difficulty: 'easy' },
  { id: 'q3', number: 3, content: '다음 중 띄어쓰기가 올바른 것은?', options: ['밥을먹다', '책을읽다', '집에 가다', '학교에가다', '공부를하다'], correctAnswer: 3, type: 'multiple_choice', subject: '국어', difficulty: 'medium' },
  { id: 'q4', number: 4, content: '다음 중 이중 피동 표현이 포함된 문장은?', options: ['문이 바람에 열렸다.', '그 일이 잘 되어졌다.', '책이 도서관에 반납되었다.', '물이 빠르게 흘렀다.', '꽃이 피었다.'], correctAnswer: 2, type: 'multiple_choice', subject: '국어', difficulty: 'medium' },
  { id: 'q5', number: 5, content: '다음 중 높임법의 사용이 적절한 것은?', options: ['할아버지가 진지를 드신다.', '선생님이 집에 가다.', '어머니가 식사를 먹다.', '아버지가 말씀을 했다.', '할머니가 주무시다.'], correctAnswer: 1, type: 'multiple_choice', subject: '국어', difficulty: 'medium' },
  { id: 'q6', number: 6, content: "다음 중 '가르치다'와 '가르키다'의 구별이 올바르게 사용된 것은?", options: ['선생님이 수학을 가르키신다.', '손가락으로 방향을 가르친다.', '선생님이 학생들을 가르친다.', '지도에서 위치를 가르친다.', '화살표로 출구를 가르키는 것은 틀렸다.'], correctAnswer: 3, type: 'multiple_choice', subject: '국어', difficulty: 'hard' },
  { id: 'q7', number: 7, content: '다음 중 시조의 작가와 작품명이 올바르게 연결된 것은?', options: ['청산리 벽계수야 - 황진이', '이 몸이 죽고 죽어 - 이황', '동창이 밝았느냐 - 정철', '청구영언 - 김천택', '산은 옛 산이로되 - 황희'], correctAnswer: 1, type: 'multiple_choice', subject: '국어', difficulty: 'hard' },
  { id: 'q8', number: 8, content: '다음 중 외래어 표기가 올바른 것은?', options: ['쥬스', '리더쉽', '리더십', '에너지', '쥬니어'], correctAnswer: 3, type: 'multiple_choice', subject: '국어', difficulty: 'easy' },
  { id: 'q9', number: 9, content: '다음 중 어법에 맞는 문장은?', options: ['그는 친구에게 선물을 주었다.', '나는 어제 도서관을 갔다.', '그녀는 학교에서 공부를 하였다.', '우리는 산에서 등산했다.', '철수는 영희한테 편지를 보냈었다.'], correctAnswer: 1, type: 'multiple_choice', subject: '국어', difficulty: 'medium' },
  { id: 'q10', number: 10, content: "다음 중 '어떤 일이 일어날 조짐이나 기미'를 뜻하는 한자 성어는?", options: ['일촉즉발(一觸卽發)', '조짐(兆朕)', '전조(前兆)', '기미(幾微)', '징조(徵兆)'], correctAnswer: 3, type: 'multiple_choice', subject: '국어', difficulty: 'hard' },
  { id: 'q11', number: 11, content: '다음 글을 읽고 글쓴이의 주된 주장으로 가장 알맞은 것을 고르시오.', options: ['디지털 기기 사용을 줄여야 한다.', '독서 교육 환경 조성이 필요하다.', '영상 미디어는 교육에 해롭다.', '학교 교육 개혁이 시급하다.', '창의적 문제 해결이 중요하다.'], correctAnswer: 2, type: 'multiple_choice', subject: '국어', difficulty: 'medium' },
  { id: 'q12', number: 12, content: '독서의 효과로 언급되지 않은 것은?', options: ['어휘력 향상', '논리적 추론 능력 향상', '수학적 계산 능력 향상', '공감 능력 향상', '창의적 문제 해결 능력 향상'], correctAnswer: 3, type: 'multiple_choice', subject: '국어', difficulty: 'easy' },
  { id: 'q13', number: 13, content: '다음 중 고유어와 한자어의 연결이 바르지 않은 것은?', options: ['이름 - 명칭(名稱)', '하늘 - 천공(天空)', '바다 - 해양(海洋)', '사람 - 인간(人間)', '마음 - 심장(心臟)'], correctAnswer: 5, type: 'multiple_choice', subject: '국어', difficulty: 'hard' },
  { id: 'q14', number: 14, content: '다음 중 수동태와 능동태의 전환이 올바른 것은?', options: ['경찰이 도둑을 잡았다 → 도둑이 경찰에게 잡혔다.', '선생님이 학생을 칭찬했다 → 학생이 선생님한테 칭찬받았다.', '바람이 문을 열었다 → 문이 바람에 의해 열렸다.', '엄마가 밥을 먹었다 → 밥이 엄마에 의해 먹혔다.', '이상 모두 올바르다.'], correctAnswer: 5, type: 'multiple_choice', subject: '국어', difficulty: 'hard' },
  { id: 'q15', number: 15, content: '다음 중 로마자 표기가 올바른 것은?', options: ['서울 - Seoull', '부산 - Pusan', '인천 - Incheon', '대구 - Daegoo', '광주 - Kwangju'], correctAnswer: 3, type: 'multiple_choice', subject: '국어', difficulty: 'medium' },
  { id: 'q16', number: 16, content: "다음 중 '-(으)ㄹ 뻔하다'의 쓰임이 올바른 문장은?", options: ['그가 넘어질 뻔했다.', '나는 밥을 먹을 뻔했다.', '그녀는 공부를 할 뻔했다.', '우리는 영화를 볼 뻔했다.', '철수는 집에 갈 뻔했다.'], correctAnswer: 1, type: 'multiple_choice', subject: '국어', difficulty: 'medium' },
  { id: 'q17', number: 17, content: "다음 중 '부사'가 아닌 것은?", options: ['매우', '빨리', '참', '아름답게', '꽤'], correctAnswer: 4, type: 'multiple_choice', subject: '국어', difficulty: 'easy' },
  { id: 'q18', number: 18, content: '다음 중 속담의 의미가 잘못 연결된 것은?', options: ['가는 말이 고와야 오는 말이 곱다 - 언행을 조심해야 한다.', '빈 수레가 요란하다 - 실속 없는 사람이 더 떠든다.', '소 잃고 외양간 고친다 - 일이 지난 후에 후회해도 소용없다.', '호랑이도 제 말 하면 온다 - 말을 함부로 하면 안 된다.', '세 살 버릇 여든까지 간다 - 어릴 때 습관이 평생 간다.'], correctAnswer: 4, type: 'multiple_choice', subject: '국어', difficulty: 'medium' },
  { id: 'q19', number: 19, content: '다음 중 문장 성분 중 서술어의 자릿수가 다른 하나는?', options: ['꽃이 피었다.', '철수가 밥을 먹었다.', '하늘이 맑다.', '새가 날았다.', '비가 왔다.'], correctAnswer: 2, type: 'multiple_choice', subject: '국어', difficulty: 'hard' },
  { id: 'q20', number: 20, content: '다음 중 직접 인용과 간접 인용의 전환이 올바른 것은?', options: ['그는 "나는 학생이다"라고 말했다 → 그는 자신이 학생이라고 말했다.', '그녀는 "나는 집에 간다"라고 했다 → 그녀는 집에 간다고 했다.', '선생님은 "너희가 잘했다"라고 하셨다 → 선생님은 우리가 잘했다고 하셨다.', '이상 모두 올바르다.', '이상 모두 틀렸다.'], correctAnswer: 4, type: 'multiple_choice', subject: '국어', difficulty: 'hard' },
];

// Simulated user answers (some right, some wrong)
const userAnswers: Record<number, number> = {
  0: 1, 1: 1, 2: 3, 3: 1, 4: 1,
  5: 3, 6: 1, 7: 3, 8: 1, 9: 4,
  10: 2, 11: 3, 12: 5, 13: 5, 14: 3,
  15: 1, 16: 4, 17: 4, 18: 4, 19: 4,
};

const EXAM_DURATION_SECONDS = 42 * 60 + 18;
const EXAM_DATE = '2026-04-02 14:30';

const explanations: Record<string, string> = {
  q3: '맞춤법에서 띄어쓰기는 단어 단위로 해야 합니다. "집에 가다"는 "집에"와 "가다"가 각각 독립적인 단어이므로 띄어 씁니다.',
  q4: '이중 피동은 피동 표현을 이중으로 사용하는 비문입니다. "되어졌다"는 "되다" + "지다"의 이중 피동 표현으로 "되었다"로 고쳐야 합니다.',
  q9: '서술어의 자릿수란 서술어가 필요로 하는 문장 성분의 수입니다. "먹다"는 주어와 목적어 두 자리 서술어이고, 나머지는 한 자리 서술어입니다.',
  q15: '-(으)ㄹ 뻔하다는 실제로 일어날 뻔한 일을 나타냅니다. 일어날 가능성이 없는 평범한 행위에는 쓰지 않습니다.',
  q17: '"아름답게"는 형용사 "아름답다"의 부사형으로, 부사가 아닌 부사형 어미가 붙은 용언입니다.',
};

// ─── Recharts Custom Tooltip ─────────────────────────────────────────────────

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[6px] bg-[#28282c] border border-[rgba(255,255,255,0.12)] px-3 py-2 text-xs">
      <p className="text-[#8a8f98] mb-0.5">{label}</p>
      <p className="font-semibold text-[#14b8a6]">{payload[0].value}점</p>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ResultPage() {
  const results = useMemo(() => {
    return mockQuestions.map((q, i) => {
      const myAnswer = userAnswers[i];
      const isCorrect = myAnswer === q.correctAnswer;
      return { question: q, myAnswer, isCorrect };
    });
  }, []);

  const correctCount = useMemo(() => results.filter((r) => r.isCorrect).length, [results]);
  const totalCount = mockQuestions.length;
  const score = Math.round((correctCount / totalCount) * 100);
  const wrongResults = useMemo(() => results.filter((r) => !r.isCorrect), [results]);

  const subjectData = useMemo(() => {
    const subjectMap: Record<string, { correct: number; total: number }> = {};
    results.forEach(({ question, isCorrect }) => {
      if (!subjectMap[question.subject]) {
        subjectMap[question.subject] = { correct: 0, total: 0 };
      }
      subjectMap[question.subject].total += 1;
      if (isCorrect) subjectMap[question.subject].correct += 1;
    });
    return Object.entries(subjectMap).map(([subject, { correct, total }]) => ({
      subject,
      score: Math.round((correct / total) * 100),
      correct,
      total,
    }));
  }, [results]);

  const formattedDuration = useMemo(() => {
    const m = Math.floor(EXAM_DURATION_SECONDS / 60);
    const s = EXAM_DURATION_SECONDS % 60;
    return `${m}분 ${s}초`;
  }, []);

  const scoreColor =
    score >= 80 ? 'text-[#10b981]' : score >= 60 ? 'text-amber-400' : 'text-[#ef4444]';

  return (
    <div className="min-h-screen bg-[#08090a] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* ── Section 1: Score Summary ─────────────────────────── */}
        <div className="rounded-[8px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-6 text-center">
          <p className="mb-4 text-2xl">축하합니다!</p>
          <div className={cn('mb-1 text-7xl font-bold tabular-nums tracking-tight', scoreColor)}>
            {score}
            <span className="text-4xl">점</span>
          </div>
          <p className="mb-6 text-sm text-[#8a8f98]">
            {correctCount} / {totalCount}문항 정답 ({((correctCount / totalCount) * 100).toFixed(1)}%)
          </p>

          <div className="mx-auto flex w-full max-w-xs justify-center gap-6 text-sm">
            <div className="flex items-center gap-1.5 text-[#8a8f98]">
              <Clock className="h-4 w-4" />
              <span>{formattedDuration}</span>
            </div>
            <div className="h-4 w-px bg-[rgba(255,255,255,0.08)]" />
            <div className="flex items-center gap-1.5 text-[#8a8f98]">
              <Calendar className="h-4 w-4" />
              <span>{EXAM_DATE}</span>
            </div>
          </div>

          {/* Score band indicator */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-2 flex-1 rounded-full bg-[rgba(239,68,68,0.3)]" style={{ maxWidth: 60 }} />
            <div className="h-2 flex-1 rounded-full bg-[rgba(245,158,11,0.4)]" style={{ maxWidth: 80 }} />
            <div
              className={cn(
                'relative h-3 flex-1 rounded-full',
                score >= 80 ? 'bg-[#10b981]' : score >= 60 ? 'bg-amber-400' : 'bg-[#ef4444]'
              )}
              style={{ maxWidth: `${score * 1.2}px`, minWidth: 20 }}
            >
              <span className="absolute -top-5 right-0 text-xs font-semibold text-[#d0d6e0]">
                {score}
              </span>
            </div>
            <div className="h-2 flex-1 rounded-full bg-[rgba(16,185,129,0.3)]" style={{ maxWidth: 60 }} />
          </div>
        </div>

        {/* ── Section 2: Subject Score Chart ──────────────────── */}
        <div className="rounded-[8px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#14b8a6]" />
            <h2 className="text-sm font-semibold text-[#f7f8f8]">과목별 점수</h2>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={subjectData}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="subject"
                tick={{ fill: '#8a8f98', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#8a8f98', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {subjectData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.score >= 80 ? '#10b981' : entry.score >= 60 ? '#0f766e' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Section 3: Question Table ────────────────────────── */}
        <div className="rounded-[8px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.08)] px-5 py-3.5">
            <h2 className="text-sm font-semibold text-[#f7f8f8]">문항별 결과</h2>
            <span className="ml-auto text-xs text-[#8a8f98]">
              총 {totalCount}문항
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)]">
                  <th className="px-5 py-2.5 text-left text-xs font-medium text-[#8a8f98]">번호</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-[#8a8f98]">내 답</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-[#8a8f98]">정답</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-[#8a8f98]">결과</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-[#8a8f98]">난이도</th>
                </tr>
              </thead>
              <tbody>
                {results.map(({ question, myAnswer, isCorrect }, i) => (
                  <tr
                    key={question.id}
                    className={cn(
                      'border-b border-[rgba(255,255,255,0.04)] transition-colors',
                      isCorrect
                        ? 'bg-[rgba(16,185,129,0.02)] hover:bg-[rgba(16,185,129,0.04)]'
                        : 'bg-[rgba(239,68,68,0.02)] hover:bg-[rgba(239,68,68,0.04)]'
                    )}
                  >
                    <td className="px-5 py-2.5 text-[#d0d6e0] font-medium">{i + 1}</td>
                    <td className="px-3 py-2.5">
                      <span
                        className={cn(
                          'font-medium',
                          isCorrect ? 'text-[#10b981]' : 'text-[#ef4444]'
                        )}
                      >
                        {myAnswer ?? '-'}번
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-medium text-[#10b981]">
                      {question.correctAnswer}번
                    </td>
                    <td className="px-3 py-2.5">
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-[#10b981]">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-xs">정답</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[#ef4444]">
                          <XCircle className="h-4 w-4" />
                          <span className="text-xs">오답</span>
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs',
                          question.difficulty === 'easy'
                            ? 'bg-[rgba(16,185,129,0.1)] text-[#10b981]'
                            : question.difficulty === 'medium'
                              ? 'bg-[rgba(245,158,11,0.1)] text-amber-400'
                              : 'bg-[rgba(239,68,68,0.1)] text-[#ef4444]'
                        )}
                      >
                        {question.difficulty === 'easy' ? '하' : question.difficulty === 'medium' ? '중' : '상'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Section 4: Wrong Answer Analysis ────────────────── */}
        {wrongResults.length > 0 && (
          <div className="rounded-[8px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] overflow-hidden">
            <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.08)] px-5 py-3.5">
              <XCircle className="h-4 w-4 text-[#ef4444]" />
              <h2 className="text-sm font-semibold text-[#f7f8f8]">
                오답 풀이{' '}
                <span className="text-[#8a8f98] font-normal">({wrongResults.length}문제)</span>
              </h2>
            </div>
            <Accordion className="divide-y divide-[rgba(255,255,255,0.04)]">
              {wrongResults.map(({ question, myAnswer }, idx) => (
                <AccordionItem key={question.id} value={question.id}>
                  <div className="px-5">
                    <AccordionTrigger className="py-3 text-sm text-[#d0d6e0] hover:no-underline hover:text-[#f7f8f8]">
                      <div className="flex items-center gap-2 text-left">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(239,68,68,0.15)] text-[10px] font-semibold text-[#ef4444] shrink-0">
                          {question.number}
                        </span>
                        <span className="line-clamp-1">{question.content}</span>
                      </div>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent className="px-5 pb-4">
                    <div className="space-y-2">
                      {question.options.map((opt, i) => {
                        const optNum = (i + 1) as 1 | 2 | 3 | 4 | 5;
                        const isCorrect = question.correctAnswer === optNum;
                        const isWrong = myAnswer === optNum && myAnswer !== question.correctAnswer;
                        return (
                          <AnswerOption
                            key={i}
                            number={optNum}
                            text={opt}
                            isSelected={myAnswer === optNum}
                            isCorrect={isCorrect}
                            isWrong={isWrong}
                            resultMode
                          />
                        );
                      })}
                    </div>
                    {explanations[question.id] && (
                      <div className="mt-3 rounded-[6px] border border-[rgba(20,184,166,0.2)] bg-[rgba(20,184,166,0.06)] px-4 py-3">
                        <p className="text-xs font-medium text-[#14b8a6] mb-1">해설</p>
                        <p className="text-sm leading-relaxed text-[#d0d6e0]">
                          {explanations[question.id]}
                        </p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {/* ── Section 5: AI Analysis ───────────────────────────── */}
        <div className="rounded-[8px] border border-[rgba(20,184,166,0.2)] bg-[rgba(20,184,166,0.04)] p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(20,184,166,0.15)]">
              <Bot className="h-4 w-4 text-[#14b8a6]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#f7f8f8]">AI 분석</p>
              <p className="text-xs text-[#8a8f98]">학습 패턴 기반 맞춤 분석</p>
            </div>
          </div>
          <p className="text-sm leading-7 text-[#d0d6e0]">
            이번 시험에서{' '}
            <span className="font-semibold text-[#f7f8f8]">어법/맞춤법 영역</span>이 취약점으로
            분석됩니다. 전체 오답 {wrongResults.length}개 중{' '}
            <span className="text-[#ef4444] font-medium">
              {wrongResults.filter((r) => ['q4', 'q3', 'q6', 'q18'].includes(r.question.id)).length}개
            </span>
            가 해당 단원에서 발생했습니다.
            <br />
            다음 학습 시{' '}
            <span className="font-medium text-[#14b8a6]">&#39;표준어 규정&#39;</span>과{' '}
            <span className="font-medium text-[#14b8a6]">&#39;한글 맞춤법&#39;</span> 단원을 집중적으로
            복습하시고, 기출문제 2021~2023년도를 추가로 풀어보실 것을 권장합니다.
          </p>

          {/* Weak areas chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {['어법', '맞춤법', '이중 피동', '높임법 오용'].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] px-2.5 py-1 text-xs text-[#ef4444]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Section 6: Action Buttons ────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/recommend"
            className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#0f766e] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#115e59]"
          >
            <Zap className="h-4 w-4" />
            취약파트 집중 학습 시작
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/exam"
            className="flex flex-1 items-center justify-center gap-2 rounded-[8px] border border-[rgba(255,255,255,0.12)] py-3 text-sm font-medium text-[#d0d6e0] transition-all hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.04)]"
          >
            <RotateCcw className="h-4 w-4" />
            다시 풀기
          </Link>
          <Link
            href="/dashboard"
            className="flex flex-1 items-center justify-center gap-2 rounded-[8px] border border-[rgba(255,255,255,0.12)] py-3 text-sm font-medium text-[#d0d6e0] transition-all hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.04)]"
          >
            <LayoutDashboard className="h-4 w-4" />
            대시보드로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
