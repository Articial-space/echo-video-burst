
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEmailRateLimit } from '@/hooks/use-email-rate-limit';
import { Mail, Clock, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { clearSecureStorage } from '@/utils/securityUtils';
import { supabase } from '@/integrations/supabase/client';

const EmailVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const { user, loading, verifyEmail } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Rate limiting hook for email verification resends
  const {
    canSend: canResend,
    timeRemaining,
    startCooldown,
    formatTime
  } = useEmailRateLimit({
    cooldownSeconds: 60,
    storageKey: 'email-verification-cooldown'
  });

  // Get email from URL params or sessionStorage
  const emailFromUrl = searchParams.get('email');
  const emailFromStorage = sessionStorage.getItem('pendingEmail');
  const email = emailFromUrl || emailFromStorage || '';

  // Check for verification tokens in URL
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const type = searchParams.get('type');

  useEffect(() => {
    // Handle email verification from URL
    if (accessToken && refreshToken && type === 'signup') {
      handleEmailVerification();
    }
  }, [accessToken, refreshToken, type]);

  const handleEmailVerification = async () => {
    setIsVerifying(true);
    try {
      console.log('Handling email verification with tokens');
      
      const { error } = await verifyEmail(accessToken!, refreshToken!);

      if (error) {
        console.error('Email verification error:', error);
        setVerificationStatus('error');
        toast({
          title: "Verification failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('Email verification successful');
        setVerificationStatus('success');
        clearSecureStorage(['pendingEmail']);
        
        // Clear URL parameters for security
        window.history.replaceState({}, '', '/email-verification');
        
        toast({
          title: "Email verified!",
          description: "Your account has been successfully verified.",
        });
        
        // Redirect to home after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setVerificationStatus('error');
      toast({
        title: "Verification failed",
        description: "An unexpected error occurred during verification.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    // If user is already verified and confirmed, redirect to home and clear storage
    if (user && user.email_confirmed_at && !isVerifying) {
      clearSecureStorage(['pendingEmail']);
      navigate('/');
      return;
    }

    // Auto-cleanup email from storage after 30 minutes
    const cleanupTimer = setTimeout(() => {
      clearSecureStorage(['pendingEmail']);
    }, 30 * 60 * 1000); // 30 minutes

    return () => {
      clearTimeout(cleanupTimer);
    };
  }, [user, navigate, isVerifying]);

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "No email address found. Please try signing up again.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Resending verification email to:', email);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/email-verification`
        }
      });
      
      if (error) {
        console.error('Resend email error:', error);
        toast({
          title: "Failed to resend email",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email sent!",
          description: "Please check your inbox for the verification link.",
        });
        startCooldown(); // Start the 60-second cooldown
      }
    } catch (error) {
      console.error('Resend email error:', error);
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };



  // Show loading state while verifying
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50">
        <div className="gradient-mesh min-h-screen flex items-center justify-center p-4">
          <Card className="p-6 glass-effect text-center space-y-6">
            <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto animate-spin">
              <RefreshCw className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Verifying your email...</h1>
            <p className="text-muted-foreground">Please wait while we verify your account.</p>
          </Card>
        </div>
      </div>
    );
  }

  // Show success state
  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50">
        <div className="gradient-mesh min-h-screen flex items-center justify-center p-4">
          <Card className="p-6 glass-effect text-center space-y-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-green-700">Email verified!</h1>
            <p className="text-muted-foreground">Your account has been successfully verified.</p>
            <p className="text-sm text-muted-foreground">Redirecting to home page...</p>
          </Card>
        </div>
      </div>
    );
  }

  // Show error state
  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50">
        <div className="gradient-mesh min-h-screen flex items-center justify-center p-4">
          <Card className="p-6 glass-effect text-center space-y-6">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-red-700">Verification failed</h1>
            <p className="text-muted-foreground">There was an error verifying your email.</p>
            <div className="space-y-3">
              <Button onClick={handleResendEmail} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Resend verification email
              </Button>
              <Link to="/signin">
                <Button variant="outline" className="w-full">
                  Back to sign in
                </Button>
              </Link>
            </div>
          </Card>
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
          </div>

          {/* Verification Card */}
          <Card className="p-6 glass-effect text-center space-y-6">
            <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-8 w-8 text-white" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Check your email</h1>
              <p className="text-muted-foreground">
                We've sent a verification link to
              </p>
              {email && (
                <p className="font-medium text-brand-green-700 break-all">
                  {email}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-brand-green-50 rounded-lg border border-brand-green-200">
                <div className="flex items-center justify-center space-x-2 text-brand-green-700">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    Click the link in your email to verify your account
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or
                </p>
                
                <Button
                  variant="outline"
                  onClick={handleResendEmail}
                  disabled={!canResend || !email}
                  className={`w-full ${
                    canResend 
                      ? 'border-brand-green-200 text-brand-green-700 hover:bg-brand-green-50' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {canResend ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Resend verification email
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Resend in {formatTime(timeRemaining)}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Back to Sign In */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-2">
              Wrong email address?
            </p>
            <Link to="/signin">
              <Button
                variant="link"
                className="text-brand-green-600 hover:text-brand-green-700 h-auto p-0"
                onClick={() => clearSecureStorage(['pendingEmail'])}
              >
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
