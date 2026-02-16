import { Link } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
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
  Search, 
  UserCircle, 
  LogOut,
  Settings
} from 'lucide-react';
import { type User } from '@/types/index';


interface AppSidebarProps {
  user?: User | null;
  onLogout: () => void;
  isLogoutPending?: boolean;
  // İleride: boards?: Board[] → dinamik board listesi için
}

const AppSidebar = ({ user, onLogout, isLogoutPending = false }: AppSidebarProps) => {
  return (
    <Sidebar collapsible="icon" className="border-r">
      {/* Header aynı */}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel 
            className="group-data-[collapsible=icon]:hidden"  // Label'ı collapsed'ta gizle (opsiyonel ama önerilir)
          >
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <Link to="/">
                    <Home className="h-5 w-5" />
                    <span className="cursor-pointer group-data-[collapsible=icon]:hidden">Home</span>  {/* ← BURAYA EKLE */}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Boards">
                  <Link to="/boards">
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="cursor-pointer group-data-[collapsible=icon]:hidden">Boards</span>  {/* ← BURAYA EKLE */}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Create new board">
                  <PlusCircle className="h-5 w-5" />
                  <span className="cursor-pointer group-data-[collapsible=icon]:hidden">New Board</span>  {/* ← BURAYA EKLE */}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Your Boards grubu için de aynı */}
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
              {/* diğer board'lar da aynı class'ı alsın */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer'daki metinler için de gizle (isim ve email) */}
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.profile_image ?? undefined} alt={user?.full_name} />
            <AvatarFallback>{user?.full_name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">  {/* ← Tüm kullanıcı bilgisini gizle */}
            <span className="text-sm font-medium truncate">
              {user?.full_name || 'Kullanıcı'}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user?.email || ''}
            </span>
          </div>
        </div>

        {/* Settings ve Log out butonları da metin gizlensin */}
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