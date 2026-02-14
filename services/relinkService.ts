import { Contact, Interaction } from '../types';

/**
 * Calculates the Connection Index Score (0-100)
 */
export const calculateConnectionScore = (contact: Contact): number => {
  if (!contact.lastInteractionDate) return 10;

  const now = new Date();
  const lastDate = new Date(contact.lastInteractionDate);
  const daysSince = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

  let recencyScore = Math.max(0, 50 - (daysSince * 1.5)); 
  if (daysSince < 3) recencyScore = 50; 

  const recentInteractions = contact.interactions ? contact.interactions.slice(0, 5) : [];
  let depthAvg = 0;
  if (recentInteractions.length > 0) {
    const sum = recentInteractions.reduce((acc, curr) => acc + curr.rating, 0);
    depthAvg = sum / recentInteractions.length;
  }
  const depthScore = (depthAvg / 5) * 30;
  const historyBonus = Math.min(20, recentInteractions.length * 4);

  let totalScore = recencyScore + depthScore + historyBonus;

  if (contact.category === 'Fading') {
    totalScore = totalScore * 0.8;
  }

  return Math.min(100, Math.floor(totalScore));
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Close': return 'text-violet-300 bg-violet-500/20 border-violet-500/30';
    case 'Important': return 'text-lime-300 bg-lime-500/20 border-lime-500/30';
    case 'Casual': return 'text-cyan-300 bg-cyan-500/20 border-cyan-500/30';
    case 'Fading': return 'text-slate-400 bg-slate-700/30 border-slate-600/30';
    default: return 'text-slate-400 bg-slate-800';
  }
};

// Returns a gradient text class or specific color for the score
export const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-relink-neon drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]'; // Glowing Lime
  if (score >= 50) return 'text-cyan-400';
  if (score >= 30) return 'text-amber-400';
  return 'text-rose-400';
};

/**
 * Generates a specific conversation starter based on interests and connection status.
 */
export const generateSmartSuggestion = (contact: Contact) => {
    const interests = contact.interests || [];
    const randomInterest = interests.length > 0 ? interests[Math.floor(Math.random() * interests.length)] : null;
    
    // Logic for Fading relationships
    if (contact.connectionScore < 40) {
        return {
            topic: "Reconnect",
            prompt: `It's been a while. Ask how ${randomInterest ? `their ${randomInterest}` : 'life'} is going.`,
            icon: '👋'
        };
    }

    // Logic for Close relationships
    if (contact.category === 'Close') {
        if (randomInterest) {
            return {
                topic: `Deep Dive: ${randomInterest}`,
                prompt: `Ask what excites them most about ${randomInterest} right now.`,
                icon: '🧠'
            };
        }
        return {
            topic: "Emotional Check-in",
            prompt: "Ask: 'What's been weighing on your mind lately?'",
            icon: '❤️'
        };
    }

    // Default
    return {
        topic: "Catch Up",
        prompt: `Send a meme about ${randomInterest || 'something funny'} or call for 5 mins.`,
        icon: '⚡'
    };
};