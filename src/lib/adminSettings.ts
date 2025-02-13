import { supabase } from '@/lib/supabase'

export const getAdminSettings = async (key: string) => {
  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No settings found, return default values based on key
        switch (key) {
          case 'payment_settings':
            return {
              stripe_mode: 'test',
              stripe_publishable_key: '',
              stripe_secret_key: '',
              lead_price: 3500,
              subscription_price: 15000,
              subscription_trial_days: 0,
              payment_currency: 'eur',
              auto_payout: true,
              payout_schedule: 'weekly',
              minimum_payout_amount: 10000
            };
          case 'lead_matching':
            return {
              min_score: 0.6,
              max_matches_per_lead: 5,
              consider_portfolio: true,
              consider_expertise: true,
              consider_budget: true,
              expertise_weight: 0.4,
              portfolio_weight: 0.3,
              budget_weight: 0.2,
              location_weight: 0.1
            };
          case 'ai_verification':
            return {
              enabled: true,
              min_confidence: 0.8,
              check_spam: true,
              check_quality: true,
              quality_threshold: 0.7,
              spam_threshold: 0.9,
              max_processing_time: 30,
              auto_approve_threshold: 0.95,
              auto_reject_threshold: 0.2,
              language_check: true,
              sentiment_analysis: true
            };
          default:
            return {};
        }
      }
      throw error;
    }

    return data.value;
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    throw error;
  }
};

export const adminSettings = {
  // settings hier
}