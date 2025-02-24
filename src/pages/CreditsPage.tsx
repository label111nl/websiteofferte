import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

const CREDIT_PACKAGES = [
  { id: 'credit-5', credits: 10, price: 50, popular: false },
  { id: 'credit-20', credits: 25, price: 100, popular: true },
  { id: 'credit-50', credits: 50, price: 175, popular: false },
] 

export default function CreditsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (packageId: string) => {
    if (!user) return
    setLoading(packageId)

    try {
      let { data: session, error: sessionError } = await supabase.functions.invoke(
        'create-checkout-session',
        {
          body: { packageId },
        }
      );
      
      if (sessionError) throw sessionError

      // Record transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount: CREDIT_PACKAGES.find(p => p.id === packageId)?.credits || 0,
          type: 'purchase',
          status: 'pending',
          stripe_session_id: session.id
        })
        console.log(transactionError, "SECOND")

      if (transactionError) throw transactionError
       console.log(session, "FIRST")
      // Redirect to Stripe
      // window.location.href = session.url
    } catch (error) {
      toast.error('Error initiating purchase');
    } finally {
      setLoading('')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Purchase Credits</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {CREDIT_PACKAGES.map((pkg) => (
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
                onClick={() => handlePurchase(pkg.id)}
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