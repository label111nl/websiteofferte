import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function handleCallback() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          toast.success('Email verificatie succesvol!');
        }
        
        navigate({ to: '/login' });
      } catch (error) {
        console.error('Verificatie error:', error);
        toast.error('Er ging iets mis bij de verificatie');
        navigate({ to: '/login' });
      } finally {
        setLoading(false);
      }
    }

    handleCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Bezig met verwerken...</p>
        </div>
      </div>
    );
  }

  return null;
} 