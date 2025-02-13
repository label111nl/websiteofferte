import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();

  const handleComplete = async () => {
    await updateUser({ onboarding_completed: true });
    navigate({ to: '/dashboard' });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Welkom bij Website Offerte Aanvragen</h1>
      {/* Add your onboarding steps here */}
      <Button onClick={handleComplete}>Voltooien</Button>
    </div>
  );
} 