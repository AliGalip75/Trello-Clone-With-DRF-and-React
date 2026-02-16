// layouts/DashboardLayout.jsx
import { SidebarProvider} from "@/components/ui/sidebar"
import AppSidebar from "@/layouts/components/dashboard/Dashboard.sidebar";
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from "@/layouts/components/dashboard/Dashboard.header";
import { useAuth } from '@/hooks/useAuth';

const DashboardLayout = () => {

  const { user, logoutMutation } = useAuth(); // varsayalım ki auth context/hook kullanıyorsun
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate('/');
  };

  return (
    <SidebarProvider defaultOpen={true}> {/* Initially open */}
      <div className="flex h-screen w-full overflow-hidden bg-background">
        
        {/* Left Side: Sidebar */}
        <AppSidebar 
          user={user}
          onLogout={handleLogout}
          isLogoutPending={logoutMutation?.isPending}
        />

        {/* Right Side: header + content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          
          {/* Header – SidebarTrigger here */}
          <Header user={user} />

          {/* Content */}
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>

        </div>

      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;