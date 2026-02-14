import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INTERESTS, VIBES } from '../constants';
import { UserProfile } from '../types';
import { ArrowRight, Check, Zap } from 'lucide-react';
import { auth } from '../lib/firebase';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  
  // Initialize with existing user data to prevent overwriting avatar/name
  const [profile, setProfile] = useState<UserProfile>({
    name: auth.currentUser?.name || '',
    interests: auth.currentUser?.interests || [],
    connectionStyle: auth.currentUser?.connectionStyle || null,
    onboardingComplete: false,
    xp: auth.currentUser?.xp || 0,
    level: auth.currentUser?.level || 1,
    avatar: auth.currentUser?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200'
  });

  const handleInterestToggle = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-relink-purple/20 via-black to-relink-neon/10" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-relink-purple rounded-full blur-[120px] opacity-30 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-relink-neon rounded-full blur-[100px] opacity-20" />
      </div>

      <AnimatePresence mode='wait'>
        {/* STEP 0: WELCOME */}
        {step === 0 && (
          <motion.div 
            key="step0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="z-10 text-center w-full max-w-md"
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }} 
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-6xl mb-6 inline-block"
            >
              👋
            </motion.div>
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
              Welcome to <span className="text-relink-neon">Relink</span>
            </h1>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              Social media made you lonely. <br/> We're here to fix that. <br/>
              <span className="text-white font-bold">Real calls. Real vibes.</span>
            </p>
            <button onClick={nextStep} className="w-full py-4 bg-white text-black font-black text-xl rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center">
              Let's Go <ArrowRight className="ml-2 w-6 h-6" />
            </button>
          </motion.div>
        )}

        {/* STEP 1: INTERESTS */}
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="z-10 w-full max-w-md"
          >
            <h2 className="text-3xl font-black text-white mb-2">What moves you?</h2>
            <p className="text-slate-400 mb-8">Select at least 3 to find your tribe.</p>
            
            <div className="flex flex-wrap gap-3 mb-10">
              {INTERESTS.map(interest => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-6 py-3 rounded-full text-sm font-bold transition-all border
                    ${profile.interests.includes(interest) 
                      ? 'bg-relink-neon text-black border-relink-neon scale-105 shadow-[0_0_15px_rgba(163,230,53,0.4)]' 
                      : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/30'}`}
                >
                  {interest}
                </button>
              ))}
            </div>
            
            <button 
              onClick={nextStep} 
              disabled={profile.interests.length < 3}
              className="w-full py-4 bg-relink-neon disabled:bg-slate-800 disabled:text-slate-500 text-black font-black text-xl rounded-2xl transition-all flex items-center justify-center"
            >
              Next
            </button>
          </motion.div>
        )}

        {/* STEP 2: VIBE */}
        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="z-10 w-full max-w-md"
          >
            <h2 className="text-3xl font-black text-white mb-2">Your Connection Style</h2>
            <p className="text-slate-400 mb-8">How do you usually like to connect?</p>
            
            <div className="space-y-4 mb-10">
              {VIBES.map(vibe => (
                <button
                  key={vibe.id}
                  onClick={() => setProfile(p => ({...p, connectionStyle: vibe.id as any}))}
                  className={`w-full p-5 rounded-3xl border text-left flex items-center justify-between transition-all
                    ${profile.connectionStyle === vibe.id 
                      ? 'bg-gradient-to-r from-relink-purple/20 to-blue-500/20 border-relink-purple shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{vibe.label}</h3>
                    <p className="text-sm text-slate-400">{vibe.desc}</p>
                  </div>
                  {profile.connectionStyle === vibe.id && <Check className="w-6 h-6 text-relink-purple" />}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => onComplete({...profile, onboardingComplete: true})}
              disabled={!profile.connectionStyle}
              className="w-full py-4 bg-white text-black font-black text-xl rounded-2xl transition-all flex items-center justify-center"
            >
              Finish Setup <Zap className="ml-2 w-5 h-5 fill-black" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;