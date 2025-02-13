import React from 'react';
import { Link } from '@tanstack/react-router';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              Website Offertes
            </h3>
            <p className="text-gray-600 max-w-md">
              Vind de beste web development agencies voor uw project. Vergelijk offertes en maak een weloverwogen keuze.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Voor Bedrijven</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/offerte-aanvragen" className="text-gray-600 hover:text-gray-900">
                  Offerte Aanvragen
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  Hoe het Werkt
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  Veelgestelde Vragen
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Voor Marketeers</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/register" className="text-gray-600 hover:text-gray-900">
                  Account Aanmaken
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Inloggen
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  Prijzen
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm text-center">
            © {currentYear} Website Offertes. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}