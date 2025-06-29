
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-brand-gradient flex items-center justify-center">
            <Search className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-black via-brand-green-600 to-black bg-clip-text text-transparent">
            VideoSummarizer
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="#features" className="transition-colors hover:text-brand-green-600">
            Features
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-brand-green-600">
            How it works
          </a>
          <a href="#pricing" className="transition-colors hover:text-brand-green-600">
            Pricing
          </a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
          <Button 
            size="sm"
            className="bg-brand-gradient hover:opacity-90 text-white"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
