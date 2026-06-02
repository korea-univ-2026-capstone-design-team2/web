import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeroStat {
  label: string;
  value: string | number;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
}

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  icon?: ElementType;
  stats?: PageHeroStat[];
  action?: ReactNode;
  className?: string;
}

const statTone = {
  default: 'border-border bg-white text-linear-text-primary',
  brand: 'border-linear-brand-indigo/20 bg-linear-brand-indigo/8 text-linear-accent-violet',
  success: 'border-linear-status-emerald/20 bg-linear-status-emerald/8 text-linear-status-emerald',
  warning: 'border-amber-500/20 bg-amber-500/8 text-amber-600',
  danger: 'border-red-500/20 bg-red-500/8 text-red-500',
};

export function PageHero({ eyebrow, title, description, icon: Icon, stats, action, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-[18px] border border-border bg-white shadow-[var(--shadow-level-1)]',
        className
      )}
    >
      <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:p-8">
        <div className="min-w-0 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-linear-brand-indigo/20 bg-linear-brand-indigo/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-linear-accent-violet">
            {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />}
            {eyebrow}
          </div>
          <div className="space-y-2">
            <h1 className="text-[2rem] font-semibold leading-tight tracking-[-0.04em] text-linear-text-primary md:text-[2.75rem]">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-linear-text-tertiary md:text-[15px]">
              {description}
            </p>
          </div>
        </div>

        {(stats?.length || action) && (
          <div className="flex min-w-[220px] flex-col justify-end gap-3">
            {stats?.length ? (
              <div className="grid grid-cols-2 gap-2 md:min-w-[280px]">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className={cn('rounded-[12px] border px-3 py-2.5', statTone[stat.tone ?? 'default'])}
                  >
                    <p className="text-[11px] font-medium text-linear-text-tertiary">{stat.label}</p>
                    <p className="mt-1 text-xl font-semibold tabular-nums tracking-[-0.03em]">{stat.value}</p>
                  </div>
                ))}
              </div>
            ) : null}
            {action}
          </div>
        )}
      </div>
    </section>
  );
}

interface SurfacePanelProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function SurfacePanel({ children, className, as: Component = 'section' }: SurfacePanelProps) {
  return (
    <Component className={cn('rounded-[14px] border border-border bg-white', className)}>
      {children}
    </Component>
  );
}
