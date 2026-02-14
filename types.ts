export type RelationshipCategory = 'Close' | 'Important' | 'Casual' | 'Fading';
export type CallModeType = 'CatchUp' | 'Deep' | 'Repair' | 'Celebration' | 'Fun';
export type ConnectionVibe = 'Chill' | 'Deep' | 'Energetic' | 'Late Night' | 'Gamer';
export type UserStatus = 'online' | 'offline' | 'in-call' | 'gaming';

export interface Interaction {
  id: string;
  date: string; // ISO string
  type: 'voice' | 'text' | 'game';
  durationMinutes: number;
  mode?: CallModeType;
  rating: number; // 1-5
  notes?: string;
  xpEarned: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface Circle {
  id: string;
  name: string;
  avatarUrl: string;
  memberCount: number;
  description: string;
  activeRoom: {
    isActive: boolean;
    participants: string[]; // User IDs
    topic?: string;
  };
  tags: string[];
  isJoined?: boolean; 
}

export interface Contact {
  id: string;
  name: string;
  avatarUrl: string;
  category: RelationshipCategory;
  connectionScore: number; // 0-100
  lastInteractionDate: string | null;
  interactions: Interaction[];
  streak: number;
  status: UserStatus;
  lastActive: string;
  vibeMatch?: number; // 0-100%
  interests?: string[];
  currentStatusMsg?: string;
  xp: number;
  level: number;
}

export interface DiscoveryProfile {
  id: string;
  name: string;
  age: number;
  university?: string;
  avatarUrl: string;
  bio: string;
  vibeMatch: number;
  interests: string[];
  connectionStyle: ConnectionVibe;
}

export interface FriendRequest {
  id: string;
  from: {
    name: string;
    avatarUrl: string;
  };
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface CallPrompt {
  mode: CallModeType;
  title: string;
  description: string;
  questions: string[];
  color: string;
}

export interface UserProfile {
  name: string;
  interests: string[];
  connectionStyle: ConnectionVibe | null;
  onboardingComplete: boolean;
  xp: number;
  level: number;
  avatar: string;
}