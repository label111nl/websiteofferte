import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

// Load the Stripe instance with the publishable key
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

// Define types for the parameters
interface CreateSubscriptionParams {
  priceId: string;
  userId: string;
  successUrl?: string;
  cancelUrl?: string;
}

interface CreateLeadPaymentParams {
  leadId: string;
  userId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export const stripeService = {
  /**
   * Create a subscription for a user
   */
  createSubscription: async ({
    priceId,
    userId,
    successUrl = `${window.location.origin}/dashboard`,
    cancelUrl = `${window.location.origin}/dashboard/subscription`,
  }: CreateSubscriptionParams) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: {
          priceId,
          userId,
          successUrl,
          cancelUrl,
        },
      });

      if (error) {
        console.error('Error creating subscription:', error);
        throw new Error('Failed to create subscription. Please try again.');
      }

      return data;
    } catch (error) {
      console.error('Unexpected error during subscription creation:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred.');
    }
  },

  /**
   * Create a lead payment for a user
   */
  createLeadPayment: async ({
    leadId,
    userId,
    successUrl = `${window.location.origin}/dashboard/leads`,
    cancelUrl = `${window.location.origin}/dashboard/leads`,
  }: CreateLeadPaymentParams) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-lead-payment', {
        body: {
          leadId,
          userId,
          successUrl,
          cancelUrl,
        },
      });

      if (error) {
        console.error('Error creating lead payment:', error);
        throw new Error('Failed to create lead payment. Please try again.');
      }

      return data;
    } catch (error) {
      console.error('Unexpected error during lead payment creation:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred.');
    }
  },

  /**
   * Cancel a subscription by its ID
   */
  cancelSubscription: async (subscriptionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('cancel-subscription', {
        body: { subscriptionId },
      });

      if (error) {
        console.error('Error canceling subscription:', error);
        throw new Error('Failed to cancel subscription. Please try again.');
      }

      return data;
    } catch (error) {
      console.error('Unexpected error during subscription cancellation:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred.');
    }
  },

  /**
   * Get the customer portal URL for a user
   */
  getCustomerPortalUrl: async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: { userId },
      });

      if (error) {
        console.error('Error retrieving customer portal URL:', error);
        throw new Error('Failed to retrieve customer portal URL. Please try again.');
      }

      if (!data || !data.url) {
        throw new Error('Invalid response from server.');
      }

      return data.url;
    } catch (error) {
      console.error('Unexpected error during portal URL retrieval:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred.');
    }
  },
};
