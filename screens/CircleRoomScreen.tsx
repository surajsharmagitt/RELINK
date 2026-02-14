import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowDown, Mic, MicOff, MessageSquare, Hand, Users, MoreHorizontal, Send, Sparkles, X, Dice5 } from 'lucide-react';
import { MOCK_CIRCLES } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '../types';

// --- MOCK DATA GENERATOR FOR SPECIFIC ROOMS ---
const ROOM_DATA: Record<string, any> = {
  'c1': { // Bangalore Techies
    participants: [
      { id: 'p1', name: 'Arjun', talking: false, isHandRaised: false, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' }, // Indian Male
      { id: 'p2', name: 'Priya', talking: false, isHandRaised: false, avatar: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?auto=format&fit=crop&w=150&q=80' }, // Indian Female
      { id: 'p3', name: 'Rohan', talking: false, isHandRaised: true, avatar: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=150&q=80' }, // Indian Male
    ],
    messages: [
      { id: 'm1', senderId: 'p1', senderName: 'Arjun', text: 'Silk Board traffic is absolute chaos today 🚗', timestamp: new Date(Date.now() - 60000).toISOString() },
      { id: 'm2', senderId: 'p2', senderName: 'Priya', text: 'Haha, just take the metro! 🚇', timestamp: new Date(Date.now() - 30000).toISOString() },
      { id: 'm3', senderId: 'p3', senderName: 'Rohan', text: 'Anyone raising a seed round currently? VCs are ghosting.', timestamp: new Date(Date.now() - 10000).toISOString() },
    ]
  },
  'c2': { // Midnight Gamers
    participants: [
      { id: 'p4', name: 'Kenji', talking: false, isHandRaised: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' }, // Japanese Male
      { id: 'p5', name: 'Yuki', talking: false, isHandRaised: false, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' }, // Japanese Female
      { id: 'p6', name: 'Rahul', talking: false, isHandRaised: false, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80' }, // Indian Male
    ],
    messages: [
      { id: 'm1', senderId: 'p4', senderName: 'Kenji', text: 'Hop on Valo? Need a sage main.', timestamp: new Date(Date.now() - 60000).toISOString() },
      { id: 'm2', senderId: 'p5', senderName: 'Yuki', text: 'Give me 5 mins, finishing dinner 🍜', timestamp: new Date(Date.now() - 30000).toISOString() },
      { id: 'm3', senderId: 'p6', senderName: 'Rahul', text: 'gg last game was close', timestamp: new Date(Date.now() - 10000).toISOString() },
    ]
  },
  'c3': { // Mumbai Creatives
    participants: [
      { id: 'p7', name: 'Kavya', talking: false, isHandRaised: false, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }, // Indian Female
      { id: 'p8', name: 'Hiro', talking: false, isHandRaised: false, avatar: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=150&q=80' }, // Japanese Male
      { id: 'p9', name: 'Aisha', talking: false, isHandRaised: true, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' }, // Indian Female
    ],
    messages: [
      { id: 'm1', senderId: 'p7', senderName: 'Kavya', text: 'Did anyone go to the MAMI film fest?', timestamp: new Date(Date.now() - 60000).toISOString() },
      { id: 'm2', senderId: 'p8', senderName: 'Hiro', text: 'Editing a vlog, Premiere Pro is crashing again 😭', timestamp: new Date(Date.now() - 30000).toISOString() },
    ]
  }
};

const CircleRoomScreen = () => {
  const navigate = useNavigate();
  const { circleId } = useParams();
  const circle = MOCK_CIRCLES.find(c => c.id === circleId) || MOCK_CIRCLES[0];
  
  // Room State
  const [isMuted, setIsMuted] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [inputText, setInputText] = useState('');
  
  // Load specific room data or fallback
  const currentRoom = ROOM_DATA[circleId || 'c1'] || ROOM_DATA['c1'];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);

  // Initialize Data on Mount
  useEffect(() => {
    // Set initial messages
    setMessages([
        { id: 'sys', senderId: 'sys', senderName: 'System', text: `Welcome to ${circle.name}!`, timestamp: new Date().toISOString(), isSystem: true },
        ...currentRoom.messages
    ]);

    // Set participants (Add 'You')
    setParticipants([
        ...currentRoom.participants,
        { id: 'me', name: 'You', talking: false, isHandRaised: false, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80' }
    ]);
  }, [circleId]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showChat]);

  // Simulate Talking Animation
  useEffect(() => {
      const interval = setInterval(() => {
          setParticipants(prev => prev.map(p => {
              // Randomly toggle talking state for others
              if (p.name !== 'You') {
                  // Ensure names match the current room participants
                  return { ...p, talking: Math.random() > 0.7 };
              }
              // For 'You', check mute state (simulated voice activity)
              if (p.name === 'You' && !isMuted) {
                   return { ...p, talking: Math.random() > 0.5 };
              } else if (p.name === 'You' && isMuted) {
                   return { ...p, talking: false };
              }
              return p;
          }));
      }, 800);
      return () => clearInterval(interval);
  }, [isMuted]);

  // Update "You" state in participants list when local state changes
  useEffect(() => {
      setParticipants(prev => prev.map(p => p.name === 'You' ? { ...p, isHandRaised } : p));
  }, [isHandRaised]);

  const handleSendMessage = () => {
      if(!inputText.trim()) return;
      const newMsg: ChatMessage = {
          id: Date.now().toString(),
          senderId: 'me',
          senderName: 'You',
          text: inputText,
          timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, newMsg]);
      setInputText('');
  };

  const launchActivity = (type: string) => {
      let activityMsg = "";
      if (type === 'dice') {
          const prompts = ["Worst date ever?", "Fav childhood memory?", "Unpopular opinion?", "Last thing you bought?"];
          const picked = prompts[Math.floor(Math.random() * prompts.length)];
          activityMsg = `🎲 Rolled: "${picked}"`;
      }
      
      const sysMsg: ChatMessage = {
          id: Date.now().toString(),
          senderId: 'sys',
          senderName: 'Activity',
          text: activityMsg,
          timestamp: new Date().toISOString(),
          isSystem: true
      };
      setMessages(prev => [...prev, sysMsg]);
      setShowChat(true); // Open chat to show result
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 relative overflow-hidden">
        {/* Background Ambient */}
        <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b from-relink-purple/10 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="p-6 flex justify-between items-center z-10">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full bg-black/20 backdrop-blur-md border border-white/5">
                <ArrowDown className="w-6 h-6 text-white" />
            </button>
            <div className="text-center">
                <h3 className="text-white font-bold text-lg">{circle.name}</h3>
                <span className="text-relink-neon text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-relink-neon animate-pulse"/>
                    {circle.activeRoom.topic || 'Lounge'}
                </span>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-full bg-black/20 backdrop-blur-md border border-white/5">
                <MoreHorizontal className="w-6 h-6 text-white" />
            </button>
        </div>

        {/* Room Grid */}
        <div className="flex-1 p-6 grid grid-cols-2 gap-4 content-start overflow-y-auto">
            {participants.map(p => (
                <div key={p.id} className="flex flex-col items-center justify-center relative p-2">
                    <div className="relative mb-3">
                        {/* Talking Indicators */}
                        {p.talking && (
                            <div className="absolute -inset-2 rounded-full border-2 border-relink-neon opacity-50 animate-ping" />
                        )}
                        {/* Avatar */}
                        <div className={`relative w-24 h-24 rounded-full p-[3px] ${p.talking ? 'bg-relink-neon' : 'bg-transparent'}`}>
                             <img 
                                src={p.avatar} 
                                className="w-full h-full rounded-full object-cover border-4 border-slate-900 bg-slate-800" 
                            />
                        </div>
                        
                        {/* Status Icons */}
                        <div className="absolute -bottom-1 -right-1 flex gap-1">
                             {p.isHandRaised && (
                                <div className="w-8 h-8 bg-relink-blue rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg animate-bounce">
                                    <Hand className="w-4 h-4 text-white" />
                                </div>
                             )}
                             {(p.name === 'You' && isMuted) && (
                                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-900">
                                    <MicOff className="w-4 h-4 text-slate-400" />
                                </div>
                             )}
                        </div>
                    </div>
                    <span className="text-white font-bold text-sm bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
                        {p.name}
                    </span>
                </div>
            ))}
        </div>

        {/* Action Bar */}
        <div className="bg-slate-900/90 backdrop-blur-xl border-t border-white/10 p-6 pb-8 rounded-t-[40px] z-20 relative">
            <div className="flex justify-between items-center max-w-sm mx-auto gap-4">
                <button 
                    onClick={() => setShowChat(!showChat)}
                    className={`p-4 rounded-full transition-colors ${showChat ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    <MessageSquare className="w-6 h-6" />
                </button>
                
                <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={`h-20 w-20 rounded-[32px] flex items-center justify-center shadow-lg transition-all active:scale-95 border-4 border-slate-900 ${isMuted ? 'bg-white text-black' : 'bg-relink-neon text-black shadow-[0_0_30px_rgba(163,230,53,0.3)]'}`}
                >
                    {isMuted ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>

                <button 
                    onClick={() => setIsHandRaised(!isHandRaised)}
                    className={`p-4 rounded-full transition-colors ${isHandRaised ? 'bg-relink-blue text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    <Hand className="w-6 h-6" />
                </button>
            </div>
            
            {/* Activity Button */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <button 
                   onClick={() => launchActivity('dice')}
                   className="bg-relink-purple text-white px-4 py-2 rounded-full font-bold text-xs shadow-lg flex items-center gap-2 hover:bg-purple-500 transition-colors border-4 border-slate-950"
                >
                    <Dice5 className="w-4 h-4" /> Spin Topic
                </button>
            </div>
        </div>

        {/* Chat Drawer */}
        <AnimatePresence>
            {showChat && (
                <motion.div 
                    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                    className="absolute inset-0 top-20 bg-slate-950 z-30 rounded-t-[32px] flex flex-col shadow-2xl border-t border-white/10"
                >
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900/50 rounded-t-[32px]">
                        <h3 className="font-bold text-white ml-2">Room Chat</h3>
                        <button onClick={() => setShowChat(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-400">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex flex-col ${msg.isSystem ? 'items-center my-4' : msg.senderId === 'me' ? 'items-end' : 'items-start'}`}>
                                {msg.isSystem ? (
                                    <span className="bg-white/10 text-relink-neon px-3 py-1 rounded-full text-xs font-bold border border-white/5 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> {msg.text}
                                    </span>
                                ) : (
                                    <>
                                        <span className={`text-[10px] text-slate-500 mb-1 ${msg.senderId === 'me' ? 'mr-1' : 'ml-1'}`}>{msg.senderName}</span>
                                        <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${msg.senderId === 'me' ? 'bg-relink-blue text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                                            {msg.text}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="p-4 bg-slate-900 border-t border-white/10 pb-8">
                        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-full px-2 py-2 focus-within:border-relink-neon/50 transition-colors">
                            <input 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Say something..."
                                className="flex-1 bg-transparent px-3 text-white outline-none placeholder:text-slate-600"
                            />
                            <button 
                                onClick={handleSendMessage}
                                className="p-2 bg-white/10 rounded-full text-white hover:bg-relink-neon hover:text-black transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default CircleRoomScreen;