import React from 'react';
import { useNavigate } from '@tanstack/react-router';
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
  AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdminLeadCardProps {
  lead: Lead;
  onStatusChange: (id: string, status: Lead['status']) => Promise<void>;
  onCallStatusChange: (id: string, status: NonNullable<Lead['call_status']>) => void;
}

export default function AdminLeadCard({ 
  lead, 
  onStatusChange, 
  onCallStatusChange 
}: AdminLeadCardProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string, published?: boolean) => {
    if (!published) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getCallStatusColor = (status: NonNullable<Lead['call_status']>) => {
    switch (status) {
      case 'called':
        return 'text-green-600';
      case 'unreachable':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  const getCallStatusText = (status: string) => {
    switch (status) {
      case 'called':
        return 'Gebeld';
      case 'unreachable':
        return 'Onbereikbaar';
      default:
        return 'Niet gebeld';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex justify-between pb-2">
        <CardTitle className="text-xl font-semibold">
          {lead.company_name || 'Bedrijfsnaam onbekend'}
        </CardTitle>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            lead.status,
            lead.published
          )}`}
        >
          {!lead.published
            ? 'Niet gepubliceerd'
            : lead.status === 'approved'
            ? 'Goedgekeurd'
            : lead.status === 'rejected'
            ? 'Afgewezen'
            : 'In behandeling'}
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{lead.email || 'Onbekend'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{lead.phone || 'Onbekend'}</span>
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Euro className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">€{lead.budget_range || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{lead.timeline || 'Geen tijdslijn'}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {lead.project_description || 'Geen projectomschrijving beschikbaar'}
          </p>

          {/* AI Verification Status */}
          {lead.ai_verified ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">AI Geverifieerd</span>
            </div>
          ) : null}

          {/* Admin Controls */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Select
              value={lead.call_status || 'not_called'}
              onValueChange={(value) => 
                onCallStatusChange(lead.id, value as NonNullable<Lead['call_status']>)
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue>
                  <div className="flex items-center">
                    <Phone
                      className={`h-4 w-4 mr-2 ${getCallStatusColor(
                        lead.call_status || 'not_called'
                      )}`}
                    />
                    {getCallStatusText(lead.call_status || 'not_called')}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_called">Niet gebeld</SelectItem>
                <SelectItem value="called">Gebeld</SelectItem>
                <SelectItem value="unreachable">Onbereikbaar</SelectItem>
              </SelectContent>
            </Select>

            {lead.status === 'pending' && (
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

          {/* View Details Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate({ to: `/dashboard/leads/${lead.id}` })}
          >
            Bekijk details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
