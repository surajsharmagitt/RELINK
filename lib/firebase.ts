import { UserProfile, Contact, FriendRequest } from '../types';

// --- Types ---
export interface User extends UserProfile {
  uid: string;
  email: string;
  avatar: string;
  currentStatusMsg?: string;
}

// --- Mock Data Store ---
const STORE_KEYS = {
  USERS: 'relink_users',
  SESSIONS: 'relink_sessions',
  FRIENDS: 'relink_friends',
  REQUESTS: 'relink_requests'
};

// Helper to get local data
const getCollection = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setCollection = (key: string, data: any[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Auth Service ---
export const auth = {
  currentUser: null as User | null,
  
  signIn: async (email: string) => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));
    
    // Mock user
    const user: User = {
      uid: 'user_123',
      email,
      name: 'You',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200',
      interests: [], // Empty initially
      connectionStyle: null, // Null initially
      onboardingComplete: false, // Needs onboarding
      xp: 0,
      level: 1,
      currentStatusMsg: ''
    };
    
    auth.currentUser = user;
    return user;
  },

  updateProfile: async (updates: Partial<User>) => {
    if (!auth.currentUser) return;
    auth.currentUser = { ...auth.currentUser, ...updates };
    return auth.currentUser;
  },

  updateStatus: async (status: string) => {
      if (!auth.currentUser) return;
      auth.currentUser = { ...auth.currentUser, currentStatusMsg: status };
      return auth.currentUser;
  }
};

// --- Firestore Service ---
export const db = {
  collection: (collectionName: string) => {
    let key = '';
    switch(collectionName) {
      case 'users': key = STORE_KEYS.USERS; break;
      case 'sessions': key = STORE_KEYS.SESSIONS; break;
      case 'friends': key = STORE_KEYS.FRIENDS; break;
      case 'requests': key = STORE_KEYS.REQUESTS; break;
      default: key = `relink_${collectionName}`;
    }

    return {
      add: async (data: any) => {
        const items = getCollection(key);
        // Check if exists for friends/requests
        if (key === STORE_KEYS.FRIENDS) {
            const exists = items.find((i: any) => i.name === data.name);
            if (exists) return exists;
        }
        
        const newItem = { id: Math.random().toString(36).substr(2, 9), ...data, createdAt: new Date().toISOString() };
        items.push(newItem);
        setCollection(key, items);
        return newItem;
      },
      
      get: async () => {
        const items = getCollection(key);
        return items;
      },
      
      update: async (id: string, updates: any) => {
          const items = getCollection(key);
          const index = items.findIndex((i: any) => i.id === id);
          if (index !== -1) {
              items[index] = { ...items[index], ...updates };
              setCollection(key, items);
          }
      },
      
      delete: async (id: string) => {
          const items = getCollection(key);
          const newItems = items.filter((i: any) => i.id !== id);
          setCollection(key, newItems);
      },

      // Simple mock for updating a user doc
      updateUserXP: async (xpAmount: number) => {
        if(auth.currentUser) {
            auth.currentUser.xp += xpAmount;
            // Simple level up logic
            if(auth.currentUser.xp > auth.currentUser.level * 500) {
                auth.currentUser.level += 1;
            }
        }
      }
    };
  }
};

export const acceptRequest = async (request: FriendRequest) => {
    // Add to friends
    const newFriend = {
        name: request.from.name,
        category: 'Casual',
        connectionScore: 50, // Start fresh
        status: 'online',
        avatarUrl: request.from.avatarUrl,
        interests: ['New Friend'],
        xp: 0,
        level: 1,
        lastInteractionDate: new Date().toISOString(),
        currentStatusMsg: "Connected!"
    };
    await db.collection('friends').add(newFriend);
    
    // Remove request
    await db.collection('requests').delete(request.id);
};

// Initialize some mock data if empty
const initMockData = () => {
  const currentFriends = getCollection(STORE_KEYS.FRIENDS);
  if (currentFriends.length === 0) {
    const initialFriends = [
      { 
        id: '1', name: 'Ananya', status: 'online', category: 'Close', connectionScore: 92,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200', 
        xp: 1200, interests: ['Sushi', 'Travel', 'Reality TV'], lastInteractionDate: new Date().toISOString(),
        currentStatusMsg: "Craving pani puri rn 🌮"
      },
      { 
        id: '2', name: 'Arjun', status: 'in-call', category: 'Important', connectionScore: 65,
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200', 
        xp: 450, interests: ['Tech', 'Coding', 'Startups'], lastInteractionDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        currentStatusMsg: "Coding marathon 💻"
      },
      { 
        id: '3', name: 'Diya', status: 'gaming', category: 'Casual', connectionScore: 40,
        avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&h=200', 
        xp: 120, interests: ['Gaming', 'Anime', 'Design'], lastInteractionDate: new Date(Date.now() - 86400000 * 12).toISOString(),
        currentStatusMsg: "Ranked match, do not disturb 🎮"
      },
      { 
        id: '4', name: 'Vivaan', status: 'offline', category: 'Fading', connectionScore: 25,
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200', 
        xp: 800, interests: ['Basketball', 'Sneakers', 'Hip Hop'], lastInteractionDate: new Date(Date.now() - 86400000 * 25).toISOString(),
        currentStatusMsg: "Studying..."
      },
      { 
        id: '5', name: 'Zara', status: 'online', category: 'Close', connectionScore: 88,
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200', 
        xp: 1500, interests: ['Art', 'Museums', 'Wine'], lastInteractionDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        currentStatusMsg: "Art gallery walk? 🎨"
      },
      { 
        id: '6', name: 'Uncle Raj', status: 'offline', category: 'Important', connectionScore: 55,
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200', 
        xp: 200, interests: ['Fishing', 'Politics', 'BBQ'], lastInteractionDate: new Date(Date.now() - 86400000 * 10).toISOString(),
        currentStatusMsg: "Walking in park 🌳"
      }
    ];
    setCollection(STORE_KEYS.FRIENDS, initialFriends);
  }

  // Init requests
  const currentRequests = getCollection(STORE_KEYS.REQUESTS);
  if (currentRequests.length === 0) {
      const initialRequests = [
          {
              id: 'req1',
              from: { name: 'Priya', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200' },
              timestamp: new Date().toISOString(),
              status: 'pending'
          }
      ];
      setCollection(STORE_KEYS.REQUESTS, initialRequests);
  }
};

initMockData();