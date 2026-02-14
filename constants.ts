import { CallPrompt, Contact, DiscoveryProfile, Circle } from './types';

export const XP_LEVELS = [0, 100, 300, 600, 1000, 1500, 2100, 3000];

export const INTERESTS = [
  "Gaming", "Photography", "Travel", "Music", "Tech", "Art", "Fitness", "Foodie", "Cinema", "Hiking", "Fashion", "Crypto", "Cricket", "Startups"
];

export const VIBES = [
  { id: 'Chill', label: '☕ Chill', desc: 'Low pressure, relaxed chats' },
  { id: 'Deep', label: '🌌 Deep', desc: 'Meaningful, late night talks' },
  { id: 'Energetic', label: '⚡ Energetic', desc: 'Hype, fun, fast paced' },
  { id: 'Gamer', label: '🎮 Gamer', desc: 'Voice chat while playing' },
];

export const MOCK_CIRCLES: Circle[] = [
  {
    id: 'c1',
    name: 'Bangalore Techies',
    description: 'A place to vent about startup life, code, and traffic.',
    avatarUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
    memberCount: 124,
    activeRoom: {
      isActive: true,
      participants: ['p1', 'p2'],
      topic: 'Startup Burnout 🥲'
    },
    tags: ['Tech', 'Deep'],
    isJoined: true
  },
  {
    id: 'c2',
    name: 'Midnight Gamers',
    description: 'Late night Valo and FIFA sessions. No toxic vibes.',
    avatarUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
    memberCount: 89,
    activeRoom: {
      isActive: true,
      participants: ['p4', 'p5'],
      topic: 'Valo Rank Push 🎮'
    },
    tags: ['Gaming', 'Hype'],
    isJoined: true
  },
  {
    id: 'c3',
    name: 'Mumbai Creatives',
    description: 'For filmmakers, designers, and artists in the city.',
    avatarUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=400&q=80',
    memberCount: 240,
    activeRoom: {
      isActive: true,
      participants: ['p7'],
      topic: 'Indie Film Scene 🎥'
    },
    tags: ['Art', 'Design'],
    isJoined: true
  },
  {
    id: 'c4',
    name: 'Book Club',
    description: 'Weekly readings and wine.',
    avatarUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80',
    memberCount: 45,
    activeRoom: { isActive: false, participants: [] },
    tags: ['Reading', 'Chill'],
    isJoined: false
  },
  {
    id: 'c5',
    name: 'Fitness Freaks',
    description: 'Morning run checks and diet tips.',
    avatarUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
    memberCount: 312,
    activeRoom: { isActive: true, participants: ['5'], topic: 'Keto vs Carbs' },
    tags: ['Health', 'Energetic'],
    isJoined: false
  }
];

export const DISCOVERY_PROFILES: DiscoveryProfile[] = [
  {
    id: 'd1',
    name: 'Aarav',
    age: 24,
    university: 'IIT Bombay',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    bio: 'Product Designer by day, amateur guitarist by night. Looking for someone to discuss sci-fi movies and tech trends with over chai.',
    vibeMatch: 94,
    interests: ['Tech', 'Cinema', 'Music', 'Cricket'],
    connectionStyle: 'Deep'
  },
  {
    id: 'd2',
    name: 'Isha',
    age: 22,
    university: 'NIFT',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'Fashion student obsessed with street photography. I love random facetime adventures and discovering hidden cafes.',
    vibeMatch: 88,
    interests: ['Photography', 'Travel', 'Art', 'Fashion'],
    connectionStyle: 'Energetic'
  },
  {
    id: 'd3',
    name: 'Kabir',
    age: 25,
    university: 'Ashoka',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    bio: 'Indie musician and foodie. Let’s jam or just listen to Spotify playlists together. Seeking chill vibes only.',
    vibeMatch: 76,
    interests: ['Music', 'Foodie', 'Chill', 'Philosophy'],
    connectionStyle: 'Chill'
  },
  {
    id: 'd4',
    name: 'Riya',
    age: 23,
    university: 'Delhi Univ',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    bio: 'Psychology major. I love deep talks about the universe and binge-watching anime.',
    vibeMatch: 91,
    interests: ['Psychology', 'Anime', 'Reading'],
    connectionStyle: 'Deep'
  },
  {
    id: 'd5',
    name: 'Vikram',
    age: 26,
    university: 'ISB',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    bio: 'Startup founder. Always hustling but need to reconnect with real humans. Let\'s talk business or basketball.',
    vibeMatch: 82,
    interests: ['Startups', 'Basketball', 'Fitness'],
    connectionStyle: 'Energetic'
  }
];

export const CALL_MODES: CallPrompt[] = [
  {
    mode: 'CatchUp',
    title: 'Vibe Check',
    description: 'Keep the streak alive.',
    questions: ["Best thing this week?", "Current obsession?", "Weekend moves?"],
    color: 'from-blue-500 to-cyan-400'
  },
  {
    mode: 'Deep',
    title: 'Deep Dive',
    description: 'Real talk only.',
    questions: ["Current challenge?", "Life pivot points?", "Self-discovery?"],
    color: 'from-violet-600 to-fuchsia-500'
  },
  {
    mode: 'Fun',
    title: 'Chaos Mode',
    description: 'Random fun.',
    questions: ["Teleport anywhere?", "Weirdest food?", "Hot take?"],
    color: 'from-lime-400 to-emerald-500'
  }
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Ananya',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200',
    category: 'Close',
    connectionScore: 92,
    lastInteractionDate: new Date().toISOString(),
    interactions: [],
    streak: 12,
    status: 'online',
    lastActive: 'Now',
    currentStatusMsg: 'Ready to yap 🗣️',
    vibeMatch: 98,
    xp: 1200,
    level: 5
  },
  {
    id: '2',
    name: 'Arjun',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200',
    category: 'Important',
    connectionScore: 65,
    lastInteractionDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    interactions: [],
    streak: 0,
    status: 'in-call',
    lastActive: '5m ago',
    currentStatusMsg: 'In a Circle',
    vibeMatch: 75,
    xp: 450,
    level: 3
  },
  {
    id: '3',
    name: 'Diya',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&h=200',
    category: 'Casual',
    connectionScore: 40,
    lastInteractionDate: new Date(Date.now() - 86400000 * 12).toISOString(),
    interactions: [],
    streak: 0,
    status: 'offline',
    lastActive: '2h ago',
    currentStatusMsg: 'Gaming 🎮',
    vibeMatch: 50,
    xp: 120,
    level: 2
  }
];