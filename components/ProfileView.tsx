import React from 'react';
import { UserProfile } from '../types';
import { X, Trophy, Zap, Share2, Settings } from 'lucide-react';
import { XP_LEVELS } from '../constants';

interface ProfileViewProps {
  profile: UserProfile;
  onClose: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onClose }) => {
  const currentLevelXP = 600; // Mock base
  const nextLevelXP = 1000;
  const progress = ((profile.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Navbar */}
      <div className="p-6 flex justify-between items-center z-10">
        <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
          <X className="w-6 h-6" />
        </button>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">My Profile</div>
        <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-relink-neon to-relink-blue mb-4 relative">
             <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=400" alt="User" className="w-full h-full rounded-full object-cover border-4 border-black" />
             <div className="absolute bottom-0 right-0 bg-black rounded-full p-1">
                <div className="bg-relink-neon text-black text-xs font-black px-3 py-1 rounded-full border border-black">
                    LVL {profile.level}
                </div>
             </div>
          </div>
          <h1 className="text-3xl font-black text-white">{profile.name}</h1>
          <p className="text-slate-400 font-medium">@{profile.name.toLowerCase().replace(' ', '')}</p>
        </div>

        {/* Level Card */}
        <div className="glass-panel p-6 rounded-3xl mb-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-relink-blue blur-[60px] opacity-20" />
           
           <div className="flex justify-between items-end mb-2 relative z-10">
              <div>
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Current Level</h3>
                  <div className="text-3xl font-black text-white italic">Socialite</div>
              </div>
              <div className="text-relink-neon font-black text-xl">{profile.xp} XP</div>
           </div>

           <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative z-10">
              <div className="h-full bg-gradient-to-r from-relink-neon to-relink-blue" style={{ width: `${progress}%` }} />
           </div>
           <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-500 uppercase">
              <span>Level {profile.level}</span>
              <span>Level {profile.level + 1}</span>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 p-5 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 bg-relink-hot/20 text-relink-hot rounded-full flex items-center justify-center mb-2">
                    <Trophy className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-white">12</div>
                <div className="text-xs text-slate-500 font-bold uppercase">Day Streak</div>
            </div>
            <div className="bg-white/5 p-5 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 bg-relink-purple/20 text-relink-purple rounded-full flex items-center justify-center mb-2">
                    <Zap className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-white">42</div>
                <div className="text-xs text-slate-500 font-bold uppercase">Calls Made</div>
            </div>
        </div>

        {/* Interests */}
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">My Vibe Tags</h3>
        <div className="flex flex-wrap gap-2 mb-8">
            {profile.interests.length > 0 ? profile.interests.map(tag => (
                <span key={tag} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white">
                    {tag}
                </span>
            )) : (
                <span className="text-slate-500 text-sm">No tags added yet.</span>
            )}
            <button className="px-4 py-2 bg-white/5 border border-dashed border-white/20 rounded-xl text-sm font-bold text-slate-400">
                + Add
            </button>
        </div>

        <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold flex items-center justify-center space-x-2 hover:bg-white/10 transition-colors">
            <Share2 className="w-5 h-5" />
            <span>Share Profile</span>
        </button>

      </div>
    </div>
  );
};

export default ProfileView;