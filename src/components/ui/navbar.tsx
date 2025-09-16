import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User } from 'lucide-react';

export function Navbar() {
  const { user, signOut, loading, profile } = useAuth();

  if (loading) {
    return (
      <nav className="bg-spu-pink text-white px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">SPU U2B</h1>
          <div className="animate-pulse bg-white/20 rounded px-4 py-2 w-24 h-10"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-spu-pink text-white px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">SPU U2B</h1>
        
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">
                {profile?.display_name || user.email}
                {profile?.verified_student && (
                  <span className="ml-2 bg-spu-success px-2 py-1 rounded-full text-xs">
                    Verified
                  </span>
                )}
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={signOut}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="text-sm">Not signed in</div>
        )}
      </div>
    </nav>
  );
}