import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function AdvancedAnalytics() {
  const { data: analytics } = useQuery({
    queryKey: ['advanced-analytics'],
    queryFn: async () => {
      const [purchaseData, leadData, quoteData] = await Promise.all([
        // Purchase trends
        supabase
          .from('credit_transactions')
          .select('amount, created_at')
          .order('created_at'),
        
        // Lead categories
        supabase
          .from('leads')
          .select('budget_range, timeline'),
          
        // Quote success rate
        supabase
          .from('quotes')
          .select('status')
      ])

      // Process purchase trends
      const trends = groupByMonth(purchaseData.data || [], 'created_at', 'amount')

      // Process lead categories
      const categories = (leadData.data || []).reduce((acc: Record<string, number>, lead) => {
        acc[lead.budget_range] = (acc[lead.budget_range] || 0) + 1
        return acc
      }, {})

      // Process quote success
      const quotes = (quoteData.data || [])
      const successRate = quotes.length ? 
        (quotes.filter(q => q.status === 'accepted').length / quotes.length) * 100 : 0

      return {
        trends,
        categories: Object.entries(categories).map(([name, value]) => ({
          name,
          value
        })),
        successRate
      }
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends">
          <TabsList>
            <TabsTrigger value="trends">Purchase Trends</TabsTrigger>
            <TabsTrigger value="categories">Lead Categories</TabsTrigger>
            <TabsTrigger value="success">Success Rate</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <div className="h-[300px]">
              <ResponsiveContainer>
                <LineChart data={analytics?.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="h-[300px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={analytics?.categories}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {analytics?.categories.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="success">
            <div className="flex justify-center items-center h-[300px]">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600">
                  {analytics?.successRate.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Quote Success Rate
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function groupByMonth(data: any[], dateField: string, valueField: string) {
  return Object.entries(
    data.reduce((acc, item) => {
      const month = new Date(item[dateField]).toLocaleString('default', { month: 'short' })
      acc[month] = (acc[month] || 0) + (item[valueField] || 0)
      return acc
    }, {})
  ).map(([month, amount]) => ({ month, amount }))
} 