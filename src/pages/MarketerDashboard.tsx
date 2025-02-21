import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Link } from '@tanstack/react-router';
import {
  ArrowUpRight,
  TrendingUp,
  Users,
  FileText,
  AlertCircle,
  ChevronRight,
  BarChart3,
  DollarSign,
  ArrowDownRight,
  Bell,
  CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Lead, Transaction } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditBalance } from "@/components/credits/CreditBalance";
import { TransactionHistory } from "@/components/credits/TransactionHistory";
import { CreditSystem } from '@/components/dashboard/CreditSystem'
import { PurchaseAnalytics } from '@/components/dashboard/PurchaseAnalytics'
import { LeadTable } from '@/components/dashboard/LeadTable'
import { useQueryClient } from '@tanstack/react-query';

interface Stats {
  totalLeads: number;
  totalSpent: number;
  conversionRate: number;
  credits: number;
}

export default function MarketerDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    totalSpent: 0,
    conversionRate: 0,
    credits: 0
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch user's credits
       const { data: credits, error: userError } = await supabase
        .from("users")
        .select("credits")
        .eq("id", user.id)
        .single(); // Use .single() to get a single record

      if (userError) throw userError;

      // Fetch lead purchases
      const { data: purchases, error: purchasesError } = await supabase
        .from('lead_purchases')
        .select('*')
        .eq('user_id', user.id);

      if (purchasesError) throw purchasesError;

      // Fetch quotes
      const { data: quotes, error: quotesError } = await supabase
        .from('quotes')
        .select('*, leads(*)')
        .eq('marketer_id', user.id)
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;

      // Fetch recent leads
      const { data: recentLeads, error: leadsError } = await supabase
        .from("leads")
        .select("*")
        .eq("published", true)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (leadsError) throw leadsError;

      // Calculate stats
      const totalLeads = recentLeads?.length;
      const totalSpent = totalLeads * 2; // 2 credits per lead
      const successfulQuotes = quotes?.filter(q => q.status === 'accepted').length || 0;
      const conversionRate = totalLeads > 0 ? (successfulQuotes / totalLeads) * 100 : 0;

      setStats({
        totalLeads,
        totalSpent,
        conversionRate,
        credits: credits?.credits || 0
      });
      setRecentLeads(recentLeads || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      setTransactions(data || []);
    };
    fetchTransactions();
  }, []);

  const handleCallStatusChange = (id: string, status: NonNullable<Lead['call_status']>) => {
    queryClient.setQueryData<Lead[]>(['leads'], (prev) => 
      prev?.map(lead => 
          lead.id === id ? { ...lead, call_status: status } : lead
        ) || []
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreditSystem credits={stats.credits} />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalSpent} credits uitgegeven
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversie</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.conversionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Van leads naar klanten
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{(stats.totalSpent * 75).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Geschatte waarde
            </p>
          </CardContent>
        </Card>
      </div>

      <PurchaseAnalytics />

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Leads</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <LeadTable
              leads={recentLeads || []}
              onCallStatusChange={handleCallStatusChange}
              isAdmin={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}