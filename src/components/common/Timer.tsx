'use client'

import { useState, useEffect, useRef } from 'react'
import { Clock } from 'lucide-react'

interface TimerProps {
  initialSeconds: number
  onTimeUp: () => void
  isRunning: boolean
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const WARNING_THRESHOLD_SECONDS = 5 * 60 // 5 minutes

export function Timer({ initialSeconds, onTimeUp, isRunning }: TimerProps) {
  const [remaining, setRemaining] = useState(initialSeconds)
  const onTimeUpRef = useRef(onTimeUp)

  // Keep ref up to date without re-running the effect
  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  useEffect(() => {
    setRemaining(initialSeconds)
  }, [initialSeconds])

  useEffect(() => {
    if (!isRunning || remaining <= 0) return

    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          onTimeUpRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [isRunning, remaining])

  const isWarning = remaining < WARNING_THRESHOLD_SECONDS

  return (
    <div
      className={[
        'flex items-center gap-2 px-3 py-1.5 rounded-[6px] font-medium tabular-nums text-sm transition-colors duration-300',
        isWarning
          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
          : 'bg-white/4 text-linear-text-secondary border border-white/8',
      ].join(' ')}
      role="timer"
      aria-live="polite"
      aria-label={`남은 시간 ${formatTime(remaining)}`}
    >
      <Clock
        size={14}
        strokeWidth={1.5}
        className={isWarning ? 'text-red-500' : 'text-linear-text-tertiary'}
      />
      <span>{formatTime(remaining)}</span>
    </div>
  )
}
