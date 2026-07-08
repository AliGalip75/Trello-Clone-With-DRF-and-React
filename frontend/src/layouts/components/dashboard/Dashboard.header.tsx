import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Kanban } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type User } from "@/types/index";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  user?: User | null;
  hideSidebarTrigger?: boolean;
}

export function Header({ user, hideSidebarTrigger }: HeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">

      {/* Sidebar toggle */}
      {!hideSidebarTrigger && <SidebarTrigger className="cursor-pointer mr-2" />}

      {/* Logo */}
      <Link
        to="/dashboard/workspaces"
        className="flex items-center gap-2 font-bold text-lg transition-opacity hover:opacity-80"
      >
        <div className="bg-blue-600 text-white p-1 rounded">
          <Kanban className="h-5 w-5" />
        </div>
        <span className="hidden sm:inline-block">Trello Clone</span>
      </Link>

      {/* Search */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search boards, cards..."
            className="w-full rounded-md border bg-background pl-8 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Avatar className="h-8 w-8 ml-2">
          <AvatarImage src={user?.profile_image ?? undefined} alt={user?.full_name} />
          <AvatarFallback>{user?.full_name?.[0]?.toUpperCase() || "?"}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

export default Header;