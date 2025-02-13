import React from 'react';
import { Lead } from '../../types';
import { useAuthStore } from '../../store/authStore';

interface QuoteFormProps {
  lead: Lead;
  onSubmit: (data: { price: number; proposal: string }) => Promise<void>;
  loading?: boolean;
}

export default function QuoteForm({ lead, onSubmit, loading }: QuoteFormProps) {
  const { user } = useAuthStore();
  const [price, setPrice] = React.useState('');
  const [proposal, setProposal] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      price: parseFloat(price),
      proposal,
    });
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">
          Submit Quote for {lead.company_name}
        </h3>
        <div className="mt-4 text-sm text-gray-500">
          <p><strong>Project Description:</strong> {lead.project_description}</p>
          <p className="mt-2"><strong>Budget Range:</strong> {lead.budget_range}</p>
          <p><strong>Timeline:</strong> {lead.timeline}</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (€)
            </label>
            <input
              type="number"
              name="price"
              id="price"
              required
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="proposal" className="block text-sm font-medium text-gray-700">
              Proposal
            </label>
            <textarea
              name="proposal"
              id="proposal"
              rows={6}
              required
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Describe your proposal in detail..."
            />
          </div>
          {user?.subscription_type === 'free' && (
            <p className="text-sm text-gray-500">
              You will be charged €35 for submitting this quote.
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Quote'}
          </button>
        </form>
      </div>
    </div>
  );
}