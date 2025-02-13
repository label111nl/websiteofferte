import { useEffect, useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { useAdminAuthStore } from '../store/adminAuthStore';
import type { Lead } from '@/types/index';
import { ArrowLeft, Building2, Mail, Phone, Calendar, Euro, Clock, CheckCircle, XCircle, Building, MapPin, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from 'react-hot-toast';
import AIInsights from '../components/dashboard/AIInsights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';

interface LeadDetailsProps {
  lead: Lead
}

const fetchLead = async (id: string | undefined) => {
  if (!id) return null;
  const { data } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();
  return data;
};

export default function LeadDetailsPage() {
  const { leadId } = useParams({ from: '/dashboard/leads/$leadId' });
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { admin } = useAdminAuthStore();
  const [loading, setLoading] = useState(true);
  const [submittingQuote, setSubmittingQuote] = useState(false);

  const isAdmin = Boolean(admin);

  const { data: lead, isLoading } = useQuery({
    queryKey: ['lead', leadId],
    queryFn: () => fetchLead(leadId)
  });

  const fetchLeadDetails = async () => {
    if (!leadId || !user) return;

    try {
      // Check if user has purchased this lead
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('lead_purchases')
        .select('*')
        .eq('lead_id', leadId)
        .eq('user_id', user.id)
        .single();

      if (purchaseError || !purchaseData) {
        toast.error('U heeft geen toegang tot deze lead');
        navigate({ 
          to: '/shared/leads',
          search: { 
            tab: 'all' as const,
            sort: 'created_at',
            filter: ''
          }
        });
        return;
      }

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error:', error);
      navigate({ 
        to: '/dashboard',
        search: { tab: 'my-leads' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuote = async () => {
    if (!lead || !user) return;

    setSubmittingQuote(true);
    try {
      const { error } = await supabase
        .from('quotes')
        .insert([
          {
            lead_id: lead.id,
            marketer_id: user.id,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      toast.success('Offerte succesvol ingediend!');
      navigate({ 
        to: '/shared/leads',
        search: { 
          tab: 'all' as const,
          sort: 'created_at',
          filter: ''
        }
      });
    } catch (error) {
      toast.error('Fout bij het indienen van de offerte');
    } finally {
      setSubmittingQuote(false);
    }
  };

  const handleStatusChange = async (status: 'approved' | 'rejected') => {
    if (!lead) return;

    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          status,
          published: status === 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', lead.id);

      if (error) throw error;
      
      return { ...lead, status, published: status === 'approved' };
    } catch (error) {
      toast.error('Error updating lead status');
    }
  };

  const handleCallStatusChange = async (callStatus: 'not_called' | 'called' | 'unreachable') => {
    if (!lead) return;

    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          call_status: callStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', lead.id);

      if (error) throw error;
      
      return { ...lead, call_status: callStatus };
    } catch (error) {
      toast.error('Error updating call status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lead) {
    return null;
  }

  const { 
    email, 
    phone, 
    location, 
    technical_requirements,
    call_status 
  } = lead;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '..' })}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug
        </Button>
        {isAdmin && lead.status === 'pending' && (
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => handleStatusChange('approved')}
              className="text-green-600 hover:text-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusChange('rejected')}
              className="text-red-600 hover:text-red-700"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Lead Details</h2>
            {isAdmin && (
              <Select
                value={call_status || 'not_called'}
                onValueChange={(value: string) => 
                  handleCallStatusChange(value as 'not_called' | 'called' | 'unreachable')
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {call_status === 'called' ? 'Called' :
                       call_status === 'unreachable' ? 'Unreachable' : 
                       'Not Called'}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_called">Not Called</SelectItem>
                  <SelectItem value="called">Called</SelectItem>
                  <SelectItem value="unreachable">Unreachable</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Company</p>
                  <p className="text-lg font-medium text-gray-900">{lead.company_name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg font-medium text-gray-900">{email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-lg font-medium text-gray-900">{phone}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Euro className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Budget Range</p>
                  <p className="text-lg font-medium text-gray-900">{lead.budget_range}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Timeline</p>
                  <p className="text-lg font-medium text-gray-900">{lead.timeline}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Created At</p>
                  <p className="text-lg font-medium text-gray-900">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Project Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{lead.project_description}</p>
          </div>

          {isAdmin && (
            <div className="border-t pt-6">
              <AIInsights lead={lead} />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{lead.company_name}</h1>
          <p className="text-muted-foreground mt-2">Project Details</p>
        </div>
        <Button onClick={handleSubmitQuote} disabled={submittingQuote}>
          <Send className="mr-2 h-4 w-4" />
          {submittingQuote ? 'Bezig met indienen...' : 'Dien Offerte In'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bedrijfsinformatie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{lead.company_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{location || 'Locatie niet opgegeven'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{phone}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary">{lead.budget_range}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary">{lead.timeline}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Aangemaakt op {new Date(lead.created_at).toLocaleDateString('nl-NL')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Beschrijving</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p>{lead.project_description}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vereisten & Specificaties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <p className="font-medium">Technische Vereisten</p>
              <p className="text-muted-foreground">{technical_requirements || 'Geen technische vereisten'}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <p className="font-medium">Call Status</p>
              <p className="text-muted-foreground">{call_status || 'Niet gebeld'}</p>
            </div>
          </div>
          {/* Add more requirements sections as needed */}
        </CardContent>
      </Card>
    </div>
  );
}