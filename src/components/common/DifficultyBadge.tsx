import { cn } from '@/lib/utils'

type Difficulty = '상' | '중' | '하'

interface DifficultyBadgeProps {
  difficulty: Difficulty
  className?: string
}

const DIFFICULTY_STYLES: Record<Difficulty, { bg: string; text: string; border: string; label: string }> = {
  상: {
    bg: 'bg-red-500/10',
    text: 'text-red-500',
    border: 'border-red-500/20',
    label: '상',
  },
  중: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
    border: 'border-amber-500/20',
    label: '중',
  },
  하: {
    bg: 'bg-linear-status-emerald/10',
    text: 'text-linear-status-emerald',
    border: 'border-linear-status-emerald/20',
    label: '하',
  },
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const styles = DIFFICULTY_STYLES[difficulty]

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border pb-[1px]',
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
      aria-label={`난이도: ${styles.label}`}
    >
      {styles.label}
    </span>
  )
}
