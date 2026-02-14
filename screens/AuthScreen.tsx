import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { Zap, ArrowRight, Loader, Mail, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (method: 'google' | 'email') => {
    if (loading) return;
    setLoading(true);
    
    try {
      await auth.signIn(method === 'google' ? 'user@gmail.com' : email);
      navigate('/onboarding', { replace: true });
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-relink-purple/20 via-black to-relink-neon/10" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-relink-neon blur-[100px] opacity-20" />
      
      <div className="z-10 w-full max-w-sm text-center">
        <div className="inline-block p-4 rounded-3xl bg-white/5 border border-white/10 mb-8 shadow-[0_0_30px_rgba(163,230,53,0.3)]">
           <Zap className="w-12 h-12 text-relink-neon fill-relink-neon" />
        </div>
        
        <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">Relink</h1>
        <p className="text-slate-400 text-lg mb-12">Social made human again.</p>
        
        <AnimatePresence mode="wait">
          {!showEmail ? (
            <motion.div 
              key="buttons"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
               <button 
                 type="button"
                 onClick={() => handleLogin('google')}
                 disabled={loading}
                 className="w-full bg-white text-black font-black text-xl py-4 rounded-2xl flex items-center justify-center hover:scale-[1.02] transition-transform active:scale-95"
               >
                 {loading ? <Loader className="animate-spin" /> : (
                   <>
                     <span>Continue with Google</span>
                     <ArrowRight className="ml-2 w-5 h-5" />
                   </>
                 )}
               </button>
               
               <button 
                 type="button"
                 onClick={() => setShowEmail(true)}
                 className="w-full bg-white/5 text-white font-bold py-4 rounded-2xl border border-white/10 hover:bg-white/10"
               >
                 Use Email
               </button>
            </motion.div>
          ) : (
            <motion.form
              key="email-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if(email && password) handleLogin('email');
              }}
            >
               <div className="bg-white/5 border border-white/10 rounded-2xl p-1 flex items-center px-4 transition-colors focus-within:border-relink-neon/50">
                  <Mail className="text-slate-500 w-5 h-5 mr-3" />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-transparent w-full py-4 text-white outline-none font-medium placeholder:text-slate-600"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
               </div>
               <div className="bg-white/5 border border-white/10 rounded-2xl p-1 flex items-center px-4 transition-colors focus-within:border-relink-neon/50">
                  <Lock className="text-slate-500 w-5 h-5 mr-3" />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="bg-transparent w-full py-4 text-white outline-none font-medium placeholder:text-slate-600"
                  />
               </div>
               
               <button 
                 type="submit"
                 disabled={loading || !email || !password}
                 className="w-full bg-relink-neon text-black font-black text-xl py-4 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {loading ? <Loader className="animate-spin" /> : 'Log In'}
               </button>

               <button 
                 type="button"
                 onClick={() => setShowEmail(false)}
                 className="text-slate-500 text-sm font-bold mt-4 hover:text-white transition-colors"
               >
                 Cancel
               </button>
            </motion.form>
          )}
        </AnimatePresence>
        
        <p className="mt-8 text-xs text-slate-500">By continuing, you agree to fix your social habits.</p>
      </div>
    </div>
  );
};

export default AuthScreen;