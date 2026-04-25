'use client';

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface RadarDataPoint {
  subject: string;
  score: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  title?: string;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-[8px] border border-border bg-card px-3 py-2">
        <p className="text-sm font-medium text-linear-text-primary">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function RadarChart({ data, title }: RadarChartProps) {
  return (
    <div className="rounded-[8px] border border-border bg-white/70 p-6 dark:bg-white/2">
      {title && (
        <h3 className="mb-4 text-sm font-semibold text-linear-text-primary">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={280}>
        <RechartsRadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'var(--linear-text-tertiary)', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: 'var(--linear-text-quaternary)', fontSize: 10 }}
            tickCount={4}
          />
          <Radar
            name="정답률"
            dataKey="score"
            stroke="#0f766e"
            fill="rgba(94, 106, 210, 0.2)"
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
