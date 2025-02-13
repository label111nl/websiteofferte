import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, TrendingUp, DollarSign, Users } from 'lucide-react'
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export function PurchaseAnalytics() {
  const { data: analytics } = useQuery({
    queryKey: ['purchase-analytics'],
    queryFn: async () => {
      const [purchasesData, conversionData] = await Promise.all([
        supabase
          .from('lead_purchases')
          .select('created_at, credits_spent, status')
          .order('created_at', { ascending: true }),
        supabase
          .from('quotes')
          .select('status, created_at')
          .order('created_at', { ascending: true })
      ])

      // Monthly purchases
      const monthlyPurchases = groupByMonth(purchasesData.data || [], 'created_at')
      
      // Conversion rate
      const quotes = conversionData.data || []
      const acceptedQuotes = quotes.filter(q => q.status === 'accepted').length
      const conversionRate = quotes.length ? (acceptedQuotes / quotes.length) * 100 : 0

      // ROI calculation (assuming each accepted quote is worth €1000 on average)
      const totalSpent = (purchasesData.data || []).reduce((sum, p) => sum + p.credits_spent, 0)
      const totalEarned = acceptedQuotes * 1000
      const roi = totalSpent ? ((totalEarned - totalSpent) / totalSpent) * 100 : 0

      return {
        monthlyPurchases,
        conversionRate,
        roi,
        totalSpent,
        totalEarned
      }
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="purchases">
          <TabsList>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
            <TabsTrigger value="roi">ROI</TabsTrigger>
          </TabsList>
          
          <TabsContent value="purchases">
            <ResponsiveContainer>
              <RechartsBarChart data={analytics?.monthlyPurchases}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(str) => {
                    return str.substring(0, 3)
                  }}
                />
                <YAxis />
                <Tooltip labelFormatter={(value) => {
                  return `Purchases: ${value}`
                }} />
                <Bar dataKey="count" fill="#8884d8" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="conversion">
            <div className="grid gap-4 grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {analytics?.conversionRate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Lead to Client Conversion
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {analytics?.totalEarned.toLocaleString('nl-NL', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total Revenue Generated
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="roi">
            <div className="grid gap-4 grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {analytics?.roi.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Return on Investment
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {analytics?.totalSpent.toLocaleString('nl-NL', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total Investment
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function groupByMonth(data: any[], dateField: string) {
  return data.reduce((acc, item) => {
    const month = new Date(item[dateField]).toLocaleString('default', { month: 'short' })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})
} 