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
  flexRender,
} from "@tanstack/react-table";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Input } from "../ui";
import { useCredits } from '@/hooks/useCredits';

interface LeadTableProps {
  leads: Lead[];
  onStatusChange?: (id: string, status: Lead["status"]) => Promise<void>;
  onCallStatusChange?: (
    id: string,
    status: NonNullable<Lead["call_status"]>
  ) => void;
  isAdmin?: boolean;
  onPublishLead?: (
    id: string,
    publish: NonNullable<Lead["published"]>,
    price: number
  ) => void;
}

interface IPriceModal {
  leadId: string;
  open: boolean;
  onClose?: () => void;
}

export function LeadTable({
  leads,
  onStatusChange,
  onCallStatusChange,
  onPublishLead,
  isAdmin,
}: LeadTableProps) { 
  const navigate = useNavigate();
  const [priceLead, setPriceLead] = React.useState<string>("");
  const [priceModal, setPriceModal] = React.useState<IPriceModal | null>(null);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, // Default to page 1
    pageSize: 10, // Default page size
  });
  
  const { deductCredits } = useCredits()

  const reloadPage = () => {
    window.location.reload();
  };
  

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
                    disabled={!lead.published}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                  onClick={() => onStatusChange(lead.id, 'rejected')}
                    className="text-red-600 hover:text-red-700"
                    disabled={!lead.published}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </>
              )}
            </>
          );
        },
      },
      ...(isAdmin
        ? [
            {
              id: "publish",
              header: "Publish",
              cell: ({ row }: { row: any }) => {
                const lead = row.original;
                return (
                  <>
                    <Button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                      onClick={() => {
                        setPriceModal({
                          leadId: lead.id,
                          open: true,
                        });
                      }}
                      disabled={lead.published}
                    >
                      Publish
                    </Button>
                  </>
                );
              },
            },
          ]
        : [
            {
              id: "price",
              header: "Price",
              cell: ({ row }: { row: any }) => {
                const lead = row.original;
                return (
                  <p>
                    {lead.price}
                  </p>
                );
              },
            },
            {
              id: "buy",
              header: "Buy",
              cell: ({ row }: { row: any }) => {
                const lead = row.original;
                return (
                  <>
                    <Button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                      onClick={async () => {
                        const bougth = await deductCredits(lead.price);
                        if(bougth === 'success') {
                          reloadPage()
                        }
                      }}
                    >
                      Buy
                    </Button>
                  </>
                );
              },
            },
          ]),
    ],
    [navigate, isAdmin, onStatusChange, onCallStatusChange, onPublishLead]
  );

  const table = useReactTable({
    data: leads,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination, // Pass the controlled pagination state
    },
    onPaginationChange: setPagination, 
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
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Dialog.Root open={priceModal?.open}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
            <Dialog.Title className="text-lg font-bold">Set price</Dialog.Title>
              <Input
                name="price"
                placeholder="Price in Credits"
                value={priceLead}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/[^0-9]/g, "");
                  setPriceLead(numericValue);
                }}
              />
              <div className="mt-4 flex justify-between">
                <Button
                  size="sm"
                  onClick={() => {
                  onPublishLead?.(priceModal!.leadId, true, Number(priceLead));
                    setPriceModal(null);
                  }}
                  disabled={!priceLead}
                >
                  Publish
                </Button>
                <Dialog.Close asChild>
                  <button
                    onClick={() => {
                      setPriceLead("");
                      setPriceModal(null);
                    }}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Close
                  </button>
                </Dialog.Close>
              </div>

              <Dialog.Close asChild>
                <button
                  onClick={() => {
                    setPriceLead("");
                    setPriceModal(null);
                  }}
                  className="absolute top-2 right-2"
                >
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <div className="w-full border-none flex justify-center items-center mt-[15px] px-[24px]">
        <Button
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
        >
          Previous
        </Button>

        <span className="w-[130px] flex justify-center">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>

        <Button
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
        >
          Next
        </Button>
      </div>
    </>
  );
}