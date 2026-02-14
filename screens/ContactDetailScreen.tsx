import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../lib/firebase';
import { Contact, UserStatus } from '../types';
import { ArrowLeft, Phone, MessageSquare, Clock, Heart, Zap, Gamepad2, Flame, Mic, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    // Mock fetching specific contact
    db.collection('friends').get().then((friends: Contact[]) => {
      const found = friends.find(f => f.id === id);
      if (found) setContact(found);
    });
  }, [id]);

  if (!contact) return <div className="h-full flex items-center justify-center text-white">Loading...</div>;

  // Helper to render status badge in header
  const getStatusDisplay = (status: UserStatus) => {
    switch(status) {
        case 'gaming':
            return { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', icon: Gamepad2, label: 'Gaming' };
        case 'in-call':
             return { color: 'text-relink-purple', bg: 'bg-relink-purple/10 border-relink-purple/20', icon: Mic, label: 'In Call' };
        case 'online':
             return { color: 'text-relink-neon', bg: 'bg-relink-neon/10 border-relink-neon/20', icon: Activity, label: 'Online' };
        default:
             return { color: 'text-slate-400', bg: 'bg-slate-800/50 border-slate-700', icon: Clock, label: 'Offline' };
    }
  };

  const statusConfig = getStatusDisplay(contact.status);

  return (
    <div className="h-full flex flex-col bg-black relative overflow-y-auto">
      {/* Navbar */}
      <div className="absolute top-0 w-full z-20 p-6 flex justify-between items-center">
        <button onClick={() => navigate('/home')} className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white border border-white/10">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Header Image */}
      <div className="relative h-72 w-full">
         <img src={contact.avatarUrl} className="w-full h-full object-cover opacity-60" />
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
         
         <div className="absolute bottom-0 left-0 w-full p-6">
            <h1 className="text-4xl font-black text-white mb-2">{contact.name}</h1>
            <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider 
                  ${contact.category === 'Close' ? 'bg-relink-purple text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {contact.category}
                </span>
                
                {/* Enhanced Status Badge */}
                <div className={`flex items-center px-3 py-1 rounded-full border backdrop-blur-md ${statusConfig.bg}`}>
                    <statusConfig.icon className={`w-3 h-3 mr-1.5 ${statusConfig.color} ${contact.status === 'in-call' ? 'animate-pulse' : ''}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${statusConfig.color}`}>{statusConfig.label}</span>
                </div>
            </div>
            {contact.currentStatusMsg && (
                <div className="mt-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 inline-block">
                    <p className="text-sm font-medium text-slate-200">"{contact.currentStatusMsg}"</p>
                </div>
            )}
         </div>
      </div>

      <div className="flex-1 px-6 pb-24 -mt-4 relative z-10">
         
         {/* Connection Score Card */}
         <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-relink-neon blur-[60px] opacity-10" />
            <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Connection Health</h3>
                   <p className="text-slate-500 text-[10px]">Based on interactions & depth</p>
                </div>
                <div className="text-4xl font-black text-white">{contact.connectionScore}%</div>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-gradient-to-r from-relink-neon to-relink-blue" style={{ width: `${contact.connectionScore}%` }} />
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
               <div className="flex items-center space-x-2 mb-2 text-relink-purple">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Time Apart</span>
               </div>
               <p className="text-xl font-bold text-white">2 Days</p>
               <p className="text-[10px] text-slate-500">You missed a weekly sync.</p>
            </div>
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
               <div className="flex items-center space-x-2 mb-2 text-relink-hot">
                  <Flame className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Streak</span>
               </div>
               <p className="text-xl font-bold text-white">{contact.streak} 🔥</p>
               <p className="text-[10px] text-slate-500">Keep it burning!</p>
            </div>
         </div>

         {/* Action Buttons */}
         <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Reconnect</h3>
         <div className="space-y-3">
             <button 
                onClick={() => navigate('/call', { state: { contactId: contact.id } })}
                className="w-full bg-white text-black font-black text-lg py-4 rounded-2xl flex items-center justify-center space-x-2 hover:bg-slate-200 transition-colors"
             >
                <Phone className="w-5 h-5 fill-black" />
                <span>Start Voice Session</span>
             </button>
             
             <button 
               onClick={() => navigate(`/game/${contact.id}`)}
               className="w-full bg-slate-800 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center space-x-2 border border-slate-700 hover:bg-slate-700 hover:text-relink-neon hover:border-relink-neon transition-all"
             >
                <Gamepad2 className="w-5 h-5" />
                <span>Invite to Game</span>
             </button>
         </div>

      </div>
    </div>
  );
};

export default ContactDetailScreen;