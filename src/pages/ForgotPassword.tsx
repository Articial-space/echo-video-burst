import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEmailRateLimit } from '@/hooks/use-email-rate-limit';
import { Clock, RefreshCw } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  
  // Rate limiting hook for password reset emails
  const {
    canSend,
    timeRemaining,
    isOnCooldown,
    startCooldown,
    formatTime
  } = useEmailRateLimit({
    cooldownSeconds: 60,
    storageKey: 'password-reset-cooldown'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Clear previous errors
    setEmailError('');

    try {
      const sanitizedEmail = email.trim().toLowerCase();
      
      // Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        setEmailError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      const { error, message, rateLimited } = await resetPassword(sanitizedEmail);
      
      if (error) {
        if (rateLimited) {
          setEmailError(error.message);
        } else {
          toast({
            title: "Password reset failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        // Always show success regardless of whether email exists (security-first approach)
        setEmailSent(true);
        startCooldown(); // Start the 60-second cooldown
        toast({
          title: "Check your email",
          description: message || "If that email address is registered with us, we've sent you a reset link. Please check your email (including spam folder).",
        });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 100);
    setEmail(value);
  };

  if (emailSent) {
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
              
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
                <p className="text-muted-foreground">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                
                <Button
                  variant="outline"
                  onClick={() => setEmailSent(false)}
                  disabled={!canSend}
                  className={`w-full ${
                    canSend 
                      ? 'border-brand-green-200 text-brand-green-700 hover:bg-brand-green-50' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {canSend ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Try Again in {formatTime(timeRemaining)}
                    </>
                  )}
                </Button>
                
                <Button asChild variant="link" className="w-full">
                  <Link to="/signin">Back to Sign In</Link>
                </Button>
              </div>
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
            
            <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
            <p className="text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <Card className="p-6 glass-effect">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {emailError && (
                  <p className="text-sm text-destructive font-medium">{emailError}</p>
                )}
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleInputChange}
                  required
                  maxLength={100}
                  className={emailError ? "border-destructive focus:border-destructive" : ""}
                />
              </div>

              <Button 
                type="submit" 
                className={`w-full ${
                  canSend 
                    ? 'bg-brand-gradient hover:opacity-90' 
                    : 'opacity-50 cursor-not-allowed bg-gray-400'
                }`}
                disabled={loading || !canSend}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending reset email...</span>
                  </div>
                ) : !canSend ? (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Wait {formatTime(timeRemaining)}</span>
                  </div>
                ) : (
                  'Send Reset Email'
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

export default ForgotPassword; 