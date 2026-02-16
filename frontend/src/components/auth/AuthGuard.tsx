// components/AuthGuard.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const AuthGuard = () => {

  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* Buraya güzel bir spinner bileşeni koyabilirsin */}
        Loading... 
      </div>
    );
  }

  if (!!user) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default AuthGuard;