import { Link } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  LayoutDashboard, 
  PlusCircle, 
  LogOut,
  Settings
} from 'lucide-react';
import { type User } from '@/types/index';


interface AppSidebarProps {
  user?: User | null;
  onLogout: () => void;
  isLogoutPending?: boolean;
}

const AppSidebar = ({ user, onLogout, isLogoutPending = false }: AppSidebarProps) => {
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel 
            className="group-data-[collapsible=icon]:hidden"
          >
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <Link to="/">
                    <Home className="h-5 w-5" />
                    <span className="cursor-pointer group-data-[collapsible=icon]:hidden">Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Boards">
                  <Link to="/boards">
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="cursor-pointer group-data-[collapsible=icon]:hidden">Boards</span> 
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Create new board">
                  <PlusCircle className="h-5 w-5" />
                  <span className="cursor-pointer group-data-[collapsible=icon]:hidden">New Board</span> 
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Your Boards
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/b/example-board-1">
                    <span className="group-data-[collapsible=icon]:hidden truncate">
                      Proje X - Frontend
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.profile_image ?? undefined} alt={user?.full_name} />
            <AvatarFallback>{user?.full_name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium truncate">
              {user?.full_name || 'Kullanıcı'}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user?.email || ''}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
          <Button variant="ghost" size="sm" className="cursor-pointer justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="cursor-pointer justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onLogout}
            disabled={isLogoutPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;