'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Mon', engagement: 400, leads: 240 },
  { name: 'Tue', engagement: 300, leads: 139 },
  { name: 'Wed', engagement: 550, leads: 380 },
  { name: 'Thu', engagement: 278, leads: 290 },
  { name: 'Fri', engagement: 689, leads: 480 },
  { name: 'Sat', engagement: 839, leads: 580 },
  { name: 'Sun', engagement: 1149, leads: 730 },
];

export function DashboardChart() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      className="w-full h-full min-h-[280px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <defs>
            {/* Engagement — indigo gradient */}
            <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            {/* Leads — violet gradient */}
            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            {/* Glow filter for strokes */}
            <filter id="glowIndigo" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid
            strokeDasharray="2 4"
            vertical={false}
            stroke="rgba(255,255,255,0.04)"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#52525b', fontWeight: 600, letterSpacing: '0.04em' }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#52525b', fontWeight: 600 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(12, 12, 18, 0.95)',
              backdropFilter: 'blur(12px)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff',
              boxShadow: '0 20px 40px -8px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.1)',
              padding: '10px 14px',
            }}
            itemStyle={{ color: '#a1a1aa', fontSize: '12px', fontWeight: 600 }}
            labelStyle={{ color: '#fff', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}
            cursor={{ stroke: 'rgba(99,102,241,0.15)', strokeWidth: 1.5 }}
          />
          <Area
            type="monotone"
            dataKey="engagement"
            stroke="#6366f1"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorEngagement)"
            activeDot={{ r: 5, strokeWidth: 0, fill: '#6366f1', filter: 'url(#glowIndigo)' }}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="leads"
            stroke="#8b5cf6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorLeads)"
            activeDot={{ r: 5, strokeWidth: 0, fill: '#8b5cf6' }}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
