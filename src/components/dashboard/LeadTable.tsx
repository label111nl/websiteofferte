import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { Lead } from '@/types';
import { Eye, Phone, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef,
  flexRender
} from '@tanstack/react-table';

interface LeadTableProps {
  leads: Lead[];
  onStatusChange?: (id: string, status: Lead['status']) => Promise<void>;
  onCallStatusChange?: (id: string, status: NonNullable<Lead['call_status']>) => void;
  isAdmin?: boolean;
}

export function LeadTable({ leads, onStatusChange, onCallStatusChange, isAdmin }: LeadTableProps) {
  const navigate = useNavigate();

  const columns = React.useMemo<ColumnDef<Lead>[]>(() => [
    {
      accessorKey: 'company_name',
      header: 'Bedrijf',
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <>
            <div className="text-sm font-medium text-gray-900">
              {lead.company_name}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(lead.created_at).toLocaleDateString('nl-NL')}
            </div>
          </>
        );
      }
    },
    {
      accessorKey: 'contact_name',
      header: 'Contact',
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <>
            <div className="text-sm text-gray-900">{lead.contact_name || 'Onbekend'}</div>
            <div className="text-sm text-gray-500">{lead.email || 'Geen email'}</div>
          </>
        );
      }
    },
    {
      accessorKey: 'budget_range',
      header: 'Budget',
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="text-sm text-gray-900">€{lead.budget_range}</div>
        );
      }
    },
    {
      accessorKey: 'timeline',
      header: 'Timeline',
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="text-sm text-gray-900">{lead.timeline}</div>
        );
      }
    },
    {
      accessorKey: 'call_status',
      header: 'Call Status',
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <Select
            value={lead.call_status || 'not_called'}
            onValueChange={(value: 'called' | 'not_called' | 'unreachable') => 
              onCallStatusChange?.(lead.id, value)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue>
                <div className="flex items-center">
                  <Phone className={`h-4 w-4 mr-2 ${getCallStatusColor(lead.call_status || 'not_called')}`} />
                  {lead.call_status === 'called' ? 'Called' :
                   lead.call_status === 'unreachable' ? 'Unreachable' : 
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
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            getStatusColor(lead.status, lead.published)
          }`}>
            {!lead.published && isAdmin ? 'Unpublished' : 
              lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          </span>
        );
      }
    },
    {
      id: 'actions',
      header: 'Acties',
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ 
                to: '/dashboard/leads/$leadId',
                params: { leadId: lead.id }
              })}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {isAdmin && onStatusChange && lead.status === 'pending' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStatusChange(lead.id, 'approved')}
                  className="text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStatusChange(lead.id, 'rejected')}
                  className="text-red-600 hover:text-red-700"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            )}
          </>
        );
      }
    }
  ], [navigate, isAdmin, onStatusChange, onCallStatusChange]);

  const table = useReactTable({
    data: leads,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Geen leads gevonden</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th 
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}