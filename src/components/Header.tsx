
import { Search, User, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const Header = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-7 w-7 rounded-lg bg-brand-gradient flex items-center justify-center">
            <Search className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-lg font-bold lava-lamp bg-clip-text text-transparent">
            Viel
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link 
            to="/get-started" 
            className="transition-colors hover:text-brand-green-600 text-muted-foreground"
          >
            Get Started
          </Link>
          <Link 
            to="/pricing" 
            className="transition-colors hover:text-brand-green-600 text-muted-foreground"
          >
            Pricing
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 h-8 px-3">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline max-w-[100px] truncate text-sm">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="w-[160px] truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/signin" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="text-sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/signin">
                <Button 
                  size="sm"
                  className="bg-brand-gradient hover:opacity-90 text-white text-sm px-4"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/get-started" onClick={() => setMobileMenuOpen(false)} className="text-sm">
                    Get Started
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm">
                    Pricing
                  </Link>
                </DropdownMenuItem>
                {!user && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/signin" onClick={() => setMobileMenuOpen(false)} className="text-sm">
                        Sign in
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
