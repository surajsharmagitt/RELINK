import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Heart, MapPin, Music, BookOpen, Coffee, Star, Zap, Check, Quote, UserPlus, Info } from 'lucide-react';
import { DISCOVERY_PROFILES } from '../constants';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

const DiscoveryScreen = () => {
  const [profiles, setProfiles] = useState(DISCOVERY_PROFILES);
  const [requestSent, setRequestSent] = useState<any>(null);
  const navigate = useNavigate();

  const handleSwipe = (direction: 'left' | 'right', profile: any) => {
    if (direction === 'right') {
        // Send Friend Request
        const newRequest = {
            from: { name: profile.name, avatarUrl: profile.avatarUrl }, // Simulating incoming for demo, or outgoing
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        // In a real app, we would add to the recipient's "requests" collection. 
        // For this local mock, we'll just simulate a "Request Sent" feedback.
        
        setRequestSent(profile);
        setTimeout(() => setRequestSent(null), 1500);
    }

    setTimeout(() => {
        setProfiles(prev => prev.filter(p => p.id !== profile.id));
    }, 200);
  };

  return (
    <div className="h-full flex flex-col pt-4 pb-24 relative overflow-hidden bg-black overflow-y-auto">
      
      {/* Header */}
      <div className="px-6 mb-2 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-white">Discover</h2>
            <p className="text-slate-400 text-sm">Find your vibe tribe.</p>
          </div>
          <div className="flex space-x-2">
             <button onClick={() => navigate('/requests')} className="bg-white/10 px-4 py-2 rounded-full text-xs font-bold text-white border border-white/10 hover:bg-white/20 transition-colors">
                Requests
             </button>
          </div>
      </div>

      <div className="flex-1 relative mx-4 mt-4 min-h-[500px]">
        <AnimatePresence>
          {profiles.length > 0 ? (
            profiles.map((profile, index) => {
                const isTop = index === profiles.length - 1;
                return (
                  <SwipeCard 
                    key={profile.id} 
                    profile={profile} 
                    onSwipe={(dir) => handleSwipe(dir, profile)} 
                    isTop={isTop} 
                  />
                )
            })
          ) : (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 border border-white/5 rounded-3xl bg-white/5 mx-2 my-10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Coffee className="w-8 h-8 text-slate-600" />
                </div>
                <p>No more suggestions today.</p>
                <button onClick={() => setProfiles(DISCOVERY_PROFILES)} className="mt-4 text-relink-neon font-bold border border-relink-neon/30 px-4 py-2 rounded-xl hover:bg-relink-neon hover:text-black transition-colors">Refresh Stack</button>
             </div>
          )}
        </AnimatePresence>
        
        {/* Match Popup Overlay */}
        <AnimatePresence>
            {requestSent && (
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                >
                    <div className="bg-black/80 backdrop-blur-xl p-8 rounded-[40px] border border-relink-neon/50 text-center shadow-[0_0_50px_rgba(163,230,53,0.3)]">
                        <div className="w-20 h-20 bg-relink-neon rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserPlus className="w-10 h-10 text-black" />
                        </div>
                        <h3 className="text-2xl font-black text-white">Request Sent!</h3>
                        <p className="text-relink-neon font-bold">Waiting for {requestSent.name} to connect.</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SwipeCard = ({ profile, onSwipe, isTop }: { profile: any, onSwipe: (dir: 'left' | 'right') => void, isTop: boolean }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);
  const opacity = useTransform(x, [-150, 0, 150], [0.8, 1, 0.8]);
  
  // Icon helper
  const InterestIcon = ({ name }: { name: string }) => {
      if(name === 'Music') return <Music className="w-3 h-3 mr-1" />;
      if(name === 'Tech') return <Coffee className="w-3 h-3 mr-1" />;
      return <BookOpen className="w-3 h-3 mr-1" />;
  }

  return (
    <motion.div
      style={{ x: isTop ? x : 0, rotate: isTop ? rotate : 0, opacity: isTop ? opacity : 1, scale: isTop ? 1 : 0.96 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, { offset }) => {
        if (offset.x > 100) onSwipe('right');
        else if (offset.x < -100) onSwipe('left');
      }}
      className={`absolute inset-0 bg-slate-900 rounded-[32px] overflow-hidden border border-white/10 shadow-2xl flex flex-col ${!isTop && 'pointer-events-none brightness-50'}`}
    >
      {/* Top Image Section (Smaller Height) */}
      <div className="h-[45%] relative">
        <img src={profile.avatarUrl} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        {/* Vibe Match Badge */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center shadow-lg">
            <Zap className="w-3 h-3 text-relink-neon mr-1 fill-relink-neon" />
            <span className="text-white font-black text-xs">{profile.vibeMatch}% Match</span>
        </div>
      </div>
      
      {/* Swipe Indicators */}
      <motion.div style={{ opacity: useTransform(x, [0, 100], [0, 1]) }} className="absolute top-8 left-8 border-4 border-relink-neon rounded-lg px-4 py-2 rotate-[-15deg] bg-black/50 backdrop-blur-md z-10">
        <span className="text-4xl font-black text-relink-neon uppercase">REQUEST</span>
      </motion.div>
      <motion.div style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }} className="absolute top-8 right-8 border-4 border-red-500 rounded-lg px-4 py-2 rotate-[15deg] bg-black/50 backdrop-blur-md z-10">
        <span className="text-4xl font-black text-red-500 uppercase">PASS</span>
      </motion.div>
      
      {/* Content Section (Scrollable if needed, but fitted for card) */}
      <div className="flex-1 p-6 flex flex-col bg-slate-900 relative">
         <div className="flex justify-between items-start mb-3">
             <div>
                <h2 className="text-3xl font-black text-white leading-none mb-1">{profile.name}, {profile.age}</h2>
                <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                   <MapPin className="w-3 h-3 mr-1" /> {profile.university || 'Nearby'}
                </div>
             </div>
             <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                 profile.connectionStyle === 'Deep' ? 'bg-relink-purple/20 text-relink-purple border-relink-purple/30' : 
                 profile.connectionStyle === 'Chill' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                 'bg-relink-hot/20 text-relink-hot border-relink-hot/30'
             }`}>
                 {profile.connectionStyle} Vibe
             </div>
         </div>

         {/* Bio Section - More Prominent */}
         <div className="bg-white/5 p-4 rounded-2xl border border-white/5 mb-4 relative">
             <Quote className="absolute top-2 left-2 w-4 h-4 text-slate-600 opacity-50" />
             <p className="text-slate-200 text-sm leading-relaxed pl-2 pt-1 font-medium">
                "{profile.bio}"
             </p>
         </div>

         <div className="flex-1">
             <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Interests</h3>
             <div className="flex flex-wrap gap-2">
                {profile.interests.map((t: string) => (
                    <span key={t} className="flex items-center text-xs font-bold bg-white/5 px-3 py-2 rounded-xl border border-white/10 text-slate-300">
                        {t}
                    </span>
                ))}
             </div>
         </div>

         <div className="mt-4 pt-4 border-t border-white/5 flex justify-center text-slate-500 text-[10px] uppercase font-bold tracking-widest">
             <Info className="w-3 h-3 mr-1" /> Swipe right to send request
         </div>
      </div>
    </motion.div>
  );
};

export default DiscoveryScreen;