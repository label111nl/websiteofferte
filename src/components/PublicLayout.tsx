import React from 'react';
import { Outlet, useLocation } from '@tanstack/react-router';
import Header from './Header';
import Footer from './Footer';

const PublicLayout: React.FC = () => {
  const location = useLocation();

  const shouldShowHeaderFooter = !location.pathname.includes('admin') && !location.pathname.includes('dashboard');

  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowHeaderFooter && <Header />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {shouldShowHeaderFooter && <Footer />}
    </div>
  );
};

export default PublicLayout;
