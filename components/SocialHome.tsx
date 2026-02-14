import React from 'react';
import { Contact, UserProfile } from '../types';
import { Phone, Flame, Trophy, Play, Zap, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface SocialHomeProps {
  contacts: Contact[];
  userProfile: UserProfile;
  onStartCall: (id: string) => void;
  onOpenProfile: () => void;
  onStartChallenge: () => void;
  onUpdateStatus: () => void;
}

const SocialHome: React.FC<SocialHomeProps> = ({ 
  contacts, 
  userProfile, 
  onStartCall, 
  onOpenProfile, 
  onStartChallenge, 
  onUpdateStatus 
}) => {
  const activeContacts = contacts.filter(c => c.status === 'online' || c.status === 'in-call');
  
  // XP Progress Calc
  const currentLevelXP = 600; // Mock current level base
  const nextLevelXP = 1000;
  const progress = ((userProfile.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="h-full pb-24 overflow-y-auto px-5 pt-2">
      
      {/* 0. XP Bar & Status (Clickable) */}
      <button 
        onClick={onOpenProfile}
        className="w-full flex items-center justify-between mb-8 bg-slate-900/50 p-2 rounded-2xl border border-white/5 hover:bg-slate-900 transition-colors group"
      >
         <div className="flex items-center space-x-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-relink-neon to-relink-blue flex items-center justify-center group-hover:scale-105 transition-transform">
               <span className="font-black text-black text-sm">{userProfile.level}</span>
            </div>
            <div className="text-left">
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">Level {userProfile.level}</div>
               <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-relink-neon" style={{width: `${progress}%`}}></div>
               </div>
            </div>
         </div>
         <div className="px-3">
            <span className="text-relink-neon font-black text-sm">{userProfile.xp} XP</span>
         </div>
      </button>

      {/* 1. Active Now - Stories/Presence */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Now</h3>
           <span className="text-[10px] text-relink-neon animate-pulse font-bold">● {activeContacts.length} Online</span>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
           {/* Add Story Button (Functional) */}
           <button 
             onClick={onUpdateStatus}
             className="flex flex-col items-center space-y-1 group"
            >
             <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center bg-white/5 group-hover:bg-white/10 group-hover:border-relink-neon transition-all">
                <span className="text-2xl text-slate-400 group-hover:text-white transition-colors">+</span>
             </div>
             <span className="text-xs font-medium text-slate-400 group-hover:text-white">My Status</span>
           </button>

           {activeContacts.map(contact => (
             <motion.button 
                key={contact.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onStartCall(contact.id)}
                className="flex flex-col items-center space-y-1 relative group"
             >
               <div className="relative">
                 <div className={`w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr ${contact.status === 'in-call' ? 'from-relink-purple to-relink-hot' : 'from-relink-neon to-relink-blue'} animate-pulse group-hover:scale-105 transition-transform`}>
                   <img src={contact.avatarUrl} alt={contact.name} className="w-full h-full rounded-full object-cover border-2 border-black" />
                 </div>
                 {contact.status === 'in-call' ? (
                   <div className="absolute -bottom-1 -right-1 bg-relink-purple w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                      <div className="w-1 h-3 bg-white mx-[1px] animate-pulse"></div>
                      <div className="w-1 h-2 bg-white mx-[1px] animate-pulse delay-75"></div>
                   </div>
                 ) : (
                   <div className="absolute -bottom-1 -right-1 bg-relink-neon w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                      <Phone className="w-2 h-2 text-black fill-black" />
                   </div>
                 )}
               </div>
               <span className="text-xs font-bold text-white group-hover:text-relink-neon transition-colors">{contact.name}</span>
             </motion.button>
           ))}
        </div>
      </div>

      {/* 2. Daily Challenge Card (Functional) */}
      <motion.button 
        onClick={onStartChallenge}
        whileTap={{ scale: 0.98 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full text-left relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-900 to-black border border-white/10 p-6 mb-8 group shadow-lg"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-relink-purple blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
             <span className="bg-relink-hot/20 text-relink-hot px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-relink-hot/30">Daily Drop</span>
             <div className="flex items-center text-yellow-400 text-xs font-bold">
               <Trophy className="w-4 h-4 mr-1" /> +50 XP
             </div>
          </div>
          <h2 className="text-2xl font-black text-white mb-2 italic">"Who knows you best?"</h2>
          <p className="text-sm text-slate-300 mb-6 group-hover:text-white transition-colors">Call a friend and play the 2-minute trivia game.</p>
          
          <div className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center space-x-2 group-hover:bg-relink-neon transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Play className="w-4 h-4 fill-black" />
            <span>Start Challenge</span>
          </div>
        </div>
      </motion.button>

      {/* 3. Live Social Feed (Mock) */}
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Live Highlights</h3>
      <div className="space-y-3">
         {[1, 2].map((i) => (
           <div key={i} className="glass-panel p-4 rounded-3xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg">🔥</div>
                 <div>
                    <p className="text-sm text-white font-medium"><span className="font-bold">Sarah</span> & <span className="font-bold">Chloe</span> reached a <span className="text-relink-hot font-bold">30 Day Streak!</span></p>
                    <p className="text-[10px] text-slate-500 mt-1">2 hours ago</p>
                 </div>
              </div>
              <button className="bg-white/5 p-2 rounded-full hover:bg-white/10">
                 <Flame className="w-4 h-4 text-relink-hot" />
              </button>
           </div>
         ))}
      </div>

    </div>
  );
};

export default SocialHome;