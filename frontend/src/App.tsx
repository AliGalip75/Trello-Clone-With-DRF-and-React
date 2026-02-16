import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '@/layouts/PublicLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

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
        
        {/* 2. Then, apply the Dashboard Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          
          {/* 3. Finally, render the specific pages */}
          <Route path="/dashboard/boards/" element={<BoardsPage />} />
          <Route path="/dashboard/boards/:boardId/" element={<BoardDetailPage />} />
          
        </Route>

      </Route>


      {/* --- 404 HANDLING --- */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;