'use client'

import { useState } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('desktopSidebarCollapsed') === 'true'
  })

  function toggleDesktopSidebar() {
    setDesktopSidebarCollapsed((prev) => {
      const next = !prev
      window.localStorage.setItem('desktopSidebarCollapsed', String(next))
      return next
    })
  }

  return (
    <div className="flex min-h-screen bg-linear-bg-marketing">
      {/* Desktop sidebar — fixed, always visible on lg+ */}
      <div
        className={[
          'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 transition-[width] duration-200',
          desktopSidebarCollapsed ? 'lg:w-[76px]' : 'lg:w-[240px]',
        ].join(' ')}
      >
        <Sidebar
          collapsed={desktopSidebarCollapsed}
          onToggleCollapse={toggleDesktopSidebar}
        />
      </div>

      {/* Mobile sidebar — sheet/drawer */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="p-0 w-[240px] bg-linear-bg-panel border-r border-border"
        >
          <Sidebar onNavClick={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div
        className={[
          'flex flex-col flex-1 min-w-0 transition-[margin-left] duration-200',
          desktopSidebarCollapsed ? 'lg:ml-[76px]' : 'lg:ml-[240px]',
        ].join(' ')}
      >
        {/* Mobile top header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
