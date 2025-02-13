import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

export default function QuoteRequestButton() {
  return (
    <div className="flex gap-4">
      <Link
        to="/offerte-aanvragen"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Offerte Aanvragen
        <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
      </Link>
      <Link
        to="/register"
        className="inline-flex items-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Word Marketeer
        <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
      </Link>
    </div>
  );
}