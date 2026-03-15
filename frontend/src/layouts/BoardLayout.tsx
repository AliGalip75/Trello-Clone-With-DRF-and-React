// layouts/BoardLayout.tsx
import { Outlet } from 'react-router-dom';
import { Header } from "@/layouts/components/dashboard/Dashboard.header";
import { useAuth } from '@/hooks/useAuth';

const BoardLayout = () => {
  const { user } = useAuth(); 

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
      {/* Header without SidebarTrigger */}
      <Header user={user} hideSidebarTrigger={true} />

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default BoardLayout;
