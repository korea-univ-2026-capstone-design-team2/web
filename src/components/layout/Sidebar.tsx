'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  Sparkles,
  User,
  Settings,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme/theme-toggle'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const NAV_ITEMS: NavItem[] = [
  { label: '대시보드', href: '/dashboard', icon: LayoutDashboard },
  { label: '시험 응시', href: '/exam', icon: FileText },
  { label: '취약점 분석', href: '/analytics', icon: BarChart2 },
  { label: 'AI 추천 문제', href: '/recommend', icon: Sparkles },
  { label: '마이페이지', href: '/mypage', icon: User },
]

interface SidebarProps {
  onNavClick?: () => void
}

export function Sidebar({ onNavClick }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <aside className="flex flex-col h-full w-full bg-linear-bg-panel border-r border-border">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={onNavClick}>
          <span className="text-linear-brand-indigo font-semibold text-lg tracking-tight select-none lowercase">
            oh-my-study
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavClick}
            className={[
              'flex items-center gap-3 px-3 py-2 rounded-[6px] text-sm transition-colors duration-150',
              isActive(href)
                ? 'bg-black/5 dark:bg-white/8 text-linear-text-primary font-medium'
                : 'text-linear-text-tertiary hover:text-linear-text-secondary hover:bg-black/4 dark:hover:bg-white/6',
            ].join(' ')}
          >
            <Icon
              size={16}
              className={isActive(href) ? 'text-linear-accent-violet' : 'text-current'}
              strokeWidth={isActive(href) ? 1.75 : 1.5}
            />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-2 py-3 border-t border-border space-y-0.5">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-[6px] text-sm text-linear-text-tertiary hover:text-linear-text-secondary hover:bg-black/4 dark:hover:bg-white/6 transition-colors duration-150"
          onClick={onNavClick}
        >
          <Settings size={16} strokeWidth={1.5} />
          설정
        </Link>

        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2 mt-1">
          <div className="w-7 h-7 rounded-full bg-linear-brand-indigo flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-linear-text-secondary text-xs font-medium truncate">사용자</span>
            <span className="text-linear-text-quaternary text-[11px] truncate">user@example.com</span>
          </div>
        </div>

        <div className="px-3 pt-1.5">
          <ThemeToggle className="w-full rounded-[8px] justify-center" />
        </div>
      </div>
    </aside>
  )
}
