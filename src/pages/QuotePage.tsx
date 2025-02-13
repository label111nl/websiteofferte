import React from 'react';
import LeadForm from '../components/LeadForm';
import { ArrowRight, CheckCircle, Clock, Users, Shield } from 'lucide-react';
import { useNavigate, Link, useLocation } from '@tanstack/react-router';

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
            Vind de <span className="text-blue-600">perfecte partner</span> voor uw website project
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Ontvang binnen 24 uur meerdere offertes van gekwalificeerde web professionals
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Gratis en vrijblijvend
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-5 w-5 text-green-500 mr-2" />
              Binnen 24 uur reactie
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-5 w-5 text-green-500 mr-2" />
              Meerdere offertes
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="h-5 w-5 text-green-500 mr-2" />
              Betrouwbare partners
            </div>
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Hoe het werkt
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Vul het formulier in',
                description: 'Beschrijf uw project en wensen in het aanvraagformulier'
              },
              {
                step: '2',
                title: 'Ontvang offertes',
                description: 'Binnen 24 uur ontvangt u meerdere passende offertes'
              },
              {
                step: '3',
                title: 'Maak uw keuze',
                description: 'Vergelijk de offertes en kies de beste partner'
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lead Form Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <LeadForm onSubmit={(lead) => console.log(lead)} />
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Waarom Website Offertes?</h3>
                <ul className="space-y-4">
                  {[
                    'Gratis en vrijblijvend vergelijken',
                    'Alleen gekwalificeerde partners',
                    'Persoonlijke ondersteuning',
                    'Beste prijs-kwaliteit verhouding',
                    'Snelle responstijd',
                    'Transparant proces'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Aanvullende diensten</h3>
                <ul className="space-y-3">
                  {[
                    'Logo Design',
                    'Huisstijl Ontwikkeling',
                    'SEO Optimalisatie',
                    'Google Ads',
                    'Social Media Marketing',
                    'Content Creatie',
                    'Copywriting',
                    'E-mail Marketing',
                    'Website Onderhoud'
                  ].map((service, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <ArrowRight className="h-4 w-4 text-blue-600 mr-2" />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}