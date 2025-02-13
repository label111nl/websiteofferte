import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/store/authStore';
import type { Lead } from '@/types';
import { 
  Building2, 
  Calendar, 
  Clock, 
  Euro, 
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
  XCircle,
  Lock,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import LeadPaymentModal from './LeadPaymentModal';
import { LeadStatusIndicator } from './LeadStatusIndicator';
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface LeadCardProps {
  lead: Lead;
  onStatusChange?: (id: string, status: Lead['status']) => Promise<void>;
  onCallStatusChange?: (id: string, status: NonNullable<Lead['call_status']>) => void;
  isAdmin?: boolean;
}

const LeadCard = ({ lead, onStatusChange, onCallStatusChange, isAdmin }: LeadCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const queryClient = useQueryClient()

  const getStatusColor = (status: string, published?: boolean) => {
    if (!published && isAdmin) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case 'called':
        return 'text-green-600';
      case 'unreachable':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  const handleViewDetails = () => {
    // If user hasn't purchased the lead, show payment modal
    if (!lead.purchasers?.includes(user?.id || '') && !isAdmin) {
      setShowPaymentModal(true);
      return;
    }

    // Otherwise, navigate to details
    navigate({ 
      to: '/shared/leads/$leadId',
      params: { leadId: lead.id },
      search: { 
        tab: 'all' as const,
        sort: 'newest',
        filter: 'all'
      }
    });
  };

  const handlePurchaseSuccess = () => {
    navigate({ 
      to: '/shared/leads/$leadId',
      params: { leadId: lead.id },
      search: { 
        tab: 'all' as const,
        sort: 'created_at',
        filter: ''
      }
    });
  };

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Lead['status'] }) => {
      // ... implementation
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    }
  });

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">
            {lead.company_name}
          </CardTitle>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            getStatusColor(lead.status, lead.published)
          }`}>
            {!lead.published && isAdmin ? 'Niet gepubliceerd' : 
              lead.status === 'approved' ? 'Goedgekeurd' :
              lead.status === 'rejected' ? 'Afgewezen' :
              'In behandeling'}
          </span>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <div className="text-sm text-gray-600">
                  {lead.email || 'Geen email'}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <div className="text-sm text-gray-600">
                  {lead.phone || 'Geen telefoon'}
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Euro className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">€{lead.budget_range}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{lead.timeline}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-2">
              {lead.project_description}
            </p>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex items-center justify-between pt-4 border-t">
                <Select
                  value={lead.call_status || 'not_called'}
                  onValueChange={(value: 'not_called' | 'called' | 'unreachable') => 
                    onCallStatusChange?.(lead.id, value)
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue>
                      <div className="flex items-center">
                        <Phone className={`h-4 w-4 mr-2 ${getCallStatusColor(lead.call_status || 'not_called')}`} />
                        {lead.call_status === 'called' ? 'Gebeld' :
                         lead.call_status === 'unreachable' ? 'Onbereikbaar' : 
                         'Niet gebeld'}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_called">Niet gebeld</SelectItem>
                    <SelectItem value="called">Gebeld</SelectItem>
                    <SelectItem value="unreachable">Onbereikbaar</SelectItem>
                  </SelectContent>
                </Select>

                {lead.status === 'pending' && onStatusChange && (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onStatusChange(lead.id, 'approved')}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Goedkeuren
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onStatusChange(lead.id, 'rejected')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Afwijzen
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* View Details Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleViewDetails}
            >
              {!isAdmin && !lead.purchasers?.includes(user?.id || '') ? (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Unlock Lead
                </>
              ) : (
                <>
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            {/* Credit Cost */}
            <Badge variant="secondary">
              {lead.max_quotes || 2} Credits
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <LeadPaymentModal
        leadId={lead.id}
        creditCost={lead.credit_cost}
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePurchaseSuccess}
      />
    </>
  );
}

export default LeadCard;