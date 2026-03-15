import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '@/layouts/PublicLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

import BoardLayout from '@/layouts/BoardLayout';

// Auth
import AuthGuard from '@/components/auth/AuthGuard';

// Boards
import BoardsPage from '@/pages/BoardsPage';
import BoardDetailPage from '@/pages/BoardDetailPage';

// Pages
import HomePage from '@/pages/HomePage';

function App() {
  return (
    <Routes>
      
      {/* --- PUBLIC ROUTES --- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* --- PRIVATE ROUTES (PROTECTED) --- */}
      {/* 1. First, check if user is logged in */}
      <Route element={<AuthGuard />}>
        
        {/* 2. Dashboard Layout for Boards Page */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="/dashboard/boards/" element={<BoardsPage />} />
        </Route>

        {/* 3. Board Layout for Board Detail Page (No Sidebar) */}
        <Route path="/dashboard/boards/:boardId/" element={<BoardLayout />}>
          <Route index element={<BoardDetailPage />} />
        </Route>

      </Route>


      {/* --- 404 HANDLING --- */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;