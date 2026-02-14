import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { Trophy, Zap, Share2, Info, Crown, Settings, BarChart3, Medal, Users, Edit3, MapPin, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileScreen = () => {
  const [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();

  useEffect(() => { 
      // Refresh user state from auth
      setUser(auth.currentUser);
  }, []);

  if (!user) {
      // Should be handled by ProtectedRoute, but safe fallback
      return <div className="h-full flex items-center justify-center bg-black">Not Logged In</div>;
  }
  
  const userAvatar = user.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200';

  const achievements = [
      { id: 1, name: 'Deep Talker', icon: '🌌', desc: '5 calls > 30mins', unlocked: true },
      { id: 2, name: 'Streak Master', icon: '🔥', desc: '14 day streak', unlocked: true },
      { id: 3, name: 'Social Butterfly', icon: '🦋', desc: 'Connect with 10 people', unlocked: false },
      { id: 4, name: 'Early Bird', icon: '🌅', desc: 'Call before 8am', unlocked: false },
  ];

  return (
    <div className="h-full overflow-y-auto pb-24 pt-6 px-5 bg-black relative">
        {/* Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-relink-purple/10 to-transparent pointer-events-none" />

        {/* Header Actions */}
        <div className="flex justify-between items-center relative z-10 mb-6">
             <div className="bg-white/5 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">My Profile</span>
            </div>
            <button className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white border border-white/5 hover:bg-white/10 transition-colors">
                <Settings className="w-5 h-5" />
            </button>
        </div>

        {/* Identity Section */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="relative group cursor-pointer mb-4">
              <div className="w-28 h-28 rounded-[30px] p-1 bg-gradient-to-tr from-relink-neon to-relink-blue relative z-10 shadow-2xl">
                 <img src={userAvatar} className="w-full h-full rounded-[26px] object-cover bg-black" />
              </div>
              <div className="absolute -inset-4 bg-relink-neon/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-black text-white text-[10px] font-black uppercase px-3 py-1 rounded-full border border-white/20 shadow-xl flex items-center whitespace-nowrap">
                    <Crown className="w-3 h-3 mr-1 text-yellow-400 fill-yellow-400" />
                    Lvl {user.level}
                  </div>
              </div>
          </div>

          <h1 className="text-3xl font-black text-white mb-1">{user.name}</h1>
          <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
             <MapPin className="w-3 h-3 mr-1" /> NYC • Member since 2024
          </div>

          {/* Bio & Tags */}
          <div className="w-full max-w-xs text-center mb-6">
             <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">
               "Tech enthusiast looking for deep conversations about the future. Coffee addict."
             </p>
             <div className="flex flex-wrap justify-center gap-2">
                {user.interests && user.interests.length > 0 ? user.interests.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 uppercase">
                        #{tag}
                    </span>
                )) : <span className="text-xs text-slate-500">No interests set</span>}
             </div>
          </div>

          <button className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-full text-xs font-bold transition-colors border border-white/10">
             <Edit3 className="w-3 h-3" />
             <span>Edit Details</span>
          </button>
        </div>

        {/* Interactive Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
            {/* Friends Count */}
            <div className="glass-panel p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                <Users className="w-5 h-5 text-relink-blue mb-1" />
                <span className="text-xl font-black text-white">24</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase">Circle</span>
            </div>

            {/* Streak Stat */}
            <div className="glass-panel p-3 rounded-2xl flex flex-col items-center justify-center text-center relative group cursor-help">
                <Trophy className="w-5 h-5 text-relink-hot mb-1" />
                <span className="text-xl font-black text-white">12</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase flex items-center gap-1">
                  Streak <Info className="w-2 h-2 opacity-50" />
                </span>
            </div>

            {/* XP Stat */}
            <div className="glass-panel p-3 rounded-2xl flex flex-col items-center justify-center text-center relative group cursor-help">
                <Zap className="w-5 h-5 text-relink-neon mb-1" />
                <span className="text-xl font-black text-white">{user.xp}</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase flex items-center gap-1">
                  XP <Info className="w-2 h-2 opacity-50" />
                </span>
            </div>
        </div>

        {/* Vibe History Graph */}
        <div className="glass-panel p-6 rounded-3xl mb-8 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-relink-purple/10 blur-[50px] pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Weekly Vibe
                </h3>
                <span className="bg-relink-neon/10 text-relink-neon text-[10px] px-2 py-1 rounded-md font-bold border border-relink-neon/20">+12% vs last week</span>
            </div>
            <div className="flex items-end justify-between h-24 space-x-2 relative z-10">
                {[40, 65, 30, 80, 50, 90, 75].map((h, i) => (
                    <div key={i} className="w-full flex flex-col items-center group relative">
                        <div className="w-full bg-slate-800/50 rounded-t-sm relative overflow-hidden h-full">
                           <div 
                                className="absolute bottom-0 w-full bg-gradient-to-t from-relink-blue to-relink-purple rounded-t-sm transition-all duration-500 group-hover:from-relink-neon group-hover:to-relink-hot" 
                                style={{ height: `${h}%` }} 
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-3 px-1 text-[10px] text-slate-600 font-bold uppercase">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <Medal className="w-4 h-4 mr-2" /> Badges
                </h3>
                <span className="text-[10px] text-relink-blue font-bold">View All</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                {achievements.map(ach => (
                    <div key={ach.id} className={`p-4 rounded-2xl border transition-all hover:scale-[1.02] ${ach.unlocked ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-transparent border-white/5 opacity-50 grayscale'}`}>
                        <div className="flex items-start justify-between mb-2">
                            <span className="text-2xl filter drop-shadow-md">{ach.icon}</span>
                            {ach.unlocked && <div className="w-2 h-2 bg-relink-neon rounded-full" />}
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm leading-none mb-1">{ach.name}</p>
                            <p className="text-[10px] text-slate-500 leading-tight">{ach.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Share Button */}
        <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-lg flex items-center justify-center space-x-2 hover:bg-slate-200 transition-colors active:scale-95 mb-4 shadow-lg shadow-white/5">
            <Share2 className="w-5 h-5" />
            <span>Share Profile Card</span>
        </button>
        
        <p className="text-center text-[10px] text-slate-600 font-mono uppercase pb-4">ID: {user.uid.slice(0,8)}</p>
    </div>
  );
};

export default ProfileScreen;