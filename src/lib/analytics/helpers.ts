import type {
  AnalyticsDailyRecordResDto,
  AnalyticsDateRangeParams,
  AnalyticsSummaryResDto,
} from '@/types/question-dto';
import { mockDailyRecords } from '@/data/mock/study-stats';

export const ANALYTICS_PERIOD_DAYS = 30;

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getAnalyticsDateRange(days: number): AnalyticsDateRangeParams {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - (days - 1));
  return { from: toIsoDate(from), to: toIsoDate(to) };
}

export function toAccuracyPercent(value: number): number {
  if (value <= 1) return Math.round(value * 1000) / 10;
  return Math.round(value * 10) / 10;
}

export function formatChartDate(isoDate: string): string {
  const [, month, day] = isoDate.split('-');
  return `${Number(month)}/${Number(day)}`;
}

export function dailyRecordsToTrendLine(items: AnalyticsDailyRecordResDto[]) {
  return items.map((item) => ({
    date: formatChartDate(item.date),
    score: toAccuracyPercent(item.accuracy),
  }));
}

export function getCurrentWeekStart(date: Date = new Date()): Date {
  const weekStart = new Date(date);
  const day = weekStart.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  weekStart.setDate(weekStart.getDate() - daysFromMonday);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

export function filterRecordsToCurrentWeek(items: AnalyticsDailyRecordResDto[]): AnalyticsDailyRecordResDto[] {
  const weekStartIso = toIsoDate(getCurrentWeekStart());
  return items.filter((item) => item.date >= weekStartIso);
}

export function dailyRecordsToWeekdayBar(items: AnalyticsDailyRecordResDto[]) {
  const labels = ['월', '화', '수', '목', '금', '토', '일'];
  const counts = [0, 0, 0, 0, 0, 0, 0];

  for (const item of filterRecordsToCurrentWeek(items)) {
    const day = new Date(`${item.date}T00:00:00`).getDay();
    const index = day === 0 ? 6 : day - 1;
    counts[index] += item.questionCount;
  }

  return labels.map((name, index) => ({ name, count: counts[index] }));
}

export function calculateStreakDays(items: AnalyticsDailyRecordResDto[]): number {
  if (!items.length) return 0;

  let streak = 0;
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));
  for (const item of sorted) {
    if (item.questionCount > 0) {
      streak += 1;
      continue;
    }
    break;
  }
  return streak;
}

export function getTodayRecord(items: AnalyticsDailyRecordResDto[]): AnalyticsDailyRecordResDto | null {
  const today = toIsoDate(new Date());
  return items.find((item) => item.date === today) ?? items.at(-1) ?? null;
}

export function formatStudyDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    return remainder > 0 ? `${hours}시간 ${remainder}분` : `${hours}시간`;
  }
  return `${minutes}분`;
}

export function summarizeDailyRecords(items: AnalyticsDailyRecordResDto[]): AnalyticsSummaryResDto {
  const totalQuestions = items.reduce((sum, item) => sum + item.questionCount, 0);
  const totalCorrect = items.reduce((sum, item) => sum + item.correctCount, 0);
  const totalStudySeconds = items.reduce((sum, item) => sum + item.studySeconds, 0);
  const accuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;

  return {
    totalQuestions,
    totalCorrect,
    totalStudySeconds,
    accuracy,
  };
}

export function mockDailyRecordsAsDto(): AnalyticsDailyRecordResDto[] {
  return mockDailyRecords.map((record) => ({
    date: record.date,
    questionCount: record.questionCount,
    correctCount: record.correctCount,
    studySeconds: record.studyMinutes * 60,
    accuracy: record.accuracy,
  }));
}

export function calculateAccuracyTrend(items: AnalyticsDailyRecordResDto[]): number {
  if (items.length < 2) return 0;

  const midpoint = Math.floor(items.length / 2);
  const firstHalf = items.slice(0, midpoint);
  const secondHalf = items.slice(midpoint);

  const average = (records: AnalyticsDailyRecordResDto[]) => {
    const active = records.filter((record) => record.questionCount > 0);
    if (!active.length) return 0;
    return active.reduce((sum, record) => sum + toAccuracyPercent(record.accuracy), 0) / active.length;
  };

  return Math.round((average(secondHalf) - average(firstHalf)) * 10) / 10;
}

export function findLowestAccuracyDay(items: AnalyticsDailyRecordResDto[]): number {
  const active = items.filter((item) => item.questionCount > 0);
  if (!active.length) return 0;
  return Math.min(...active.map((item) => toAccuracyPercent(item.accuracy)));
}
