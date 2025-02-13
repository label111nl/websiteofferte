import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Replace with your Supabase client path
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface AnalyticsData {
  month: string;
  approved: number;
  rejected: number;
}

export function AnalyticsOverview() {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data: analyticsData, error } = await supabase
        .from('lead_analytics') // Replace with your table name
        .select('month, approved_count, rejected_count');

      if (error) {
        console.error('Error fetching analytics data:', error);
        return;
      }

      // Format data for Recharts
      const formattedData = analyticsData.map((item) => ({
        month: item.month,
        approved: item.approved_count,
        rejected: item.rejected_count,
      }));

      setData(formattedData);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Lead Analytics</h2>
      {data.length > 0 ? (
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="approved" stroke="#82ca9d" />
          <Line type="monotone" dataKey="rejected" stroke="#ff6565" />
        </LineChart>
      ) : (
        <div>No analytics data available.</div>
      )}
    </div>
  );
}
