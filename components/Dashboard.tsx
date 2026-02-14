import React, { useMemo } from 'react';
import { Contact } from '../types';
import { 
  BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, AreaChart, Area
} from 'recharts';
import { Heart, Activity, Phone, Clock, MessageCircle, Zap, Flame } from 'lucide-react';
import { getScoreColor, getCategoryColor } from '../services/relinkService';

interface DashboardProps {
  contacts: Contact[];
  onStartCall: (contactId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ contacts, onStartCall }) => {
  const analytics = useMemo(() => {
    const allInteractions = contacts.flatMap(c => c.interactions);
    const voiceInteractions = allInteractions.filter(i => i.type === 'voice');
    const textInteractions = allInteractions.filter(i => i.type === 'text');
    
    const totalDuration = voiceInteractions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
    const avgDuration = voiceInteractions.length ? Math.round(totalDuration / voiceInteractions.length) : 0;
    
    const voiceCount = voiceInteractions.length;
    const textCount = textInteractions.length;
    
    const today = new Date();
    const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return {
        fullDate: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('en-US', { weekday: 'short' })
      };
    });

    const trendData = last7Days.map(day => {
      const count = allInteractions.filter(i => i.date.startsWith(day.fullDate)).length;
      return { name: day.label, interactions: count };
    });

    const breakdownData = [
      { name: 'Voice', value: voiceCount, color: '#a3e635' }, // Neon Lime
      { name: 'Text', value: textCount, color: '#64748b' },   // Slate
    ];

    return {
      avgDuration,
      voiceCount,
      textCount,
      trendData,
      breakdownData,
      overallHealth: Math.floor(contacts.reduce((acc, c) => acc + c.connectionScore, 0) / (contacts.length || 1))
    };
  }, [contacts]);

  const fadingContacts = contacts.filter(c => c.connectionScore < 50 && (c.category === 'Close' || c.category === 'Important'));
  const topContacts = [...contacts].sort((a, b) => b.connectionScore - a.connectionScore).slice(0, 4);

  const getContactVoiceRatio = (c: Contact) => {
    const v = c.interactions.filter(i => i.type === 'voice').length;
    const t = c.interactions.filter(i => i.type === 'text').length;
    if (v + t === 0) return 0;
    return Math.round((v / (v + t)) * 100);
  }

  return (
    <div className="space-y-6 pb-20">
      
      {/* --- Section 1: Core Vitals (Glanceable) --- */}
      <div className="grid grid-cols-2 gap-4">
        {/* Vibe Score */}
        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center space-x-2 mb-2 relative z-10">
            <Zap className="w-5 h-5 text-relink-neon" />
            <h3 className="text-sm font-semibold text-relink-muted uppercase tracking-wider">Overall Vibe</h3>
          </div>
          <p className="text-5xl font-black text-white relative z-10 tracking-tight">
            {analytics.overallHealth}
          </p>
          {/* Ambient Glow */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-lime-500 rounded-full blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity" />
        </div>

        {/* Avg Depth */}
        <div className="glass-panel p-5 rounded-3xl flex flex-col justify-between relative overflow-hidden">
           <div className="flex items-center space-x-2 mb-2 z-10">
            <Clock className="w-5 h-5 text-violet-400" />
            <h3 className="text-sm font-semibold text-relink-muted uppercase tracking-wider">Avg Depth</h3>
          </div>
          <div className="z-10">
            <p className="text-3xl font-bold text-white">{analytics.avgDuration}<span className="text-lg font-normal text-slate-500 ml-1">min</span></p>
          </div>
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-violet-500 rounded-full blur-[50px] opacity-20" />
        </div>
      </div>

      {/* --- Section 2: Metrics --- */}
      <div className="grid grid-cols-5 gap-4">
        
        {/* Chart: Habits (Donut) */}
        <div className="col-span-2 glass-panel p-4 rounded-3xl flex flex-col items-center justify-center">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 w-full text-center">Mix</h3>
          <div className="w-full h-20 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.breakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={22}
                  outerRadius={35}
                  dataKey="value"
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  {analytics.breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Phone className="w-3 h-3 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Chart: Momentum (Area) */}
        <div className="col-span-3 glass-panel p-4 rounded-3xl">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Flow</h3>
          <div className="h-20 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.trendData}>
                <defs>
                  <linearGradient id="colorMomentum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 9, fontWeight: 600}} 
                  interval={1}
                />
                <Area 
                  type="monotone" 
                  dataKey="interactions" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorMomentum)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- Section 3: Ghosting Alerts (Actions) --- */}
      {fadingContacts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-white tracking-tight">Ghosting Alert</h2>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-1 rounded-lg font-bold uppercase tracking-wider">Fading</span>
          </div>
          <div className="grid gap-3">
            {fadingContacts.map(contact => (
              <div key={contact.id} className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-2xl border border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img src={contact.avatarUrl} alt={contact.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-rose-500/50 grayscale hover:grayscale-0 transition-all duration-300" />
                    <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-1">
                      <Flame className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200">{contact.name}</h3>
                    <p className="text-xs text-rose-400 font-medium">Last seen: {contact.lastInteractionDate ? new Date(contact.lastInteractionDate).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'Never'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onStartCall(contact.id)}
                  className="bg-rose-500 text-white p-3 rounded-xl hover:bg-rose-400 transition-colors shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                >
                  <Phone className="w-5 h-5 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Section 4: Top Squad (Stories Style) --- */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white px-2 tracking-tight">Top Squad</h2>
        <div className="flex space-x-3 overflow-x-auto pb-6 px-1 scrollbar-hide">
          {topContacts.map(contact => {
             const voiceRatio = getContactVoiceRatio(contact);
             return (
              <div key={contact.id} className="min-w-[140px] glass-panel p-4 rounded-3xl flex flex-col items-center text-center relative group hover:bg-slate-800/60 transition-colors">
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-2xl p-[2px] bg-gradient-to-tr from-lime-400 to-violet-500">
                    <img src={contact.avatarUrl} alt={contact.name} className="w-full h-full rounded-[14px] object-cover border-2 border-slate-900" />
                  </div>
                  <div className={`absolute -right-2 -bottom-2 ${getScoreColor(contact.connectionScore)} bg-slate-900 text-[10px] font-black px-2 py-1 rounded-lg border border-slate-700`}>
                    {contact.connectionScore}
                  </div>
                </div>
                <h4 className="font-bold text-slate-200 truncate w-full mb-1">{contact.name}</h4>
                <span className={`text-[9px] px-2 py-0.5 rounded-md mb-3 font-bold uppercase tracking-wider ${getCategoryColor(contact.category)}`}>
                  {contact.category}
                </span>
                
                {/* Voice Bar */}
                <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden flex">
                  <div className="bg-relink-neon h-full" style={{ width: `${voiceRatio}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;