import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Bell } from 'lucide-react';
import { db, acceptRequest } from '../lib/firebase';
import { FriendRequest } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const RequestsScreen = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
      db.collection('requests').get().then((data: any) => {
          setRequests(data);
          setLoading(false);
      });
  };

  const handleAccept = async (req: FriendRequest) => {
      await acceptRequest(req);
      setRequests(prev => prev.filter(r => r.id !== req.id));
  };

  const handleDecline = async (id: string) => {
      await db.collection('requests').delete(id);
      setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-black relative overflow-y-auto">
      {/* Header */}
      <div className="p-6 flex items-center space-x-4 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full text-white border border-white/10 hover:bg-white/10">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-black text-white">Friend Requests</h1>
        <div className="ml-auto bg-relink-neon/10 px-3 py-1 rounded-full border border-relink-neon/20">
            <span className="text-xs font-bold text-relink-neon">{requests.length} Pending</span>
        </div>
      </div>

      <div className="flex-1 p-5">
          {loading ? (
             <div className="text-center text-slate-500 mt-10">Loading...</div>
          ) : requests.length === 0 ? (
             <div className="flex flex-col items-center justify-center mt-20 text-slate-500">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 opacity-50" />
                </div>
                <p className="font-bold">No pending requests</p>
                <p className="text-xs mt-1">Go to Discover to find more people.</p>
                <button onClick={() => navigate('/discovery')} className="mt-6 bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20">
                    Find People
                </button>
             </div>
          ) : (
            <AnimatePresence>
                {requests.map(req => (
                    <motion.div 
                        key={req.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-900 border border-white/10 p-4 rounded-2xl mb-3 flex items-center justify-between"
                    >
                        <div className="flex items-center space-x-4">
                            <img src={req.from.avatarUrl} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                            <div>
                                <h3 className="font-bold text-white text-lg">{req.from.name}</h3>
                                <p className="text-xs text-slate-400">Sent you a request</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => handleDecline(req.id)}
                                className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => handleAccept(req)}
                                className="p-3 bg-relink-neon text-black rounded-xl hover:bg-lime-400 transition-colors shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                            >
                                <Check className="w-5 h-5" strokeWidth={3} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
          )}
      </div>
    </div>
  );
};

export default RequestsScreen;