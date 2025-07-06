
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Search, Mail, Clock, RefreshCw } from 'lucide-react';

const EmailVerification = () => {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { user, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get email from URL params or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email') || localStorage.getItem('pendingEmail') || '';

  useEffect(() => {
    // If user is already verified, redirect to home
    if (user) {
      navigate('/');
      return;
    }

    // Countdown for resend button
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, navigate]);

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
      const { error } = await signUp(email, '', ''); // This will resend the verification email
      if (error) {
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
        setCountdown(60);
        setCanResend(false);
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50">
      <div className="gradient-mesh min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-brand-gradient flex items-center justify-center">
                <Search className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-black via-brand-green-600 to-black bg-clip-text text-transparent">
                VideoSummarizer
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
              <p className="font-medium text-brand-green-700">
                {email}
              </p>
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
                  disabled={!canResend}
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
                      Resend in {formatTime(countdown)}
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
