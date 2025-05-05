"use client";

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ArizaAreaChartProps {
  data: Array<{
    gun: string;
    ariza: number;
    cozulen: number;
  }>;
  title?: string;
}

export default function ArizaAreaChart({ data, title }: ArizaAreaChartProps) {
  const memoizedData = useMemo(() => data, [data]);

  return (
    <div className="w-full h-[300px]">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={memoizedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="gun" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="ariza" stackId="1" stroke="#8884d8" fill="#8884d8" />
          <Area type="monotone" dataKey="cozulen" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
