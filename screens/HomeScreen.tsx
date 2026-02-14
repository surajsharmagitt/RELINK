import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { Zap, Play, Trophy, Flame, Phone, Gamepad2, Mic, Clock, Plus, X, Sparkles, UserPlus, Search, ArrowRight, MessageCircle, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSmartSuggestion, getScoreColor } from '../services/relinkService';
import { Contact } from '../types';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [showStatusInput, setShowStatusInput] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [showChallengePicker, setShowChallengePicker] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showAllConnections, setShowAllConnections] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<Contact | null>(null); // For Story View

  useEffect(() => {
    setUser(auth.currentUser);
    fetchFriends();
    fetchRequests();
  }, []);

  const fetchFriends = () => {
    db.collection('friends').get().then(data => {
        const sorted = data.sort((a: any, b: any) => b.connectionScore - a.connectionScore);
        setFriends(sorted);
    });
  };

  const fetchRequests = () => {
      db.collection('requests').get().then(data => {
          setRequests(data);
      });
  };

  const handlePostStatus = async () => {
    if (!statusText.trim()) return;
    await auth.updateStatus(statusText);
    setUser({ ...auth.currentUser! }); // Force refresh
    setStatusText('');
    setShowStatusInput(false);
  };

  const handleAddFriend = () => {
      if(!searchTerm) return;
      const newFriend = {
          name: searchTerm,
          category: 'Casual',
          connectionScore: 50,
          status: 'offline',
          avatarUrl: `https://ui-avatars.com/api/?name=${searchTerm}&background=random`,
          interests: ['General'],
          xp: 0,
          level: 1,
          lastInteractionDate: new Date().toISOString(),
          currentStatusMsg: "New here! 👋"
      };
      
      db.collection('friends').add(newFriend).then(() => {
          setSearchTerm('');
          setShowAddFriend(false);
          fetchFriends();
      });
  };

  const progress = user ? (user.xp % 1000) / 10 : 0;
  // Fallback avatar
  const userAvatar = user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200';

  // Status Indicator Helper
  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'gaming') return <div className="absolute -bottom-1 -right-1 bg-orange-500 w-6 h-6 rounded-full border-2 border-black flex items-center justify-center"><Gamepad2 className="w-3 h-3 text-white" /></div>;
    if (status === 'in-call') return <div className="absolute -bottom-1 -right-1 bg-relink-purple w-6 h-6 rounded-full border-2 border-black flex items-center justify-center animate-pulse"><Mic className="w-3 h-3 text-white" /></div>;
    return <div className="absolute -bottom-1 -right-1 bg-relink-neon w-6 h-6 rounded-full border-2 border-black flex items-center justify-center"><div className="w-2 h-2 bg-black rounded-full" /></div>;
  }

  // Identify who needs attention (Smart Logic)
  const suggestions = friends
    .filter(f => f.category === 'Close' || f.category === 'Important' || f.connectionScore < 50)
    .slice(0, 2)
    .map(f => ({ ...f, suggestion: generateSmartSuggestion(f) }));

  return (
    <div className="h-full overflow-y-auto pb-24 pt-4 px-5 relative bg-black">
      
      {/* Header with Logo */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
            <div className="bg-relink-neon p-1 rounded-md">
               <Zap className="w-4 h-4 text-black fill-black" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">Relink</h1>
        </div>
        
        <div className="flex items-center space-x-3">
             <button onClick={() => navigate('/requests')} className="relative p-2 bg-slate-900 rounded-full border border-white/10 hover:bg-slate-800 transition-colors">
                <Bell className="w-5 h-5 text-slate-300" />
                {requests.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-relink-hot rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                        {requests.length}
                    </div>
                )}
             </button>

             <div onClick={() => navigate('/profile')} className="flex items-center space-x-2 bg-slate-900/50 p-1.5 pr-3 rounded-full border border-white/10 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-relink-neon to-relink-blue p-0.5">
                    <img src={userAvatar} className="w-full h-full rounded-full object-cover" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-0.5">Lvl {user?.level}</span>
                    <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-relink-neon" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 1. Active Row (Stories/Vibes) */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Live Vibes</h3>
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            
            {/* My Status Update */}
            <div onClick={() => setShowStatusInput(true)} className="flex flex-col items-center space-y-2 min-w-[72px] cursor-pointer group relative">
                <div className={`w-18 h-18 rounded-full border-2 border-dashed ${user?.currentStatusMsg ? 'border-relink-neon' : 'border-slate-600'} p-1`}>
                   <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center relative overflow-hidden">
                      <img src={userAvatar} className="w-full h-full object-cover opacity-50" />
                      <Plus className="absolute w-6 h-6 text-white z-10" />
                   </div>
                </div>
                <span className="text-xs font-medium text-slate-400">My Vibe</span>
                {user?.currentStatusMsg && (
                    <div className="absolute top-0 right-1 w-4 h-4 bg-relink-neon rounded-full border-2 border-black" />
                )}
            </div>
            
            {/* Friend Stories */}
            {friends.map(friend => (
                <div key={friend.id} onClick={() => setSelectedVibe(friend)} className="flex flex-col items-center space-y-2 min-w-[72px] cursor-pointer">
                    <div className={`relative w-18 h-18 rounded-full p-[2px] ${friend.currentStatusMsg ? 'bg-gradient-to-tr from-relink-neon to-relink-blue' : 'bg-slate-800'}`}>
                        <div className="w-16 h-16 rounded-full border-2 border-black overflow-hidden relative">
                             <img src={friend.avatarUrl} className="w-full h-full object-cover" />
                        </div>
                        <StatusBadge status={friend.status} />
                    </div>
                    <span className="text-xs font-bold text-white max-w-[72px] truncate">{friend.name}</span>
                </div>
            ))}
        </div>
      </div>

      {/* Status Input Overlay */}
      <AnimatePresence>
          {showStatusInput && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="mb-8 bg-slate-900/90 border border-relink-neon/30 p-4 rounded-2xl relative"
              >
                  <button onClick={() => setShowStatusInput(false)} className="absolute top-2 right-2 text-slate-500"><X className="w-4 h-4"/></button>
                  <h4 className="text-sm font-bold text-relink-neon mb-2">Update your vibe</h4>
                  <div className="flex gap-2">
                      <input 
                        value={statusText} 
                        onChange={e => setStatusText(e.target.value)} 
                        placeholder="What are you up to?" 
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-relink-neon outline-none" 
                        autoFocus
                      />
                      <button onClick={handlePostStatus} className="bg-relink-neon text-black px-4 py-2 rounded-xl text-xs font-black uppercase">Post</button>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* 2. Intentional Sparks (Smart Suggestions) */}
      {suggestions.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-4 h-4 text-relink-purple" />
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recommended Sparks</h3>
            </div>
            <div className="grid gap-3">
                {suggestions.map(s => (
                    <div key={s.id} className="bg-gradient-to-r from-slate-900 to-slate-800 border border-white/10 p-4 rounded-3xl flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                            <img src={s.avatarUrl} className="w-12 h-12 rounded-2xl object-cover" />
                            <div>
                                <h4 className="font-bold text-white leading-none mb-1">{s.name}</h4>
                                <div className="flex items-center text-[10px] text-slate-400">
                                    <span className="mr-1">{s.suggestion.icon}</span>
                                    <span>{s.suggestion.topic}</span>
                                </div>
                                <p className="text-[10px] text-relink-purple mt-1 font-medium max-w-[180px] leading-tight">"{s.suggestion.prompt}"</p>
                            </div>
                        </div>
                        <button onClick={() => navigate('/call', { state: { contactId: s.id } })} className="bg-white/10 p-3 rounded-full hover:bg-relink-purple hover:text-white text-relink-purple transition-colors">
                            <Phone className="w-5 h-5 fill-current" />
                        </button>
                    </div>
                ))}
            </div>
          </div>
      )}

      {/* 3. Daily Challenge */}
      <motion.button 
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowChallengePicker(true)}
        className="w-full text-left relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-900 to-black border border-white/10 p-6 mb-8 group shadow-lg"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-relink-purple blur-[60px] opacity-40" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
             <span className="bg-relink-hot/20 text-relink-hot px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-relink-hot/30">Daily Drop</span>
             <div className="flex items-center text-yellow-400 text-xs font-bold">
               <Trophy className="w-4 h-4 mr-1" /> +50 XP
             </div>
          </div>
          <h2 className="text-2xl font-black text-white mb-2 italic">"Who knows you best?"</h2>
          <p className="text-sm text-slate-300 mb-6">Call a friend and play the 2-minute trivia game.</p>
          <div className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center space-x-2 group-hover:bg-relink-neon transition-colors">
            <Play className="w-4 h-4 fill-black" />
            <span>Choose Friend</span>
          </div>
        </div>
      </motion.button>

      {/* 4. Connection Overview */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Connection Health</h3>
        <button onClick={() => setShowAllConnections(true)} className="text-[10px] text-relink-neon font-bold flex items-center">
            View All <ArrowRight className="w-3 h-3 ml-1" />
        </button>
      </div>
      
      <div className="space-y-4">
        {friends.slice(0, 3).map(friend => (
             <div key={friend.id} onClick={() => navigate(`/contact/${friend.id}`)} className="glass-panel p-4 rounded-3xl flex items-center justify-between cursor-pointer active:scale-95 transition-transform">
              <div className="flex items-center space-x-3">
                 <div className="relative">
                    <img src={friend.avatarUrl} className="w-10 h-10 rounded-xl object-cover" />
                    <div className={`absolute -top-1 -right-1 text-[8px] font-black px-1.5 rounded-full bg-black border border-slate-700 ${getScoreColor(friend.connectionScore)}`}>
                        {friend.connectionScore}
                    </div>
                 </div>
                 <div>
                    <p className="text-sm text-white font-bold">{friend.name}</p>
                    <p className="text-[10px] text-slate-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> Last: {new Date(friend.lastInteractionDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                    </p>
                 </div>
              </div>
              <div className="flex flex-wrap gap-1 max-w-[100px] justify-end">
                  {friend.interests?.slice(0,2).map((t: string) => (
                      <span key={t} className="text-[9px] bg-white/5 px-2 py-0.5 rounded-md text-slate-400">{t}</span>
                  ))}
              </div>
           </div>
        ))}
      </div>

      {/* --- MODALS --- */}

      {/* Vibe Viewer (Story Style) */}
      <AnimatePresence>
          {selectedVibe && (
              <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
                 onClick={() => setSelectedVibe(null)}
              >
                  <motion.div 
                     initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                     onClick={e => e.stopPropagation()}
                     className="w-full max-w-sm bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-[40px] p-8 text-center relative overflow-hidden"
                  >
                      {/* Decorative BG */}
                      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-relink-purple/20 to-transparent pointer-events-none" />
                      
                      <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-relink-neon to-relink-blue mx-auto mb-6 relative z-10">
                          <img src={selectedVibe.avatarUrl} className="w-full h-full rounded-full object-cover border-4 border-black" />
                          <div className="absolute bottom-2 right-2 bg-black rounded-full p-2 border border-white/10">
                              <MessageCircle className="w-5 h-5 text-relink-neon" />
                          </div>
                      </div>
                      
                      <h2 className="text-3xl font-black text-white mb-2">{selectedVibe.name}</h2>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 relative">
                          <span className="absolute -top-3 left-4 text-4xl text-white/10">"</span>
                          <p className="text-lg font-medium text-slate-200 leading-relaxed">
                            {selectedVibe.currentStatusMsg || "Just vibing on Relink. ✨"}
                          </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                          <button 
                             onClick={() => navigate('/call', { state: { contactId: selectedVibe.id } })} 
                             className="bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                          >
                              <Phone className="w-5 h-5 fill-black" /> Call
                          </button>
                          <button 
                             onClick={() => navigate(`/contact/${selectedVibe.id}`)}
                             className="bg-white/10 text-white font-bold py-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors"
                          >
                              Profile
                          </button>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* Add Friend Modal */}
      <AnimatePresence>
          {showAddFriend && (
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24 px-6"
            >
                <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-6 relative">
                    <button onClick={() => setShowAddFriend(false)} className="absolute top-4 right-4 text-slate-500"><X className="w-6 h-6" /></button>
                    <h3 className="text-xl font-black text-white mb-4">Add Connection</h3>
                    <div className="bg-white/5 border border-white/10 rounded-xl flex items-center px-4 py-3 mb-4">
                        <Search className="text-slate-500 w-5 h-5 mr-3" />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name or ID..."
                            className="bg-transparent w-full text-white outline-none font-medium"
                            autoFocus
                        />
                    </div>
                    <button onClick={handleAddFriend} className="w-full bg-relink-blue text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-colors">
                        Send Request
                    </button>
                    <div className="mt-4 text-center">
                        <p className="text-xs text-slate-500 mb-2">Or share your vibe link</p>
                        <div className="text-relink-neon text-sm font-mono bg-relink-neon/10 py-2 rounded-lg">relink.app/u/{user?.name.toLowerCase()}</div>
                    </div>
                </motion.div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Challenge Picker Modal */}
      <AnimatePresence>
        {showChallengePicker && (
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
             onClick={(e) => {
                if (e.target === e.currentTarget) setShowChallengePicker(false);
             }}
          >
            <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.9, y: 20 }}
               className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-[32px] p-6 relative overflow-hidden"
            >
               <button onClick={() => setShowChallengePicker(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white bg-white/5 p-2 rounded-full">
                 <X className="w-5 h-5" />
               </button>

               <div className="mb-6">
                 <h3 className="text-xl font-black text-white mb-1">Select Challenger</h3>
                 <p className="text-slate-400 text-sm">Pick a friend to play with.</p>
               </div>
               
               <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                 {friends.map(friend => (
                    <button 
                      key={friend.id}
                      onClick={() => navigate('/play/trivia', { state: { opponent: friend } })}
                      className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-2xl transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                            <img src={friend.avatarUrl} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                            {friend.status === 'online' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-relink-neon rounded-full border-2 border-slate-900" />}
                        </div>
                        <div className="text-left">
                            <span className="block font-bold text-white">{friend.name}</span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold">{friend.category}</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-relink-neon group-hover:text-black transition-colors">
                         <Play className="w-4 h-4 fill-current" />
                      </div>
                    </button>
                 ))}
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Connections Modal */}
      <AnimatePresence>
        {showAllConnections && (
            <motion.div 
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }}
                className="fixed inset-0 z-50 bg-black flex flex-col"
            >
                <div className="p-6 flex items-center justify-between border-b border-white/10">
                    <button onClick={() => setShowAllConnections(false)} className="p-2 bg-white/5 rounded-full"><ArrowRight className="w-6 h-6 text-white rotate-180" /></button>
                    <h2 className="text-xl font-black text-white">All Connections</h2>
                    <div className="w-10" />
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {friends.map(friend => (
                        <div key={friend.id} onClick={() => navigate(`/contact/${friend.id}`)} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                             <div className="flex items-center space-x-4">
                                <img src={friend.avatarUrl} className="w-12 h-12 rounded-xl object-cover" />
                                <div>
                                    <h4 className="font-bold text-white">{friend.name}</h4>
                                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${friend.category === 'Close' ? 'bg-relink-purple text-white' : 'bg-slate-700 text-slate-400'}`}>{friend.category}</span>
                                </div>
                             </div>
                             <div className="text-right">
                                <div className={`text-xl font-black ${getScoreColor(friend.connectionScore)}`}>{friend.connectionScore}</div>
                                <div className="text-[9px] text-slate-500 uppercase font-bold">Score</div>
                             </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default HomeScreen;