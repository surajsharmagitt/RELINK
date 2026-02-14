import React from 'react';
import { Circle } from '../types';
import { motion } from 'framer-motion';
import { Users, Mic, Hash, Plus } from 'lucide-react';

interface CirclesProps {
  circles: Circle[];
  onJoinRoom: (circleId: string) => void;
}

const Circles: React.FC<CirclesProps> = ({ circles, onJoinRoom }) => {
  return (
    <div className="h-full flex flex-col pt-4 px-5 pb-24 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Circles</h2>
          <p className="text-relink-purple font-bold text-sm">Your Communities</p>
        </div>
        <button className="bg-white/10 p-2 rounded-full border border-white/20 hover:bg-white/20 transition-colors">
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="space-y-4">
        {circles.map((circle, index) => (
          <motion.div
            key={circle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-4 rounded-3xl group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl relative">
                   <img src={circle.avatarUrl} alt={circle.name} className="w-full h-full rounded-2xl object-cover" />
                   <div className="absolute -bottom-1 -right-1 bg-black rounded-lg px-1.5 py-0.5 border border-white/10">
                      <span className="text-[9px] font-bold text-white flex items-center">
                        <Users className="w-2.5 h-2.5 mr-1" /> {circle.memberCount}
                      </span>
                   </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">{circle.name}</h3>
                  <div className="flex space-x-2 mt-1">
                    {circle.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Voice Room Card */}
            {circle.activeRoom.isActive ? (
              <button 
                onClick={() => onJoinRoom(circle.id)}
                className="w-full bg-gradient-to-r from-relink-purple/20 to-relink-blue/20 border border-relink-purple/30 rounded-2xl p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-relink-purple/20 flex items-center justify-center animate-pulse">
                    <Mic className="w-5 h-5 text-relink-purple" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-relink-purple uppercase tracking-wider">Live Now</p>
                    <p className="text-sm font-bold text-white">{circle.activeRoom.topic || 'Chilling'}</p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                   {circle.activeRoom.participants.map((pid, idx) => (
                     <div key={idx} className="w-8 h-8 rounded-full border-2 border-black bg-slate-800 flex items-center justify-center text-xs text-white">
                        U{pid}
                     </div>
                   ))}
                   <div className="w-8 h-8 rounded-full border-2 border-black bg-relink-neon text-black flex items-center justify-center text-xs font-bold">
                     Join
                   </div>
                </div>
              </button>
            ) : (
              <button className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-3 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-900 transition-colors">
                 <Mic className="w-4 h-4 mr-2" />
                 <span className="text-sm font-bold">Start a Room</span>
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Circles;