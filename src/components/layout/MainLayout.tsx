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

  return (
    <div className="flex min-h-screen bg-linear-bg-marketing">
      {/* Desktop sidebar — fixed, always visible on lg+ */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-[240px] lg:z-20">
        <Sidebar />
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
      <div className="flex flex-col flex-1 min-w-0 lg:ml-[240px]">
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
