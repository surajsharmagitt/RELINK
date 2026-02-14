import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { db } from '../lib/firebase';
import { Contact } from '../types';

const CallScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [duration, setDuration] = useState(0);
  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    const contactId = location.state?.contactId;
    if (contactId) {
        db.collection('friends').get().then((friends: Contact[]) => {
            const found = friends.find(f => f.id === contactId);
            if(found) setContact(found);
        });
    }

    const timer = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(timer);
  }, [location.state]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const endCall = () => {
    navigate('/summary', { state: { duration } });
  };

  if(!contact) return <div className="h-full bg-black flex items-center justify-center text-white">Connecting...</div>

  return (
    <div className="h-full flex flex-col items-center justify-between py-12 px-6 relative overflow-hidden bg-black">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-relink-purple/20 via-black to-black z-0" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-relink-neon blur-[150px] opacity-20 animate-pulse z-0" />

        <div className="text-center mt-12 relative z-10 w-full">
          <div className="w-48 h-48 rounded-[48px] p-1.5 bg-gradient-to-tr from-relink-neon to-relink-purple mb-8 mx-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]">
             <img src={contact.avatarUrl} className="w-full h-full rounded-[42px] object-cover" />
          </div>
          <h2 className="text-4xl font-black mb-4 text-white">{contact.name}</h2>
          <div className="inline-block py-2 px-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="font-mono text-3xl font-bold text-relink-neon tracking-widest">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 relative z-10 text-center">
           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">Topic</p>
           <p className="text-xl font-bold leading-relaxed text-white">
             {contact.currentStatusMsg ? `Ask about: "${contact.currentStatusMsg}"` : '"What is the most unexpected thing that made you happy this week?"'}
           </p>
        </div>

        <button 
          onClick={endCall}
          className="relative z-10 bg-relink-hot hover:bg-red-600 text-white rounded-full p-6 shadow-[0_0_40px_rgba(244,63,94,0.4)] transition-transform hover:scale-105 active:scale-95"
        >
          <Phone className="w-10 h-10 fill-current rotate-[135deg]" />
        </button>
    </div>
  );
};

export default CallScreen;