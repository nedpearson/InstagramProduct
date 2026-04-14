'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Mon', engagement: 400, leads: 240 },
  { name: 'Tue', engagement: 300, leads: 139 },
  { name: 'Wed', engagement: 550, leads: 980 },
  { name: 'Thu', engagement: 278, leads: 390 },
  { name: 'Fri', engagement: 689, leads: 480 },
  { name: 'Sat', engagement: 839, leads: 380 },
  { name: 'Sun', engagement: 1349, leads: 430 },
];

export function DashboardChart() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="w-full h-full min-h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }} 
            itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}
            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
          />
          <Area type="monotone" dataKey="engagement" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorEngagement)" activeDot={{ r: 6, strokeWidth: 0, fill: '#818cf8' }} />
          <Area type="monotone" dataKey="leads" stroke="#c084fc" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" activeDot={{ r: 6, strokeWidth: 0, fill: '#c084fc' }} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
