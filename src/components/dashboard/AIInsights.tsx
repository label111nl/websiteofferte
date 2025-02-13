import React from 'react';
import { Brain, TrendingUp, Euro, Clock } from 'lucide-react';
import { Lead } from '../../types';
import { AIService } from '../../services/aiService';

interface AIInsightsProps {
  lead: Lead;
}

export default function AIInsights({ lead }: AIInsightsProps) {
  const [loading, setLoading] = React.useState(true);
  const [analysis, setAnalysis] = React.useState<{
    conversionProbability: number;
    recommendedPrice: number;
    insights: string[];
  } | null>(null);

  React.useEffect(() => {
    const analyzeData = async () => {
      try {
        const aiService = AIService.getInstance();
        const result = await aiService.analyzeLead(lead);
        setAnalysis(result);
      } catch (error) {
        console.error('Error analyzing lead:', error);
      } finally {
        setLoading(false);
      }
    };

    analyzeData();
  }, [lead]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Conversion Probability</p>
            <p className="text-lg font-semibold">
              {(analysis.conversionProbability * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Euro className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Recommended Price</p>
            <p className="text-lg font-semibold">
              €{analysis.recommendedPrice.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Timeline</p>
            <p className="text-lg font-semibold">{lead.timeline}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Key Insights</h4>
        <ul className="space-y-2">
          {analysis.insights.map((insight, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2"></span>
              <span className="text-sm text-gray-600">{insight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}