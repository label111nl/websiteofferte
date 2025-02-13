import { Link } from '@tanstack/react-router';
import type { Lead } from '@/types'

interface LeadTableProps {
  leads: Lead[]
  onCallStatusChange?: (id: string, status: NonNullable<Lead['call_status']>) => void;
}

export function LeadTable({ leads, onCallStatusChange }: LeadTableProps) {
  return (
    <table>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead.id}>
            <td>
              <Link 
                to="/shared/leads/$leadId" 
                params={{ leadId: lead.id }}
                search={{ 
                  tab: 'all',
                  sort: 'newest',
                  filter: 'all'
                }}
              >
                {lead.company_name}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LeadTable;