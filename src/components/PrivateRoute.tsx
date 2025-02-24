import React from 'react';
import { Navigate, useLocation } from '@tanstack/react-router';
import { useAuthStore } from '../store/authStore';
import { useAdminAuthStore } from '../store/adminAuthStore';

interface PrivateRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function PrivateRoute({ children, adminOnly }: PrivateRouteProps) {
  const { user, isLoading: userLoading } = useAuthStore();
  const { admin, isLoading: adminLoading } = useAdminAuthStore();
  const location = useLocation();
  
  // Show loading spinner during authentication checks
  if (userLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Admin-only routes
  if (adminOnly) {
    if (!admin) {
      return <Navigate 
        to="/admin/login" 
        replace 
        search={{ 
          redirect: location.pathname 
        }} 
      />;
    }
    return <>{children}</>;
  }

  // Regular user routes
  if (!user) {
    return <Navigate 
      to="/login" 
      replace 
      search={{ 
        redirect: location.pathname 
      }} 
    />;
  }

  // Onboarding check
  if (!user.onboarding_completed && location.pathname !== '/dashboard/onboarding') {
    return <Navigate to="/dashboard/onboarding" replace />;
  }

  return <>{children}</>;
}
