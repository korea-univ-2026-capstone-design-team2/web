import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_MAP: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="로딩 중"
      className={cn(
        'rounded-full border-white/10 border-t-linear-accent-violet animate-spin',
        SIZE_MAP[size],
        className
      )}
    />
  )
}

interface LoadingOverlayProps {
  label?: string
}

export function LoadingOverlay({ label = '로딩 중...' }: LoadingOverlayProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <LoadingSpinner size="lg" />
      <span className="text-linear-text-tertiary text-sm">{label}</span>
    </div>
  )
}
