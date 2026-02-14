import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../lib/firebase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireOnboarding = true }) => {
  // 1. Check if user is logged in
  if (!auth.currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check if user needs onboarding (and isn't already there)
  // If user hasn't finished onboarding, force them to /onboarding
  if (requireOnboarding && !auth.currentUser.onboardingComplete) {
      return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;