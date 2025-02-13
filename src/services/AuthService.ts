import { supabase } from '@/lib/supabase';

export class AuthService {
  // Email verificatie
  static async resendVerificationEmail(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify`
      }
    });
    if (error) throw error;
  }

  // Wachtwoord reset
  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password?type=recovery`,
    });
    if (error) throw error;
  }

  // Update wachtwoord
  static async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  }

  // Email update
  static async updateEmail(newEmail: string) {
    const { error } = await supabase.auth.updateUser({
      email: newEmail
    });
    if (error) throw error;
  }

  // Sessie check
  static async checkSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  // Uitloggen
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
} 