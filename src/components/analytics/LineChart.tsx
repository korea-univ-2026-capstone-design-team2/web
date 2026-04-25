'use client';

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface LineConfig {
  key: string;
  color: string;
  name: string;
}

interface LineChartProps {
  data: Record<string, string | number>[];
  lines: LineConfig[];
  title?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="space-y-1 rounded-[8px] border border-border bg-card px-3 py-2">
        <p className="mb-1 text-xs text-linear-text-tertiary">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function LineChart({ data, lines, title }: LineChartProps) {
  return (
    <div className="rounded-[8px] border border-border bg-white/70 p-6 dark:bg-white/2">
      {title && (
        <h3 className="mb-4 text-sm font-semibold text-linear-text-primary">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={280}>
        <RechartsLineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'var(--linear-text-tertiary)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: 'var(--linear-text-tertiary)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          {lines.length > 1 && (
            <Legend
              wrapperStyle={{ color: 'var(--linear-text-tertiary)', fontSize: '12px', paddingTop: '12px' }}
            />
          )}
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              name={line.name}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: line.color }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
