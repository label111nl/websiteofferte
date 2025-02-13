import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem('verificationEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }

    // Get token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      verifyEmail(token);
    }
  }, []);

  const verifyEmail = async (token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      });

      if (error) throw error;

      toast.success('Email verificatie succesvol!');
      localStorage.removeItem('verificationEmail');
      navigate({ to: '/dashboard' });
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Verificatie mislukt. Probeer het opnieuw.');
    }
  };

  const resendVerificationEmail = async () => {
    if (!email) {
      toast.error('Email adres niet gevonden');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      toast.success('Verificatie email opnieuw verzonden!', {
        duration: 5000,
      });
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('Kon verificatie email niet verzenden. Probeer het later opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Mail className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verifieer uw email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We hebben een verificatie link gestuurd naar{' '}
          <span className="font-medium text-blue-600">{email}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500">
                Controleer uw inbox en spam folder voor de verificatie email.
                Klik op de link in de email om uw account te activeren.
              </p>
            </div>

            <div>
              <Button
                onClick={resendVerificationEmail}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Verzenden...' : 'Verstuur verificatie email opnieuw'}
              </Button>
            </div>

            <div className="text-sm text-center">
              <button
                onClick={() => navigate({ to: '/login' })}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Terug naar login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 