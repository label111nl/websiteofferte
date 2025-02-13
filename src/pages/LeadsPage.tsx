import React, { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import LeadCard from '../components/dashboard/LeadCard';
import LeadFilters from '../components/dashboard/LeadFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lead, Quote } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Euro, Filter, Clock, Building, CreditCard } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTable } from '@/lib/table'
import type { ColumnDef, CellContext } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { useLeads, useUpdateLead } from '@/hooks/queries/useLeads'
import { formatDate } from '@/lib/utils'
import { CreditPurchaseModal } from '@/components/credits/CreditPurchaseModal'

interface SearchParams {
  tab: 'available' | 'my-leads';
}

type LeadTableCell = CellContext<Lead, any>;

const fetchLeads = async () => {
  const { data } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  return data;
};

const updateLeadFn = async ({ id, ...data }: Partial<Lead> & { id: string }) => {
  const { data: updatedLead } = await supabase
    .from('leads')
    .update(data)
    .eq('id', id)
    .single();
  return updatedLead;
};

const fetchLead = async (id: string) => {
  const { data } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();
  return data;
};

export default function LeadsPage() {
  const navigate = useNavigate();
  const search = useSearch({
    from: '/dashboard',
    select: (params: Record<string, string>) => ({
      tab: (params.tab || 'available') as SearchParams['tab']
    })
  });
  const { user } = useAuthStore();
  const [availableLeads, setAvailableLeads] = React.useState<Lead[]>([]);
  const [myLeads, setMyLeads] = React.useState<Quote[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [credits, setCredits] = useState(0);
  const [purchasingLead, setPurchasingLead] = useState<string | null>(null);
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState({})
  const [sort, setSort] = useState({ field: 'created_at', direction: 'desc' })
  const [showCreditModal, setShowCreditModal] = useState(false)

  const currentTab = search.tab || 'available';

  const { data: leads } = useQuery({
    queryKey: ['leads'],
    queryFn: fetchLeads
  })

  const updateLead = useMutation({
    mutationFn: updateLeadFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  })

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: (info: LeadTableCell) => (
        <div className="font-medium">{info.getValue()}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info: LeadTableCell) => (
        <Badge variant={info.getValue() === 'approved' ? 'success' : 'secondary'}>
          {info.getValue()}
        </Badge>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: (info: LeadTableCell) => formatDate(info.getValue()),
    },
    {
      id: 'actions',
      cell: (info: LeadTableCell) => {
        const lead = info.row.original;
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" onClick={() => handleViewLead(lead.id)}>
              View Details
            </Button>
            {user && user.role === 'admin' && (
              <>
                <Button variant="ghost" onClick={() => handleEditLead(lead.id)}>
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => handleDeleteLead(lead.id)}>
                  Delete
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ]

  const table = useTable({
    data: leads ?? [],
    columns,
  })

  useEffect(() => {
    fetchLeads();
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setCredits(data.credits || 0);
    } catch (error) {
      toast.error('Error fetching credits');
    }
  };

  const handleFilterChange = (filters: {
    search: string;
    budgetRange: string;
    timeline: string;
  }) => {
    // Filter leads based on search criteria
    const filteredLeads = availableLeads.filter(lead => {
      const matchesSearch = !filters.search || (
        lead.company_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.project_description?.toLowerCase().includes(filters.search.toLowerCase())
      );

      const matchesBudget = !filters.budgetRange || lead.budget_range === filters.budgetRange;
      const matchesTimeline = !filters.timeline || lead.timeline === filters.timeline;

      return matchesSearch && matchesBudget && matchesTimeline;
    });

    setAvailableLeads(filteredLeads);
  };

  const handlePurchaseLead = async (leadId: string) => {
    if (!user) return;
    
    const lead = availableLeads.find(lead => lead.id === leadId);
    if (!lead) return;

    if (credits < lead.price) {
      toast.error('Onvoldoende credits. Koop meer credits om deze lead te bekijken.');
      return;
    }

    setPurchasingLead(leadId);
    try {
      // Start transaction
      const { error: purchaseError } = await supabase
        .from('lead_purchases')
        .insert([
          {
            lead_id: leadId,
            user_id: user.id,
            credits_spent: lead.price
          }
        ]);

      if (purchaseError) throw purchaseError;

      // Update user credits
      const { error: creditError } = await supabase
        .from('users')
        .update({ credits: credits - lead.price })
        .eq('id', user.id);

      if (creditError) throw creditError;

      setCredits(prev => prev - lead.price);
      toast.success('Lead succesvol gekocht!');
      navigate({ to: `/dashboard/leads/${leadId}` });
    } catch (error) {
      toast.error('Error purchasing lead');
    } finally {
      setPurchasingLead(null);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Lead>) => {
    await updateLead.mutateAsync({ 
      id, 
      ...data
    });
  };

  const handleViewLead = (id: string) => {
    navigate({ to: `/leads/${id}` });
  };

  const handleEditLead = (id: string) => {
    // Implement edit lead functionality
  };

  const handleDeleteLead = (id: string) => {
    // Implement delete lead functionality
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Leads Overview</h1>

      <Tabs defaultValue={currentTab}>
        <TabsList>
          <TabsTrigger value="available">Beschikbare Leads</TabsTrigger>
          <TabsTrigger value="my-leads">Mijn Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Beschikbare Leads</h1>
                <p className="text-muted-foreground">
                  Bekijk en koop leads met uw credits
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-base px-4 py-2">
                  <Euro className="w-4 h-4 mr-2" />
                  {credits} credits
                </Badge>
                <Button onClick={() => setShowCreditModal(true)}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Buy Credits
                </Button>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">€1000 - €5000</SelectItem>
                  <SelectItem value="medium">€5000 - €10000</SelectItem>
                  <SelectItem value="high">€10000+</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="webshop">Webshop</SelectItem>
                  <SelectItem value="application">Applicatie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <LeadFilters 
              onFilterChange={setFilters}
              onSortChange={setSort}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableLeads.map((lead) => (
                <Card key={lead.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{lead.company_name}</span>
                      <Badge variant="secondary">
                        {lead.price} Credits
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {lead.project_description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Euro className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{lead.budget_range}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{lead.timeline}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{lead.location || 'Nederland'}</span>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" disabled={credits < lead.price}>
                          {credits < lead.price ? 'Onvoldoende credits' : 'Bekijk Lead'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Lead Kopen</DialogTitle>
                          <DialogDescription>
                            Weet je zeker dat je deze lead wilt kopen voor {lead.price} credits?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setPurchasingLead(null)}
                          >
                            Annuleren
                          </Button>
                          <Button 
                            onClick={() => handlePurchaseLead(lead.id)}
                            disabled={purchasingLead === lead.id}
                          >
                            {purchasingLead === lead.id ? 'Bezig...' : 'Bevestigen'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
              {availableLeads.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-500">Geen beschikbare leads gevonden</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-leads">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myLeads.map((quote) => (
              <LeadCard
                key={quote.id}
                lead={quote.leads as Lead}
              />
            ))}
            {myLeads.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500">Je hebt nog geen leads</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <DataTable 
        table={table}
        searchKey="title"
        showPagination
        data={leads ?? []}
        onUpdate={handleUpdate}
        isUpdating={updateLead.isPending}
      />

      <CreditPurchaseModal 
        open={showCreditModal}
        onClose={() => setShowCreditModal(false)}
      />
    </div>
  );
}