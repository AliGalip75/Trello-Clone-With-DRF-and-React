import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";

export function Header() {
  // isLoading bilgisini useAuth hook'undan alıyoruz
  const { logoutMutation, isLoading: isUserLoading, user } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 border-b bg-background top-0 z-50 sticky">
      <h1 className="text-xl font-bold">TrelloClone</h1>

      <div className="flex items-center gap-4">
        {/* 1. ADIM: Eğer hala kullanıcı verisi çekiliyorsa boşluk bırak veya ufak bir loader koy */}
        {isUserLoading ? (
          <Spinner />
        ) : (
          /* 2. ADIM: Veri çekme bittiyse gerçek durumu göster */
          <>
            { user ? (
              <>
                <span className="text-sm font-medium">Merhaba, {user.first_name}</span>
                <Button 
                  variant="ghost" 
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="cursor-pointer"
                >
                  {logoutMutation.isPending ? <Spinner /> : "Log out"}
                </Button>
              </>
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