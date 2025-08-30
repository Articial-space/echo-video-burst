import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          setIsValidToken(false);
        } else {
          setIsValidToken(true);
        }
      } catch (error) {
        setIsValidToken(false);
      } finally {
        setCheckingToken(false);
      }
    };

    checkToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Clear previous errors
    setPasswordError('');
    setConfirmPasswordError('');

    try {
      // Validation
      let hasErrors = false;
      
      if (password.length < 8) {
        setPasswordError('Password must be at least 8 characters long');
        hasErrors = true;
      }
      
      if (password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
        hasErrors = true;
      }
      
      if (hasErrors) {
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Your password has been updated successfully.",
        });
        navigate('/signin');
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green-600"></div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50">
        <div className="gradient-mesh min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <Link to="/" className="inline-flex items-center mb-6">
                <span className="text-2xl font-bold brand-text-gradient">
                  Viel
                </span>
              </Link>
              
              <h1 className="text-2xl font-bold mb-2">Invalid Reset Link</h1>
              <p className="text-muted-foreground mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              
              <Button asChild className="w-full">
                <Link to="/signin">Back to Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50">
      <div className="gradient-mesh min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center mb-6">
              <span className="text-2xl font-bold brand-text-gradient">
                Viel
              </span>
            </Link>
            
            <h1 className="text-2xl font-bold mb-2">Reset Your Password</h1>
            <p className="text-muted-foreground">
              Enter your new password below
            </p>
          </div>

          {/* Form */}
          <Card className="p-6 glass-effect">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                {passwordError && (
                  <p className="text-sm text-destructive font-medium">{passwordError}</p>
                )}
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    maxLength={128}
                    className={passwordError ? "border-destructive focus:border-destructive" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                {confirmPasswordError && (
                  <p className="text-sm text-destructive font-medium">{confirmPasswordError}</p>
                )}
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    maxLength={128}
                    className={confirmPasswordError ? "border-destructive focus:border-destructive" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-brand-gradient hover:opacity-90"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating password...</span>
                  </div>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          </Card>

          {/* Back to Sign In */}
          <div className="text-center">
            <Button
              variant="link"
              asChild
              className="text-brand-green-600 hover:text-brand-green-700 h-auto p-0"
            >
              <Link to="/signin">Back to Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 