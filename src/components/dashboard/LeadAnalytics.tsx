import React from 'react';
import { BarChart, PieChart, Activity } from 'lucide-react';
import { Lead } from '../../types';

interface LeadAnalyticsProps {
  leads: Lead[];
}

export default function LeadAnalytics({ leads }: LeadAnalyticsProps) {
  const calculateMetrics = () => {
    const total = leads.length;
    const approved = leads.filter(l => l.status === 'approved').length;
    const rejected = leads.filter(l => l.status === 'rejected').length;
    const pending = leads.filter(l => l.status === 'pending').length;

    const budgetRanges = leads.reduce((acc, lead) => {
      acc[lead.budget_range] = (acc[lead.budget_range] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      approved,
      rejected,
      pending,
      approvalRate: total ? (approved / total * 100).toFixed(1) : '0',
      budgetDistribution: budgetRanges,
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 mb-6">
          <Activity className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Lead Status Overview</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Leads</p>
            <p className="text-2xl font-semibold">{metrics.total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Approval Rate</p>
            <p className="text-2xl font-semibold">{metrics.approvalRate}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-xl font-semibold text-green-600">{metrics.approved}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-xl font-semibold text-red-600">{metrics.rejected}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Budget Distribution</h3>
        </div>
        
        <div className="space-y-4">
          {Object.entries(metrics.budgetDistribution).map(([range, count]) => (
            <div key={range}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{range}</span>
                <span className="font-medium">{count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 rounded-full h-2"
                  style={{
                    width: `${(count / metrics.total * 100)}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}