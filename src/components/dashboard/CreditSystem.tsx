import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard } from 'lucide-react'

export function CreditSystem({credits, loading}: { credits: number, loading?: boolean }) {
  const { user } = useAuthStore()
  

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Credits Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ?  
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600" />: 
        <div className="text-2xl font-bold">{credits || 0}</div>}
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
