import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { auth } from './lib/firebase';
import { LayoutGrid, Users, Compass, Hash } from 'lucide-react';
import RadialMenu from './components/RadialMenu';
import ProtectedRoute from './components/ProtectedRoute';

// Screens
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import DiscoveryScreen from './screens/DiscoveryScreen';
import CirclesScreen from './screens/CirclesScreen';
import ProfileScreen from './screens/ProfileScreen';
import CallScreen from './screens/CallScreen';
import SummaryScreen from './screens/SummaryScreen';
import ContactDetailScreen from './screens/ContactDetailScreen';
import GameCenterScreen from './screens/GameCenterScreen';
import CircleRoomScreen from './screens/CircleRoomScreen';
import TriviaGameScreen from './screens/TriviaGameScreen';
import RequestsScreen from './screens/RequestsScreen';
import OnboardingScreen from './screens/OnboardingScreen';

// --- Components ---

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname;

  const tabs = [
    { id: '/home', icon: LayoutGrid, label: 'Home', color: 'text-relink-neon' },
    { id: '/circles', icon: Hash, label: 'Circles', color: 'text-relink-purple' },
    { id: 'spacer' }, // Space for FAB
    { id: '/discovery', icon: Compass, label: 'Discover', color: 'text-relink-hot' },
    { id: '/profile', icon: Users, label: 'Profile', color: 'text-relink-blue' },
  ];

  // Hide nav on these screens
  if (['/login', '/call', '/summary', '/game', '/room', '/play', '/requests', '/onboarding'].some(path => location.pathname.includes(path))) return null;

  return (
    <div className="absolute bottom-0 w-full h-24 z-30 pointer-events-none">
       <div className="absolute bottom-0 w-full h-20 bg-black/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-6 pb-2 pointer-events-auto">
          {tabs.map((tab, i) => {
            if (tab.id === 'spacer') return <div key={i} className="w-12" />;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => navigate(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center space-y-1 ${isActive ? tab.color : 'text-slate-600'}`}
              >
                <tab.icon className="w-6 h-6" />
                <span className="text-[9px] font-bold">{tab.label}</span>
              </button>
            )
          })}
       </div>
       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
          <RadialMenu onAction={(action) => {
             if(action === 'call') navigate('/home'); // In a real app this opens a contact picker
             if(action === 'add') navigate('/discovery');
             if(action === 'group') navigate('/circles');
             if(action === 'game') navigate('/game/global'); 
          }} />
       </div>
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={<Page><AuthScreen /></Page>} />
        
        {/* Protected Routes */}
        <Route path="/onboarding" element={
            <ProtectedRoute requireOnboarding={false}>
                <Page><OnboardingScreen /></Page>
            </ProtectedRoute>
        } />
        
        <Route path="/home" element={<ProtectedRoute><Page><HomeScreen /></Page></ProtectedRoute>} />
        <Route path="/discovery" element={<ProtectedRoute><Page><DiscoveryScreen /></Page></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><Page><RequestsScreen /></Page></ProtectedRoute>} />
        <Route path="/circles" element={<ProtectedRoute><Page><CirclesScreen /></Page></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Page><ProfileScreen /></Page></ProtectedRoute>} />
        <Route path="/contact/:id" element={<ProtectedRoute><Page><ContactDetailScreen /></Page></ProtectedRoute>} />
        <Route path="/call" element={<ProtectedRoute><Page><CallScreen /></Page></ProtectedRoute>} />
        <Route path="/summary" element={<ProtectedRoute><Page><SummaryScreen /></Page></ProtectedRoute>} />
        <Route path="/game/:contactId" element={<ProtectedRoute><Page><GameCenterScreen /></Page></ProtectedRoute>} />
        <Route path="/play/trivia" element={<ProtectedRoute><Page><TriviaGameScreen /></Page></ProtectedRoute>} />
        <Route path="/room/:circleId" element={<ProtectedRoute><Page><CircleRoomScreen /></Page></ProtectedRoute>} />
        
        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AnimatePresence>
  );
};

const Page = ({ children }: { children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
    className="h-full w-full bg-black flex flex-col"
  >
    {children}
  </motion.div>
);

const App = () => {
  return (
    <Router>
      <div className="h-screen w-full bg-black text-slate-200 font-sans overflow-hidden flex flex-col relative">
        <AnimatedRoutes />
        <BottomNav />
      </div>
    </Router>
  );
};

export default App;