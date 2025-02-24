import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CreditCard, Package } from 'lucide-react'

const CREDIT_PACKAGES = [
  { id: 'small', credits: 10, price: 50, popular: false },
  { id: 'medium', credits: 25, price: 100, popular: true },
  { id: 'large', credits: 50, price: 175, popular: false },
]

interface CreditPurchaseModalProps {
  open: boolean
  onClose?: () => void
}

export function CreditPurchaseModal({ open, onClose }: CreditPurchaseModalProps) {
  const [loading, setLoading] = useState('')
  const { user } = useAuthStore()

  const handlePurchase = async (packageId: string) => {
    if (!user) return
    setLoading(packageId)

    try {
      // Create Stripe checkout session
      const { data: session, error: sessionError } = await supabase
        .functions.invoke('create-checkout-session', {
          body: {
            packageId,
            userId: user.id,
            type: 'credit_purchase'
          }
        })

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

      if (transactionError) throw transactionError

      // Redirect to Stripe
      window.location.href = session.url
    } catch (error) {
      console.error('Purchase error:', error)
    } finally {
      setLoading('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Purchase Credits</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {CREDIT_PACKAGES.map((pkg) => (
            <div 
              key={pkg.id}
              className={`p-4 border rounded-lg ${pkg.popular ? 'border-blue-500 bg-blue-50' : ''}`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span className="font-medium">{pkg.credits} Credits</span>
                </div>
                {pkg.popular && (
                  <span className="text-xs text-blue-600 font-medium">Most Popular</span>
                )}
              </div>
              <div className="text-2xl font-bold mb-4">€{pkg.price}</div>
              <Button 
                className="w-full"
                onClick={() => handlePurchase(pkg.id)}
                disabled={loading === pkg.id}
              >
                {loading === pkg.id ? (
                  'Processing...'
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Purchase
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 