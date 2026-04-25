'use client';

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface BarChartProps {
  data: Record<string, string | number>[];
  dataKey: string;
  title?: string;
  color?: string;
  labelKey?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-[8px] border border-border bg-card px-3 py-2">
        <p className="mb-1 text-xs text-linear-text-tertiary">{label}</p>
        <p className="text-sm font-medium text-linear-text-primary">{payload[0].value}문제</p>
      </div>
    );
  }
  return null;
};

export default function BarChart({
  data,
  dataKey,
  title,
  color = '#0f766e',
  labelKey = 'name',
}: BarChartProps) {
  return (
    <div className="rounded-[8px] border border-border bg-white/70 p-6 dark:bg-white/2">
      {title && (
        <h3 className="mb-4 text-sm font-semibold text-linear-text-primary">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={280}>
        <RechartsBarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey={labelKey}
            tick={{ fill: 'var(--linear-text-tertiary)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--linear-text-tertiary)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(15,118,110,0.10)' }} />
          <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={color}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
