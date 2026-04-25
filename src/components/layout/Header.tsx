'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/theme-toggle'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 h-14 bg-linear-bg-panel border-b border-border lg:hidden sticky top-0 z-30">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <span className="text-linear-brand-indigo font-semibold text-base tracking-tight select-none lowercase">
          oh-my-study
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          onClick={onMenuClick}
          className="flex items-center justify-center w-8 h-8 rounded-[6px] text-linear-text-tertiary hover:text-linear-text-secondary hover:bg-black/5 dark:hover:bg-white/8 transition-colors duration-150"
          aria-label="메뉴 열기"
        >
          <Menu size={18} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  )
}
