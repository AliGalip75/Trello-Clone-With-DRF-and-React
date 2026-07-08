import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '@/layouts/PublicLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import BoardLayout from '@/layouts/BoardLayout';

// Auth
import AuthGuard from '@/components/auth/AuthGuard';

// Pages
import HomePage from '@/pages/HomePage';
import WorkspacesPage from '@/pages/WorkspacesPage';
import WorkspacePage from '@/pages/WorkspacePage';
import BoardDetailPage from '@/pages/BoardDetailPage';

function App() {
  return (
    <Routes>

      {/* ── PUBLIC ROUTES ────────────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* ── PRIVATE ROUTES (PROTECTED) ───────────────────────── */}
      <Route element={<AuthGuard />}>

        {/* Dashboard Layout — sidebar + header */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Redirect /dashboard → /dashboard/workspaces */}
          <Route index element={<Navigate to="/dashboard/workspaces" replace />} />

          {/* All workspaces */}
          <Route path="workspaces" element={<WorkspacesPage />} />

          {/* Single workspace (board list) */}
          <Route path="workspaces/:workspaceId" element={<WorkspacePage />} />
        </Route>

        {/* Board Layout — full-screen board, no sidebar content scroll */}
        <Route path="/dashboard/boards/:boardId/" element={<BoardLayout />}>
          <Route index element={<BoardDetailPage />} />
        </Route>

      </Route>

      {/* ── 404 ──────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;