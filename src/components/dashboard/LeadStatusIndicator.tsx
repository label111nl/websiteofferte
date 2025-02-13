import { Badge } from '@/components/ui/badge'
import { Lead } from '@/types'
import { Users } from 'lucide-react'

interface LeadStatusIndicatorProps {
  lead: Lead
  showCount?: boolean
}

export function LeadStatusIndicator({ lead, showCount = true }: LeadStatusIndicatorProps) {
  const remainingSpots = 5 - (lead.current_purchases || 0)
  
  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={remainingSpots === 0 ? "destructive" : "secondary"}
        className="flex items-center gap-1"
      >
        <Users className="w-3 h-3" />
        {showCount && `${remainingSpots} spots left`}
      </Badge>
    </div>
  )
} 