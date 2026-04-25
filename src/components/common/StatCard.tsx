import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardTrend {
  value: number
  label?: string
}

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ElementType
  trend?: StatCardTrend
  className?: string
}

function TrendIndicator({ trend }: { trend: StatCardTrend }) {
  if (trend.value === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-linear-text-tertiary">
        <Minus size={12} strokeWidth={1.5} />
        {trend.label ?? '변화 없음'}
      </span>
    )
  }

  const isPositive = trend.value > 0

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium',
        isPositive ? 'text-linear-status-emerald' : 'text-red-500'
      )}
    >
      {isPositive ? <TrendingUp size={12} strokeWidth={1.5} /> : <TrendingDown size={12} strokeWidth={1.5} />}
      {isPositive ? '+' : ''}{trend.value}%
      {trend.label && <span className="text-linear-text-quaternary font-normal ml-0.5">{trend.label}</span>}
    </span>
  )
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-white/2 border border-white/8 rounded-[8px] p-4 flex flex-col gap-3',
        className
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-linear-text-tertiary text-xs font-medium uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-[6px] bg-linear-brand-indigo/10 flex items-center justify-center flex-shrink-0">
            <Icon size={16} className="text-linear-accent-violet" strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex flex-col gap-1">
        <span className="text-linear-text-primary text-2xl font-semibold tabular-nums leading-none">
          {value}
        </span>
        {subtitle && (
          <span className="text-linear-text-quaternary text-xs">{subtitle}</span>
        )}
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div className="pt-1 border-t border-white/5">
          <TrendIndicator trend={trend} />
        </div>
      )}
    </div>
  )
}
