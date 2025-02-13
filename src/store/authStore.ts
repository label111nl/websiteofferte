import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { UserWithRole } from '@/lib/auth'

interface AuthState {
  user: UserWithRole | null;
  isLoading: boolean;
  checkUser: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<UserWithRole>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((setState) => ({
  user: null,
  isLoading: true,
  checkUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      setState({ user: null, isLoading: false })
      return
    }
    setState({ user: user as UserWithRole, isLoading: false })
  },
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    setState({ user: data.user as UserWithRole })
  },
  signOut: async () => {
    await supabase.auth.signOut()
    setState({ user: null })
  },
  updateUser: async (data) => {
    const { error } = await supabase.auth.updateUser({ data });
    if (error) throw error;
    setState((state) => ({ 
      user: state.user ? { ...state.user, ...data } : null 
    }));
  },
})) 