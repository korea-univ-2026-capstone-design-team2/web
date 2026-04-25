import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-linear-bg-marketing border-t border-border py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <span className="text-linear-brand-indigo font-semibold text-sm tracking-tight lowercase">oh-my-study</span>
          <p className="text-linear-text-quaternary text-xs">
            © {new Date().getFullYear()} oh-my-study. All rights reserved.
          </p>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-5">
          <Link
            href="/about"
            className="text-linear-text-tertiary hover:text-linear-text-secondary text-xs transition-colors duration-150"
          >
            소개
          </Link>
          <Link
            href="/terms"
            className="text-linear-text-tertiary hover:text-linear-text-secondary text-xs transition-colors duration-150"
          >
            이용약관
          </Link>
          <Link
            href="/privacy"
            className="text-linear-text-tertiary hover:text-linear-text-secondary text-xs transition-colors duration-150"
          >
            개인정보처리방침
          </Link>
        </nav>
      </div>
    </footer>
  )
}
