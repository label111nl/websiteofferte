import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Lead } from '../../types';

interface SmartRecommendationsProps {
  leads: Lead[];
}

export default function SmartRecommendations({ leads }: SmartRecommendationsProps) {
  const generateRecommendations = () => {
    const recommendations: Array<{
      type: 'action' | 'insight' | 'opportunity';
      title: string;
      description: string;
    }> = [];

    // Analyze pending leads
    const pendingLeads = leads.filter(l => l.status === 'pending').length;
    if (pendingLeads > 5) {
      recommendations.push({
        type: 'action',
        title: 'High number of pending leads',
        description: `You have ${pendingLeads} leads waiting for review. Consider prioritizing lead assessment to maintain response times.`
      });
    }

    // Analyze high-value opportunities
    const highValueLeads = leads.filter(l => 
      l.status === 'approved' && 
      l.budget_range.includes('20000')
    ).length;

    if (highValueLeads > 0) {
      recommendations.push({
        type: 'opportunity',
        title: 'High-value projects available',
        description: `There are ${highValueLeads} high-budget projects available. These should be prioritized for detailed proposals.`
      });
    }

    // Analyze market trends
    const recentLeads = leads.filter(l => 
      new Date(l.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    if (recentLeads.length > 10) {
      const commonBudget = findMostCommonBudget(recentLeads);
      recommendations.push({
        type: 'insight',
        title: 'Market trend detected',
        description: `Most recent projects fall in the ${commonBudget} budget range. Consider optimizing your proposals for this segment.`
      });
    }

    return recommendations;
  };

  const findMostCommonBudget = (leads: Lead[]) => {
    const budgetCounts: Record<string, number> = {};
    leads.forEach(lead => {
      budgetCounts[lead.budget_range] = (budgetCounts[lead.budget_range] || 0) + 1;
    });

    return Object.entries(budgetCounts).reduce((a, [key, value]) => {
      const [prevKey, prevValue] = a;
      return value > prevValue ? [key, value] : a;
    }, ['', 0])[0];
  };

  const recommendations = generateRecommendations();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Lightbulb className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Smart Recommendations</h3>
      </div>

      <div className="space-y-6">
        {recommendations.map((recommendation, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              recommendation.type === 'action'
                ? 'border-blue-200 bg-blue-50'
                : recommendation.type === 'opportunity'
                ? 'border-green-200 bg-green-50'
                : 'border-yellow-200 bg-yellow-50'
            }`}
          >
            <h4 className="font-medium text-gray-900 mb-2">{recommendation.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>
            <button className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
              Take Action
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}