import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useUserCredits(userId?: string) {
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const fetchCredits = async () => {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('amount, type')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching credits:', error);
        return;
      }

      const totalCredits = data.reduce((total, transaction) => {
        return total + transaction.amount;
      }, 0);

      setCredits(totalCredits);
    };

    fetchCredits();
  }, [userId]);

  return credits;
} 