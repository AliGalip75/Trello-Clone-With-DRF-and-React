// src/layouts/PublicLayout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/public/Public.header';
import { Toaster } from "@/components/ui/sonner";


const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* --- HEADER (Sabit Kısım) --- */}
      <Header />

      {/* --- CONTENT (Değişen Kısım) --- */}
      <main className="flex-1">
        <Toaster />
        {/* Outlet: React Router buraya HomePage, AboutPage gibi sayfaları yerleştirecek */}
        <Outlet />
      </main>

      {/* --- FOOTER (Sabit Kısım) --- */}
      <footer className="py-6 text-center text-slate-400 text-sm bg-slate-900">
        &copy; {new Date().getFullYear()} TrelloClone. All rights reserved.
      </footer>
    </div>
  );
};

export default PublicLayout;