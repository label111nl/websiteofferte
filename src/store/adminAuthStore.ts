import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { UserWithRole } from '@/types';

interface AdminAuthState {
  admin: UserWithRole | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      isLoading: false,
      signIn: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;

          // Create or update user record
          const { data: userData, error: upsertError } = await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              role: 'admin'
            }, { 
              onConflict: 'id'
            })
            .select()
            .single();

          if (upsertError) throw upsertError;

          set({ 
            admin: {
              ...data.user,
              ...userData,
              role: 'admin'
            } as UserWithRole, 
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      signOut: async () => {
        await supabase.auth.signOut();
        set({ admin: null });
      },
    }),
    {
      name: 'admin-auth',
      partialize: (state: AdminAuthState) => ({ admin: state.admin }),
    }
  )
);