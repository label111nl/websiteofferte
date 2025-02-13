import React from 'react';
import { Check } from 'lucide-react';

interface SubscriptionCardProps {
  type: 'free' | 'premium';
  price: number;
  features: string[];
  current?: boolean;
  onSelect: () => void;
  loading?: boolean;
}

export default function SubscriptionCard({
  type,
  price,
  features,
  current,
  onSelect,
  loading
}: SubscriptionCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${current ? 'ring-2 ring-blue-500' : ''}`}>
      <h3 className="text-lg font-semibold text-gray-900 capitalize">{type} Plan</h3>
      <p className="mt-4">
        <span className="text-4xl font-bold">€{price}</span>
        <span className="text-gray-500">/month</span>
      </p>
      <ul className="mt-6 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="ml-3 text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        disabled={loading || current}
        className={`mt-8 w-full py-2 px-4 rounded-md text-sm font-medium ${
          current
            ? 'bg-gray-100 text-gray-800 cursor-default'
            : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        } disabled:opacity-50`}
      >
        {current ? 'Current Plan' : loading ? 'Processing...' : 'Select Plan'}
      </button>
    </div>
  );
}