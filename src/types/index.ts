export interface Lead {
  id: string;
  company_name: string;
  contact_name?: string;
  email: string;
  phone?: string;
  project_description: string;
  budget_range: string;
  timeline: string;
  location?: string;
  max_quotes: number;
  technical_requirements?: string;
  status: 'pending' | 'approved' | 'rejected';
  call_status?: 'called' | 'unreachable' | 'not_called';
  ai_verified?: boolean;
  price: number;
  published: boolean;
  created_at: string;
  updated_at?: string;
  technologies: string[];
  images: string[];
  max_purchases: number;
  current_purchases: number;
  purchasers: string[];
  credit_cost: number;
}

export interface Quote {
  id: string;
  lead_id: string;
  marketer_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  leads: Lead;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  current_period_end: string;
  created_at: string;
}

export type UserRole = 'admin' | 'marketer';

export interface Transaction {
  id: string;
  created_at: string;
  credits_spent: number;
  type: 'purchase' | 'subscription' | 'lead_purchase';
  description: string;
  lead?: {
    company_name: string;
  };
}

export interface UserWithRole {
  id: string;
  email: string;
  role: 'admin' | 'user';
  company_name?: string;
  company_kvk?: string;
  phone?: string;
  subscription_type?: 'free' | 'premium';
  credits?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: UserWithRole | null;
  isLoading: boolean;
  checkUser: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  stripe_session_id?: string;
  created_at?: string;
  expires_at?: string;
}

export interface LeadPurchase {
  id: string;
  lead_id: string;
  marketer_id: string;
  purchased_at: string;
  credits_spent: number;
  status: 'active' | 'refunded';
}