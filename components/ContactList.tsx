import React, { useState } from 'react';
import { Contact, RelationshipCategory, UserStatus } from '../types';
import { getCategoryColor, getScoreColor } from '../services/relinkService';
import { Phone, Clock, Gamepad2, Mic, Activity } from 'lucide-react';

interface ContactListProps {
  contacts: Contact[];
  onSelect: (contactId: string) => void;
  onCall: (contactId: string) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onSelect, onCall }) => {
  const [filter, setFilter] = useState<RelationshipCategory | 'All'>('All');

  const categories: (RelationshipCategory | 'All')[] = ['All', 'Close', 'Important', 'Casual', 'Fading'];

  const filteredContacts = filter === 'All' 
    ? contacts 
    : contacts.filter(c => c.category === filter);

  // Helper for status border gradients
  const getStatusBorder = (status: UserStatus) => {
    switch (status) {
      case 'online': return 'from-relink-neon to-relink-blue';
      case 'in-call': return 'from-relink-purple to-relink-hot';
      case 'gaming': return 'from-orange-500 to-red-500';
      default: return 'from-slate-700 to-slate-800';
    }
  };

  // Helper for status icons badge
  const StatusBadge = ({ status }: { status: UserStatus }) => {
    switch (status) {
      case 'gaming':
        return (
          <div className="absolute -bottom-2 -right-2 bg-orange-500 w-6 h-6 rounded-full border-2 border-black flex items-center justify-center shadow-sm z-10">
            <Gamepad2 className="w-3 h-3 text-white" />
          </div>
        );
      case 'in-call':
        return (
          <div className="absolute -bottom-2 -right-2 bg-relink-purple w-6 h-6 rounded-full border-2 border-black flex items-center justify-center shadow-sm z-10 animate-pulse">
            <Mic className="w-3 h-3 text-white" />
          </div>
        );
      case 'online':
        return (
          <div className="absolute -bottom-1 -right-1 bg-relink-neon w-4 h-4 rounded-full border-2 border-black z-10" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all
              ${filter === cat 
                ? 'bg-relink-neon text-relink-dark shadow-[0_0_15px_rgba(163,230,53,0.4)]' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredContacts.map(contact => (
          <div 
            key={contact.id} 
            className="glass-panel p-4 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-slate-800/80 transition-all active:scale-[0.98]"
            onClick={() => onSelect(contact.id)}
          >
            <div className="flex items-center space-x-4">
               {/* Avatar with Status Indicator */}
               <div className={`w-14 h-14 rounded-2xl p-[2px] bg-gradient-to-br ${getStatusBorder(contact.status)} relative`}>
                 <img src={contact.avatarUrl} alt={contact.name} className="w-full h-full rounded-[14px] object-cover border border-black/50" />
                 <StatusBadge status={contact.status} />
               </div>
               
               <div>
                 <h3 className="font-bold text-lg text-slate-100">{contact.name}</h3>
                 <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide ${getCategoryColor(contact.category)}`}>
                      {contact.category}
                    </span>
                    {contact.lastInteractionDate && (
                      <span className="flex items-center text-[10px] text-slate-500 font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        {Math.floor((Date.now() - new Date(contact.lastInteractionDate).getTime()) / (1000 * 3600 * 24))}d ago
                      </span>
                    )}
                 </div>
               </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className={`block text-xl font-black leading-none ${getScoreColor(contact.connectionScore)}`}>
                  {contact.connectionScore}
                </span>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onCall(contact.id);
                }}
                className="bg-slate-800 p-3 rounded-2xl text-slate-300 hover:bg-relink-neon hover:text-black transition-colors border border-slate-700"
              >
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;