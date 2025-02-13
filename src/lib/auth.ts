import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/authStore'

export interface UserWithRole extends User {
  role?: 'admin' | 'marketer';
  credits: number;
  company_name?: string;
  company_kvk?: string;
  company_address?: string;
  company_city?: string;
  company_postal?: string;
  phone?: string;
  services?: string[];
  hourly_rate?: number;
  min_project_size?: number;
  max_project_size?: number;
  subscription_type?: string;
  onboarding_completed?: boolean;
}

export async function signIn(email: string, password: string) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Fetch user role
      const { data: userData, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (roleError) throw roleError;

      return {
        user: { ...authData.user, role: userData.role } as UserWithRole,
        session: authData.session,
      };
    }

    return { user: null, session: null };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

interface MarketerRegistrationData {
  email: string;
  password: string;
  company_name: string;
  company_kvk: string;
  phone: string;
}

export async function signUp(data: MarketerRegistrationData) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          company_name: data.company_name,
          role: 'marketer',
          company_kvk: data.company_kvk,
          phone: data.phone
        },
        emailRedirectTo: `${window.location.origin}/auth/verify`
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Registration failed');

    localStorage.setItem('verificationEmail', data.email);

    // Create basic user profile
    const { error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email: data.email,
        role: 'marketer',
        company_name: data.company_name,
        company_kvk: data.company_kvk,
        phone: data.phone,
        created_at: new Date().toISOString(),
        subscription_type: 'free',
        onboarding_completed: false
      }]);

    if (userError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw userError;
    }

    return {
      user: authData.user,
      session: authData.session,
    };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export function isAdmin(user: UserWithRole | null): boolean {
  return user?.role === 'admin';
}

export function isMarketer(user: UserWithRole | null): boolean {
  return user?.role === 'marketer';
}

export async function getCurrentUser(): Promise<UserWithRole | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: userData, error: roleError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (roleError) throw roleError;

    return { ...user, ...userData } as UserWithRole;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

interface OnboardingData {
  company_address?: string;
  company_city?: string;
  company_postal?: string;
  services: string[];
  hourly_rate?: string;
  min_project_size?: string;
  max_project_size?: string;
}

export async function completeOnboarding(userId: string, data: OnboardingData) {
  try {
    const hourlyRate = data.hourly_rate ? parseInt(data.hourly_rate) : null;
    const minProjectSize = data.min_project_size ? parseInt(data.min_project_size) : null;
    const maxProjectSize = data.max_project_size ? parseInt(data.max_project_size) : null;

    const { error } = await supabase
      .from('users')
      .update({
        company_address: data.company_address || null,
        company_city: data.company_city || null,
        company_postal: data.company_postal || null,
        services: data.services,
        hourly_rate: hourlyRate,
        min_project_size: minProjectSize,
        max_project_size: maxProjectSize,
        onboarding_completed: true
      })
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Onboarding error:', error);
    throw error;
  }
}

export function checkAuth() {
  const { user } = useAuthStore.getState()
  if (!user) throw redirect({ to: '.' })
  return user
}

export function checkAdminAuth() {
  const { user } = useAuthStore.getState()
  if (!user || user.role !== 'admin') throw redirect({ to: '.' })
  return user
} 