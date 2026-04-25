"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className={cn("rounded-full border-white/15 bg-white/60 backdrop-blur-sm dark:bg-white/5", className)}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      title={isDark ? "라이트 모드" : "다크 모드"}
    >
      {isDark ? <Sun className="size-4" strokeWidth={1.8} /> : <Moon className="size-4" strokeWidth={1.8} />}
    </Button>
  )
}
