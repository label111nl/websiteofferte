import React from 'react';
import DashboardCard from './DashboardCard';
import { Users, FileText, CreditCard, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalLeads: number;
    activeQuotes: number;
    revenue: number;
    conversionRate: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard
        title="Total Leads"
        value={stats.totalLeads}
        icon={<Users className="w-5 h-5" />}
        trend={{ value: 12, isPositive: true }}
        description="Total leads this month"
      />
      <DashboardCard
        title="Active Quotes"
        value={stats.activeQuotes}
        icon={<FileText className="w-5 h-5" />}
        description="Quotes awaiting response"
      />
      <DashboardCard
        title="Revenue"
        value={`€${stats.revenue.toLocaleString()}`}
        icon={<CreditCard className="w-5 h-5" />}
        trend={{ value: 8.2, isPositive: true }}
        description="Total revenue this month"
      />
      <DashboardCard
        title="Conversion Rate"
        value={`${stats.conversionRate}%`}
        icon={<TrendingUp className="w-5 h-5" />}
        trend={{ value: 3.1, isPositive: true }}
        description="Leads to quotes conversion"
      />
    </div>
  );
}