import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../lib/firebase';
import { Check, Star } from 'lucide-react';
import Confetti from 'react-canvas-confetti';

const SummaryScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const duration = location.state?.duration || 0;
  const xpEarned = Math.floor(duration / 10) + 50; // Mock calculation

  useEffect(() => {
    // Save to Firestore logic
    db.collection('users').updateUserXP(xpEarned);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-black relative">
       {/* Simple Confetti Effect on mount would go here */}
       
       <div className="w-24 h-24 bg-relink-neon/20 text-relink-neon rounded-full flex items-center justify-center mb-8 border border-relink-neon/30">
          <Check className="w-12 h-12" />
       </div>

       <h1 className="text-4xl font-black text-white mb-2">Session Complete</h1>
       <p className="text-slate-400 mb-10">You reconnected for {Math.floor(duration / 60)}m {duration % 60}s</p>

       <div className="glass-panel w-full max-w-xs p-6 rounded-3xl mb-8 flex flex-col items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">XP Earned</span>
          <span className="text-5xl font-black text-relink-neon drop-shadow-[0_0_15px_rgba(163,230,53,0.5)]">+{xpEarned}</span>
       </div>

       <div className="flex justify-center space-x-2 mb-10">
          {[1,2,3,4,5].map(s => (
              <Star key={s} className="w-8 h-8 text-yellow-500 fill-yellow-500" />
          ))}
       </div>

       <button 
         onClick={() => navigate('/home')}
         className="w-full max-w-xs bg-white text-black py-4 rounded-2xl font-black text-lg hover:scale-105 transition-transform"
       >
         Done
       </button>
    </div>
  );
};

export default SummaryScreen;