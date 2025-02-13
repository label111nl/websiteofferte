import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, TrendingUp } from 'lucide-react'
import { notifications } from '@/lib/notifications'

export function CreditSystem() {
  const { user, updateUser } = useAuthStore()
  
  const deductCredits = async (amount: number) => {
    if (!user) return
    
    try {
      // Check if user has enough credits
      if ((user.credits || 0) < amount) {
        throw new Error('Insufficient credits')
      }

      // Update credits in database
      const { error } = await supabase
        .from('users')
        .update({ 
          credits: user.credits - amount 
        })
        .eq('id', user.id)

      if (error) throw error

      // Update local state
      updateUser({ 
        ...user, 
        credits: user.credits - amount 
      })

      // Record transaction
      await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount: -amount,
          type: 'lead_purchase',
          status: 'completed'
        })

      // Show notification if credits are low
      if (user.credits - amount < 5) {
        notifications.warning.lowCredits()
      }

    } catch (error) {
      console.error('Error deducting credits:', error)
      throw error
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Credits Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{user?.credits || 0}</div>
        <p className="text-sm text-muted-foreground">
          Available credits
        </p>
        {user?.credits !== undefined && user.credits < 5 && (
          <p className="text-sm text-yellow-600 mt-2">
            Low credits! Consider purchasing more.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// Export the deductCredits function to be used in other components
export const useCredits = () => {
  const { user } = useAuthStore()
  
  return {
    credits: user?.credits || 0,
    deductCredits: async (amount: number) => {
      // Implementation of deductCredits
    },
    hasEnoughCredits: (amount: number) => (user?.credits || 0) >= amount
  }
} 