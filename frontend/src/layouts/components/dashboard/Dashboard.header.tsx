import { SidebarTrigger } from "@/components/ui/sidebar";
import {  
  PlusCircle, 
  Search, 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type User } from '@/types/index';

interface HeaderProps {
  user?: User | null;   // optional yapman mantıklı (giriş yapmamışsa vs.)
}

export function Header({ user }: HeaderProps) {

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
      
      {/* Toggle butonu – mobil için görünür olur */}
      <SidebarTrigger className="cursor-pointer mr-2" /> {/* shadcn'in hazır toggle butonu */}

      {/* Arama alanı */}
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

      {/* Sağ ikonlar */}
      <div className="flex items-center gap-4">
        <Button className="cursor-pointer " variant="ghost" size="icon">
          <PlusCircle className="h-5 w-5" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.profile_image ?? undefined} alt={user?.full_name} />
          <AvatarFallback>{user?.full_name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

export default Header;