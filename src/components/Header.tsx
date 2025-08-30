
import { User, LogOut, Menu, Crown, Zap } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useUserPlan } from "@/hooks/use-user-plan";

const Header = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userPlan, isFreePlan, shouldShowUpgrade } = useUserPlan();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold brand-text-gradient">
            Viel
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {!user && (
            <Link 
              to="/get-started" 
              className="transition-colors hover:text-brand-green-600 text-muted-foreground"
            >
              Get Started
            </Link>
          )}
          {!user && (
            <Link 
              to="/pricing" 
              className="transition-colors hover:text-brand-green-600 text-muted-foreground"
            >
              Pricing
            </Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              {/* Upgrade Plan Link (only show for free users) */}
              {shouldShowUpgrade() && (
                <Link to="/pricing" className="hidden md:block">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-sm text-brand-green-600 hover:text-brand-green-700 hover:bg-brand-green-50"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </Link>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 h-8 px-3">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline max-w-[100px] truncate text-sm">
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="w-[160px] truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge 
                          variant={userPlan === 'Free' ? 'secondary' : 'default'}
                          className={`text-xs ${
                            userPlan === 'Free' 
                              ? 'bg-gray-100 text-gray-700' 
                              : userPlan === 'Pro'
                              ? 'bg-brand-green-100 text-brand-green-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {userPlan === 'Enterprise' && <Crown className="h-3 w-3 mr-1" />}
                          {userPlan === 'Pro' && <Zap className="h-3 w-3 mr-1" />}
                          {userPlan} Plan
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  
                  {/* Plan Management */}
                  {shouldShowUpgrade() ? (
                    <DropdownMenuItem asChild>
                      <Link to="/pricing" className="cursor-pointer">
                        <Zap className="h-4 w-4 mr-2 text-brand-green-600" />
                        <span className="text-brand-green-600 font-medium">Upgrade Plan</span>
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link to="/pricing" className="cursor-pointer">
                        <Crown className="h-4 w-4 mr-2" />
                        Manage Subscription
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
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
                {!user && (
                  <>
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/signin" onClick={() => setMobileMenuOpen(false)} className="text-sm">
                        Sign in
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                {/* Mobile menu for authenticated users */}
                {user && shouldShowUpgrade() && (
                  <DropdownMenuItem asChild>
                    <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm">
                      <Zap className="h-4 w-4 mr-2 text-brand-green-600" />
                      <span className="text-brand-green-600 font-medium">Upgrade Plan</span>
                    </Link>
                  </DropdownMenuItem>
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
