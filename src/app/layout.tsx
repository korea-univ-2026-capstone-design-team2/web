import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'PassFinder - AI 적응형 학습 플랫폼',
  description: 'AI 기반 공무원 시험 CBT 및 취약점 분석 플랫폼',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={inter.variable}>
      <body className="bg-background text-foreground font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
