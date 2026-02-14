import React, { useState, useEffect } from 'react';
import { Contact, CallModeType } from '../types';
import { CALL_MODES } from '../constants';
import { Phone, X, MessageSquare, Star, Check, Sparkles } from 'lucide-react';

interface CallFlowProps {
  contact: Contact;
  onClose: () => void;
  onCompleteCall: (duration: number, rating: number, mode: CallModeType, notes: string) => void;
}

type Step = 'mode-select' | 'prompts' | 'active-call' | 'reflection';

const CallFlow: React.FC<CallFlowProps> = ({ contact, onClose, onCompleteCall }) => {
  const [step, setStep] = useState<Step>('mode-select');
  const [selectedMode, setSelectedMode] = useState<CallModeType | null>(null);
  const [duration, setDuration] = useState(0); 
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let interval: number;
    if (step === 'active-call') {
      interval = window.setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => setStep('active-call');

  const currentPrompt = CALL_MODES.find(m => m.mode === selectedMode);

  // --- STEP 1: SELECT MODE ---
  if (step === 'mode-select') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col text-white animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="p-6 flex justify-between items-center z-10">
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md">
            <X className="w-6 h-6" />
          </button>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Start Session</div>
          <div className="w-10" />
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 relative">
            {/* Background Gradient Blob */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-relink-purple/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="text-center mb-10 relative z-10">
            <div className="w-28 h-28 rounded-[32px] mx-auto mb-4 p-1 bg-gradient-to-tr from-relink-neon to-relink-purple shadow-2xl">
                <img src={contact.avatarUrl} alt={contact.name} className="w-full h-full rounded-[28px] object-cover bg-black" />
            </div>
            <h1 className="text-4xl font-black text-white mt-2 tracking-tight">{contact.name}</h1>
            <div className="flex items-center justify-center space-x-2 mt-2">
                 <span className="w-2 h-2 bg-relink-neon rounded-full animate-pulse"></span>
                 <p className="text-relink-neon text-sm font-bold uppercase tracking-wider">Online</p>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 pl-1">Choose Vibe</h3>
          
          <div className="space-y-3 relative z-10">
            {CALL_MODES.map((mode) => (
              <button
                key={mode.mode}
                onClick={() => {
                  setSelectedMode(mode.mode);
                  setStep('prompts');
                }}
                className="w-full text-left p-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-relink-neon/50 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <h4 className={`font-black text-xl mb-1 ${mode.mode === 'Fun' ? 'text-relink-hot' : mode.mode === 'Deep' ? 'text-relink-purple' : 'text-relink-neon'}`}>{mode.title}</h4>
                    <p className="text-sm text-slate-400 font-medium">{mode.description}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 2: PROMPTS ---
  if (step === 'prompts') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col text-white">
         <div className="p-6 h-full flex flex-col">
          <button onClick={() => setStep('mode-select')} className="text-slate-400 font-bold text-sm mb-6 flex items-center hover:text-white w-fit">
             ← Back
          </button>
          
          <div className="flex-1 flex flex-col justify-center">
             <div className={`bg-gradient-to-br ${currentPrompt?.color} p-[1px] rounded-[40px] relative`}>
                 <div className="bg-black rounded-[39px] p-8 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${currentPrompt?.color} blur-[80px] opacity-40`}></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 mb-6">
                            <Sparkles className="w-5 h-5 text-white" />
                            <span className="text-white text-xs font-bold uppercase tracking-widest">Starter Pack</span>
                        </div>
                        <h2 className="text-4xl font-black mb-8 leading-tight text-white">{currentPrompt?.title}</h2>
                        
                        <div className="space-y-4">
                        {currentPrompt?.questions.map((q, idx) => (
                            <div key={idx} className="bg-white/10 p-5 rounded-2xl border border-white/5">
                              <p className="font-bold text-lg leading-snug text-slate-100">"{q}"</p>
                            </div>
                        ))}
                        </div>
                    </div>
                 </div>
             </div>
          </div>

          <button 
            onClick={handleStartCall}
            className="w-full bg-relink-neon text-black py-5 rounded-2xl font-black text-xl shadow-[0_0_30px_rgba(163,230,53,0.3)] hover:scale-[1.02] transition-transform flex items-center justify-center space-x-3 mt-8"
          >
            <Phone className="w-6 h-6 fill-black" />
            <span>Start Session</span>
          </button>
        </div>
      </div>
    );
  }

  // --- STEP 3: ACTIVE CALL ---
  if (step === 'active-call') {
    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-between py-12 px-6 overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-relink-purple/20 via-black to-black z-0" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-relink-neon blur-[150px] opacity-20 animate-pulse z-0" />

        <div className="text-center mt-12 relative z-10">
          <div className="w-48 h-48 rounded-[48px] p-1.5 bg-gradient-to-tr from-relink-neon to-relink-purple mb-8 mx-auto relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
             <img src={contact.avatarUrl} alt={contact.name} className="w-full h-full rounded-[42px] object-cover" />
          </div>
          <h2 className="text-5xl font-black mb-4 tracking-tight">{contact.name}</h2>
          <div className="flex items-center justify-center space-x-3 text-relink-neon bg-relink-neon/10 py-3 px-6 rounded-full mx-auto w-fit border border-relink-neon/20 backdrop-blur-md">
            <div className="w-3 h-3 bg-relink-neon rounded-full animate-pulse" />
            <span className="font-mono text-2xl font-bold tracking-widest">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 relative z-10 text-center">
           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">Topic</p>
           <p className="text-2xl font-bold leading-relaxed text-white">
             "{currentPrompt?.questions[0]}"
           </p>
        </div>

        <button 
          onClick={() => setStep('reflection')}
          className="relative z-10 bg-relink-hot hover:bg-red-600 text-white rounded-full p-6 shadow-[0_0_40px_rgba(244,63,94,0.4)] transition-transform hover:scale-105 active:scale-95 mb-8"
        >
          <Phone className="w-12 h-12 fill-current rotate-[135deg]" />
        </button>
      </div>
    );
  }

  // --- STEP 4: REFLECTION ---
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
           <div className="w-24 h-24 bg-relink-neon/20 text-relink-neon rounded-full flex items-center justify-center mx-auto mb-6 border border-relink-neon/30">
             <Check className="w-12 h-12" />
           </div>
           <h2 className="text-4xl font-black text-white">Call Wrapped</h2>
           <p className="text-slate-400 font-mono text-xl mt-2">{formatTime(duration)}</p>
        </div>

        <div className="glass-panel p-8 rounded-[32px] mb-6">
          <label className="block text-sm font-bold text-slate-400 mb-6 text-center uppercase tracking-widest">Rate The Vibe</label>
          <div className="flex justify-center space-x-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-4 rounded-2xl transition-all ${rating >= star ? 'bg-relink-neon text-black shadow-[0_0_15px_rgba(163,230,53,0.5)] scale-110' : 'bg-white/5 text-slate-600 hover:bg-white/10'}`}
              >
                <Star className={`w-7 h-7 ${rating >= star ? 'fill-black' : ''}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-6 rounded-[24px] bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-relink-neon/50 outline-none resize-none placeholder-slate-600 text-lg"
            placeholder="Add a note..."
            rows={3}
          />
        </div>

        <button 
          disabled={rating === 0}
          onClick={() => {
            if (selectedMode) {
              onCompleteCall(duration, rating, selectedMode, notes);
            }
          }}
          className="w-full bg-white text-black py-5 rounded-2xl font-black text-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
        >
          Collect XP
        </button>
      </div>
    </div>
  );
};

export default CallFlow;