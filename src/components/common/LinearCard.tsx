import { cn } from '@/lib/utils'

interface LinearCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  as?: React.ElementType
}

export function LinearCard({
  children,
  className,
  hover = false,
  as: Component = 'div',
}: LinearCardProps) {
  return (
    <Component
      className={cn(
        'bg-white/2 border border-white/8 rounded-[8px]',
        hover && 'transition-colors duration-150 hover:bg-white/4 cursor-pointer',
        className
      )}
    >
      {children}
    </Component>
  )
}
