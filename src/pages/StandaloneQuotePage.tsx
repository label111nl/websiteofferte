import React from 'react';
import LeadForm from '../components/LeadForm';
import { CheckCircle } from 'lucide-react';
import { Lead } from '@/types';

export default function StandaloneQuotePage() {
  const handleSubmit = (lead: Partial<Lead>) => {
    // Handle form submission
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Ontvang Direct Meerdere Website Offertes
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Vergelijk de beste web developers en bespaar tot 30% op uw website
          </p>
          
          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              'Gratis en vrijblijvend vergelijken',
              'Binnen 24 uur meerdere offertes',
              'Bespaar tijd en geld',
              'Alleen gekwalificeerde partners',
              'Persoonlijke ondersteuning',
              'Beste prijs-kwaliteit garantie'
            ].map((benefit, index) => (
              <div key={index} className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="ml-3 text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Form */}
        <LeadForm onSubmit={handleSubmit} />

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Vertrouwd door meer dan 1000+ bedrijven in Nederland
          </p>
          <div className="mt-4 flex justify-center space-x-8">
            {/* Add your trust badges/logos here */}
          </div>
        </div>
      </div>
    </div>
  );
}