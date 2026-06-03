'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  Sparkles,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

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
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ onNavClick, collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <aside className="flex flex-col h-full w-full bg-linear-bg-panel border-r border-border">
      {/* Logo */}
      <div className={['border-b border-border', collapsed ? 'px-2 py-4' : 'px-4 py-5'].join(' ')}>
        <div className={['flex items-center', collapsed ? 'justify-center' : 'justify-between gap-2'].join(' ')}>
          <Link href="/dashboard" className="flex items-center gap-2" onClick={onNavClick}>
            {!collapsed && (
              <span className="text-linear-brand-indigo font-semibold text-lg tracking-tight select-none">
                PassFinder
              </span>
            )}
          </Link>

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className={[
                'hidden lg:flex items-center justify-center rounded-[6px] text-linear-text-tertiary hover:text-linear-text-secondary hover:bg-black/5 dark:hover:bg-white/8 transition-colors duration-150',
                collapsed ? 'h-8 w-8' : 'h-8 w-8',
              ].join(' ')}
              aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
              title={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
            >
              {collapsed ? <PanelLeftOpen size={16} strokeWidth={1.5} /> : <PanelLeftClose size={16} strokeWidth={1.5} />}
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={['flex-1 overflow-y-auto py-3 space-y-0.5', collapsed ? 'px-1.5' : 'px-2'].join(' ')}>
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavClick}
            title={collapsed ? label : undefined}
            className={[
              'flex items-center rounded-[6px] text-sm transition-colors duration-150',
              collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2',
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
            {!collapsed && label}
          </Link>
        ))}
      </nav>

      {/* Bottom section */}
      <div className={['py-3 border-t border-border space-y-0.5', collapsed ? 'px-1.5' : 'px-2'].join(' ')}>
        {/* User info */}
        <div className={['flex items-center mt-1', collapsed ? 'justify-center px-0 py-2' : 'gap-3 px-3 py-2'].join(' ')}>
          <div className="w-7 h-7 rounded-full bg-linear-brand-indigo flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-linear-text-secondary text-xs font-medium truncate">사용자</span>
              <span className="text-linear-text-quaternary text-[11px] truncate">user@example.com</span>
            </div>
          )}
        </div>

      </div>
    </aside>
  )
}
