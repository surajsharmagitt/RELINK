import React from 'react';
import { useNavigate } from 'react-router-dom';
import Onboarding from '../components/Onboarding';
import { auth } from '../lib/firebase';
import { UserProfile } from '../types';

const OnboardingScreen = () => {
  const navigate = useNavigate();

  const handleComplete = async (profile: UserProfile) => {
    await auth.updateProfile(profile);
    navigate('/home');
  };

  return <Onboarding onComplete={handleComplete} />;
};

export default OnboardingScreen;