import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

export default function CreditsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<string | null>(null);

  const creditPackages = [
    { id: 'basic', credits: 10, price: 25 },
    { id: 'pro', credits: 25, price: 50 },
    { id: 'business', credits: 50, price: 90 },
  ];

  const handlePurchase = async (packageId: string, amount: number) => {
    if (!user) return;
    setLoading(packageId);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { packageId, userId: user.id, credits: amount }
      });
      if (error) throw error;
      window.location.href = data.url;
    } catch (error) {
      toast.error('Error initiating purchase');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Purchase Credits</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {creditPackages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {pkg.credits} Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">€{pkg.price}</p>
              <Button 
                className="w-full mt-4"
                onClick={() => handlePurchase(pkg.id, pkg.credits)}
                disabled={loading === pkg.id}
              >
                {loading === pkg.id ? 'Processing...' : 'Purchase'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 