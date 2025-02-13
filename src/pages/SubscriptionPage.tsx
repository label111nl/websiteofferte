import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import type { Transaction } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Star, Shield, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

const creditPackages = [
  {
    id: "credit-5",
    name: "Starter Pack",
    credits: 5,
    price: 35,
    description: "Perfect voor het uitproberen van het platform",
    popular: false
  },
  {
    id: "credit-20",
    name: "Growth Pack",
    credits: 20,
    price: 120,
    description: "Meest gekozen door groeiende bedrijven",
    popular: true
  },
  {
    id: "credit-50",
    name: "Scale Pack",
    credits: 50,
    price: 250,
    description: "Voor bedrijven die serieus willen groeien",
    popular: false
  }
];

const subscriptionPlans = [
  {
    id: "pro-monthly",
    name: "Professional",
    price: "€150",
    description: "Onbeperkt leads voor groeiende bedrijven",
    features: [
      "Onbeperkt leads bekijken",
      "Prioriteit bij nieuwe leads",
      "API toegang",
      "Email support",
      "Dashboard analytics"
    ],
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Op maat",
    description: "Voor grote organisaties met specifieke wensen",
    features: [
      "Alles uit Professional",
      "Dedicated account manager",
      "Custom integraties",
      "SLA garantie",
      "Training & onboarding"
    ],
    popular: false
  }
];

export default function SubscriptionPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    setTransactions(data || []);
  };

  const handlePurchaseCredits = async (packageId: string, amount: number) => {
    if (!user) return;
    setLoading(packageId);

    try {
      // Create Stripe checkout session
      const { data: session, error: sessionError } = await supabase
        .functions.invoke('create-checkout-session', {
          body: {
            packageId,
            userId: user.id,
            credits: amount
          }
        });

      if (sessionError) throw sessionError;

      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not loaded');

      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (error) throw error;
    } catch (error) {
      toast.error('Error initiating purchase');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Credits & Abonnementen</h1>
        <p className="text-muted-foreground">
          Kies het pakket dat het beste bij uw bedrijf past
        </p>
      </div>

      {/* Credit Packages */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Credits Kopen</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {creditPackages.map((pkg) => (
            <Card key={pkg.id} className={pkg.popular ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">€{pkg.price}</span>
                  <span className="text-muted-foreground ml-2">/ {pkg.credits} credits</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handlePurchaseCredits(pkg.id, pkg.credits)}
                  disabled={loading === pkg.id}
                >
                  {loading === pkg.id ? "Bezig..." : "Koop Credits"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Subscription Plans */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Abonnementen</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.id} className={plan.popular ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.id !== 'enterprise' && <span className="text-muted-foreground ml-2">/maand</span>}
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Shield className="h-4 w-4 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full">
                  {plan.id === 'enterprise' ? 'Neem Contact Op' : 'Start Abonnement'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <TransactionHistory transactions={transactions} />
    </div>
  );
}