import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { DISCOVERY_PROFILES } from '../constants';
import { X, Heart, Sparkles, MapPin } from 'lucide-react';

const Discovery: React.FC = () => {
  const [profiles, setProfiles] = useState(DISCOVERY_PROFILES);

  const handleSwipe = (direction: 'left' | 'right', id: string) => {
    // Remove profile from stack
    setTimeout(() => {
        setProfiles(prev => prev.filter(p => p.id !== id));
    }, 200);
  };

  return (
    <div className="h-full w-full flex flex-col pt-4 pb-24 relative overflow-hidden">
      <div className="px-6 mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white">Discover</h2>
          <p className="text-relink-neon font-bold text-sm">Based on your Vibe</p>
        </div>
        <div className="bg-white/10 px-3 py-1 rounded-full border border-white/20">
           <span className="text-xs font-bold text-white">NYU Campus</span>
        </div>
      </div>

      <div className="flex-1 relative mx-4">
        <AnimatePresence>
          {profiles.length > 0 ? (
            profiles.map((profile, index) => {
              const isTop = index === profiles.length - 1;
              return (
                <Card 
                  key={profile.id} 
                  profile={profile} 
                  active={isTop} 
                  onSwipe={(dir) => handleSwipe(dir, profile.id)} 
                />
              );
            })
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <Sparkles className="w-8 h-8 text-relink-neon" />
              </div>
              <h3 className="text-xl font-bold text-white">All caught up!</h3>
              <p className="text-slate-400 mt-2">Check back later for more vibe matches.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Card = ({ profile, active, onSwipe }: { profile: any, active: boolean, onSwipe: (d: 'left' | 'right') => void }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  
  // Color overlays based on swipe
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  return (
    <motion.div
      style={{ x, rotate, opacity, zIndex: active ? 10 : 0 }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, { offset, velocity }) => {
        const swipeThreshold = 100;
        if (offset.x > swipeThreshold) {
          onSwipe('right');
        } else if (offset.x < -swipeThreshold) {
          onSwipe('left');
        }
      }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ x: x.get() < 0 ? -500 : 500, opacity: 0, transition: { duration: 0.2 } }}
      className={`absolute inset-0 rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl ${!active && 'pointer-events-none'}`}
    >
      <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
      
      {/* Swipe Indicators */}
      <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 border-4 border-relink-neon rounded-lg px-4 py-2 rotate-[-15deg]">
        <span className="text-4xl font-black text-relink-neon uppercase">VIBE</span>
      </motion.div>
      <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 border-4 border-red-500 rounded-lg px-4 py-2 rotate-[15deg]">
        <span className="text-4xl font-black text-red-500 uppercase">NOPE</span>
      </motion.div>

      {/* Profile Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-center justify-between mb-2">
            <div>
                <h2 className="text-3xl font-black flex items-center gap-2">
                    {profile.name}, {profile.age}
                    <span className="text-xs bg-relink-purple px-2 py-1 rounded-full">{profile.vibeMatch}% Match</span>
                </h2>
                <div className="flex items-center text-slate-300 text-sm mt-1">
                    <MapPin className="w-3 h-3 mr-1" /> {profile.university}
                </div>
            </div>
        </div>
        
        <p className="text-slate-200 text-sm mb-4 line-clamp-2">{profile.bio}</p>
        
        <div className="flex flex-wrap gap-2">
           {profile.interests.map((tag: string) => (
             <span key={tag} className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
               #{tag}
             </span>
           ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Discovery;