import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CIRCLES } from '../constants';
import { Users, Mic, Plus, Search, Check, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CirclesScreen = () => {
  const navigate = useNavigate();
  // Using local state to simulate database join status
  const [circles, setCircles] = useState(MOCK_CIRCLES);
  const [showDiscover, setShowDiscover] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const myCircles = circles.filter(c => c.isJoined);
  const discoverCircles = circles.filter(c => !c.isJoined && c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleJoin = (id: string) => {
    setCircles(prev => prev.map(c => {
        if(c.id === id) return { ...c, isJoined: !c.isJoined };
        return c;
    }));
  };

  const handleEnterRoom = (circleId: string) => {
    navigate(`/room/${circleId}`);
  };

  return (
    <div className="h-full overflow-y-auto pb-24 pt-4 px-5 relative bg-black">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Circles</h2>
          <p className="text-relink-purple font-bold text-sm">Your Communities</p>
        </div>
        <button 
          onClick={() => setShowDiscover(true)}
          className="bg-white/10 p-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors group"
        >
          <Plus className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
        </button>
      </div>

      {myCircles.length === 0 ? (
          <div className="text-center mt-20 p-6 bg-white/5 rounded-3xl border border-white/5">
              <Hash className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Circles Yet</h3>
              <p className="text-slate-400 text-sm mb-6">Join a community to start connecting.</p>
              <button 
                 onClick={() => setShowDiscover(true)}
                 className="bg-relink-neon text-black font-bold px-6 py-3 rounded-xl"
              >
                  Discover Circles
              </button>
          </div>
      ) : (
          <div className="space-y-4">
            {myCircles.map(circle => (
            <div key={circle.id} className="glass-panel p-4 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <img src={circle.avatarUrl} className="w-14 h-14 rounded-2xl object-cover" />
                        <div>
                            <h3 className="text-lg font-bold text-white">{circle.name}</h3>
                            <div className="flex items-center text-xs text-slate-400">
                                <Users className="w-3 h-3 mr-1" /> {circle.memberCount} members
                            </div>
                        </div>
                    </div>
                </div>

                {circle.activeRoom.isActive ? (
                    <button 
                        onClick={() => handleEnterRoom(circle.id)}
                        className="w-full bg-gradient-to-r from-relink-purple/20 to-relink-blue/20 border border-relink-purple/30 p-3 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-colors group"
                    >
                        <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-relink-purple flex items-center justify-center mr-3 animate-pulse">
                            <Mic className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                            <span className="block text-xs text-relink-purple font-bold uppercase">Live Now</span>
                            <span className="text-sm font-bold text-white">{circle.activeRoom.topic}</span>
                        </div>
                        </div>
                        <span className="text-xs font-bold bg-relink-purple text-white px-3 py-1.5 rounded-lg group-hover:scale-105 transition-transform">Join</span>
                    </button>
                ) : (
                    <button 
                        onClick={() => handleEnterRoom(circle.id)}
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-2xl text-sm font-bold text-slate-500 text-center hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                        <Mic className="w-4 h-4" /> Lounge (Empty)
                    </button>
                )}
            </div>
            ))}
          </div>
      )}

      {/* Discover Modal */}
      <AnimatePresence>
        {showDiscover && (
            <motion.div 
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                className="fixed inset-0 z-50 bg-slate-900 flex flex-col pt-12 rounded-t-[32px] mt-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/10"
            >
                <div className="px-6 pb-4 flex items-center justify-between border-b border-white/5">
                    <h2 className="text-2xl font-black text-white">Discover</h2>
                    <button onClick={() => setShowDiscover(false)} className="bg-white/5 p-2 rounded-full text-slate-400 hover:text-white">
                        <Plus className="w-6 h-6 rotate-45" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="bg-black/40 border border-white/10 rounded-xl flex items-center px-4 py-3 mb-6">
                        <Search className="text-slate-500 w-5 h-5 mr-3" />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Find communities..."
                            className="bg-transparent w-full text-white outline-none font-medium placeholder:text-slate-600"
                        />
                    </div>

                    <div className="space-y-4 overflow-y-auto pb-20 max-h-[70vh]">
                        {discoverCircles.map(circle => (
                            <div key={circle.id} className="bg-white/5 border border-white/5 p-4 rounded-3xl flex flex-col">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <img src={circle.avatarUrl} className="w-12 h-12 rounded-xl object-cover" />
                                        <div>
                                            <h3 className="font-bold text-white">{circle.name}</h3>
                                            <span className="text-xs text-slate-400 flex items-center">
                                                <Users className="w-3 h-3 mr-1" /> {circle.memberCount}
                                            </span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => toggleJoin(circle.id)}
                                        className="bg-relink-neon text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-lime-400"
                                    >
                                        Join
                                    </button>
                                </div>
                                <p className="text-sm text-slate-300 mb-3">{circle.description}</p>
                                <div className="flex gap-2">
                                    {circle.tags.map(tag => (
                                        <span key={tag} className="text-[10px] bg-black/40 px-2 py-1 rounded-md text-slate-400 border border-white/5">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {discoverCircles.length === 0 && (
                            <div className="text-center text-slate-500 py-10">
                                <p>No circles found matching "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CirclesScreen;