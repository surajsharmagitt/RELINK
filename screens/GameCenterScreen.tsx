import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Gamepad2, Brain, Mic2, Sparkles } from 'lucide-react';
import { db } from '../lib/firebase';
import { Contact } from '../types';

const GameCenterScreen = () => {
  const navigate = useNavigate();
  const { contactId } = useParams();
  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (contactId) {
        db.collection('friends').get().then((friends: Contact[]) => {
            const found = friends.find(f => f.id === contactId);
            if(found) setContact(found);
        });
    }
  }, [contactId]);

  const games = [
    { id: 'trivia', name: 'Deep Dive Trivia', desc: 'Test how well you know each other.', icon: Brain, color: 'from-relink-purple to-blue-600', active: true },
    { id: 'questions', name: '20 Questions', desc: 'Guess the secret object.', icon: Sparkles, color: 'from-relink-neon to-green-600', active: true },
    { id: 'karaoke', name: 'Hum & Guess', desc: 'Hum a tune, they guess it.', icon: Mic2, color: 'from-relink-hot to-red-600', active: false },
  ];

  return (
    <div className="h-full flex flex-col bg-black relative overflow-y-auto p-6">
      {/* Navbar */}
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => navigate('/home')} className="p-2 bg-white/5 rounded-full text-white border border-white/10 hover:bg-white/10">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-black text-white">Game Center</h1>
      </div>

      <div className="mb-8 text-center">
         <div className="w-20 h-20 bg-gradient-to-tr from-orange-400 to-red-600 rounded-3xl mx-auto flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(234,88,12,0.4)]">
            <Gamepad2 className="w-10 h-10 text-white" />
         </div>
         <h2 className="text-3xl font-black text-white mb-2">Play {contact ? `with ${contact.name}` : '& Talk'}</h2>
         <p className="text-slate-400">Jump into a quick game while you chat. <br/> No pausing required.</p>
      </div>

      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Available Games</h3>

      <div className="grid gap-4">
        {games.map(game => (
            <button 
                key={game.id}
                onClick={() => {
                    if (game.id === 'trivia') navigate('/play/trivia', { state: { opponent: contact } });
                    else alert("Coming soon!");
                }}
                className="group relative overflow-hidden rounded-3xl p-1 text-left transition-transform hover:scale-[1.02] active:scale-95"
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-20 group-hover:opacity-40 transition-opacity`} />
                <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-[20px] border border-white/10 relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center`}>
                            <game.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white">{game.name}</h4>
                            <p className="text-xs text-slate-400">{game.desc}</p>
                        </div>
                    </div>
                    <div className="bg-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-white group-hover:bg-white group-hover:text-black transition-colors">
                        Play
                    </div>
                </div>
            </button>
        ))}
      </div>
      
      <div className="mt-8 p-6 rounded-3xl bg-white/5 border border-dashed border-white/10 text-center">
         <p className="text-slate-500 text-sm">More casual games coming soon.</p>
      </div>

    </div>
  );
};

export default GameCenterScreen;