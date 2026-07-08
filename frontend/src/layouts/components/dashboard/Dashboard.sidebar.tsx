import { Link, useLocation } from "react-router-dom";
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
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  LogOut,
  Settings,
  LayoutGrid,
  FolderOpen,
  ChevronDown,
} from "lucide-react";
import { type User } from "@/types/index";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "@/services/workspaceService";
import type { Workspace } from "@/types";
import { CreateWorkspaceModal } from "./CreateWorkspaceModal";
import { CreateBoardModal } from "./CreateBoardModal";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AppSidebarProps {
  user?: User | null;
  onLogout: () => void;
  isLogoutPending?: boolean;
}

const AppSidebar = ({ user, onLogout, isLogoutPending = false }: AppSidebarProps) => {
  const { pathname } = useLocation();

  // Fetch all workspaces for the current user
  const { data: workspaces = [] } = useQuery<Workspace[]>({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>

        {/* ── Navigation ─────────────────────────────────────── */}
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <Link to="/">
                    <Home className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Workspaces" isActive={pathname.startsWith("/dashboard")}>
                  <Link to="/dashboard/workspaces">
                    <LayoutGrid className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">Workspaces</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ── Workspaces (one collapsible group per workspace) ─ */}
        {workspaces.map((ws) => (
          <Collapsible key={ws.id} defaultOpen className="group/collapsible">
            <SidebarGroup>
              {/* Workspace header row */}
              <div className="flex items-center justify-between pr-2">
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors flex-1 min-w-0">
                    <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{ws.name}</span>
                    <ChevronDown className="ml-auto h-3.5 w-3.5 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarGroupLabel>
                </CollapsibleTrigger>

                {/* Quick "add board" button beside workspace label */}
                <div className="group-data-[collapsible=icon]:hidden">
                  <CreateBoardModal
                    workspaceId={ws.id}
                    trigger={
                      <button
                        title="Add board"
                        className="opacity-0 group-hover/collapsible:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted cursor-pointer"
                      >
                        <span className="text-muted-foreground text-xs font-bold">+</span>
                      </button>
                    }
                  />
                </div>
              </div>

              {/* Board list under this workspace */}
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {ws.boards.length === 0 ? (
                      <SidebarMenuItem>
                        <span className="pl-4 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                          No boards yet
                        </span>
                      </SidebarMenuItem>
                    ) : (
                      ws.boards.map((board) => (
                        <SidebarMenuItem key={board.id}>
                          <SidebarMenuButton
                            asChild
                            isActive={pathname === `/dashboard/boards/${board.id}/`}
                            tooltip={board.name}
                          >
                            <Link to={`/dashboard/boards/${board.id}/`}>
                              <span className="group-data-[collapsible=icon]:hidden truncate">
                                {board.name}
                              </span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}

        {/* ── Add Workspace button ────────────────────────────── */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent>
            <CreateWorkspaceModal />
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <SidebarFooter className="border-t p-4 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.profile_image ?? undefined} alt={user?.full_name} />
            <AvatarFallback>{user?.full_name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">
              {user?.full_name || user?.username || "User"}
            </span>
            <span className="text-xs text-muted-foreground truncate">{user?.email || ""}</span>
          </div>
        </div>

        <SidebarMenu className="mt-4 group-data-[collapsible=icon]:mt-0">
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings className="h-5 w-5" />
              <span className="cursor-pointer group-data-[collapsible=icon]:hidden">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Log out"
              onClick={onLogout}
              disabled={isLogoutPending}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;