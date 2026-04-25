import { ThemeToggle } from '@/components/theme/theme-toggle'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-linear-bg-marketing flex items-center justify-center px-4 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-1/4 h-64 w-64 rounded-full bg-linear-brand-indigo/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/5 h-56 w-56 rounded-full bg-linear-status-emerald/10 blur-3xl" />
      </div>
      <ThemeToggle className="absolute right-4 top-4 z-20" />
      <div className="relative z-10 w-full max-w-sm">
        {children}
      </div>
    </div>
  )
}
