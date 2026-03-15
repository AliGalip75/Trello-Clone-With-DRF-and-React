import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  // isLoading bilgisini useAuth hook'undan alıyoruz
  const { logoutMutation, isLoading: isUserLoading, user } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 border-b bg-background top-0 z-50 sticky">
      <Link to="/" className="text-xl font-bold transition-opacity hover:opacity-80">
        TrelloClone
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {/* 1. ADIM: Eğer hala kullanıcı verisi çekiliyorsa boşluk bırak veya ufak bir loader koy */}
        {isUserLoading ? (
          <Spinner />
        ) : (
          /* 2. ADIM: Veri çekme bittiyse gerçek durumu göster */
          <>
            { user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full cursor-pointer">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.profile_image ?? undefined} alt={user.full_name} />
                      <AvatarFallback>{user.full_name?.[0]?.toUpperCase() || user.first_name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start" side="left" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.full_name || `${user.first_name} ${user.last_name}`}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{logoutMutation.isPending ? "Logging out..." : "Log out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthModal />
            )}
          </>
        )}
      </div>
    </header>
  );
}

export default Header;