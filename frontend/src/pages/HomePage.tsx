// src/pages/HomePage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'

const HomePage: React.FC = () => {
  return (
    // Buradaki layout sarmalayıcılarını kaldırdık, sadece içerik kaldı.
    <div className="flex flex-col items-center justify-center text-center px-4 py-20 bg-linear-to-b from-white to-blue-50 h-full">
        
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 max-w-3xl leading-tight">
          Trello brings all your tasks, teammates, and tools together
        </h2>
        
        <p className="text-lg text-slate-600 mb-8 max-w-2xl">
          Keep everything in the same place—even if your team isn’t. 
          Manage projects, organize tasks, and build team spirit—all in one place.
        </p>

        <Link 
            to="/register"
            className="bg-blue-600 text-white text-xl font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105 transition-all transform duration-200"
        >
            Sign up - it’s free!
        </Link>

        {/* Görsel Temsili */}
        <div className="mt-12 w-full max-w-4xl p-4 bg-white rounded-xl shadow-2xl border border-slate-200">
            <div className="flex gap-4 overflow-x-auto p-4 bg-slate-100 rounded-lg h-64">
                <div className="min-w-50 bg-white rounded shadow p-2 h-full">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                    <div className="h-20 bg-blue-100 rounded mb-2"></div>
                    <div className="h-20 bg-blue-100 rounded mb-2"></div>
                </div>
                <div className="min-w-50 bg-white rounded shadow p-2 h-full">
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                    <div className="h-20 bg-green-100 rounded mb-2"></div>
                </div>
            </div>
        </div>

    </div>
  );
};

export default HomePage;