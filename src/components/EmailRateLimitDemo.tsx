import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useEmailRateLimit } from '@/hooks/use-email-rate-limit';
import { useToast } from '@/hooks/use-toast';
import { Clock, Mail, RefreshCw, Shield } from 'lucide-react';

const EmailRateLimitDemo = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Email verification rate limit
  const verificationLimit = useEmailRateLimit({
    cooldownSeconds: 60,
    storageKey: 'demo-verification-cooldown'
  });

  // Password reset rate limit
  const resetLimit = useEmailRateLimit({
    cooldownSeconds: 60,
    storageKey: 'demo-reset-cooldown'
  });

  const simulateEmailSend = async (type: 'verification' | 'reset') => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const limit = type === 'verification' ? verificationLimit : resetLimit;
    
    // Start the cooldown
    limit.startCooldown();

    toast({
      title: `${type === 'verification' ? 'Verification' : 'Reset'} email sent!`,
      description: `Simulated ${type} email sent to ${email}`,
    });

    setLoading(false);
  };

  const EmailLimitStatus = ({ 
    title, 
    limit, 
    icon: Icon 
  }: { 
    title: string; 
    limit: ReturnType<typeof useEmailRateLimit>; 
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Icon className="h-4 w-4" />
        <span className="font-medium text-sm">{title}</span>
      </div>
      <div className={`p-3 rounded-lg border ${
        limit.canSend 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        <div className="text-sm">
          <div className="font-medium">
            Status: {limit.canSend ? '✅ Ready to Send' : '⏳ On Cooldown'}
          </div>
          {!limit.canSend && (
            <div className="text-xs mt-1">
              Time remaining: {limit.formatTime(limit.timeRemaining)}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Email Rate Limiting Demo 🔐</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Test the 60-second rate limiting for email sending functions. 
            Each email type has its own independent cooldown.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="demo-email">Email Address</Label>
            <Input
              id="demo-email"
              type="email"
              placeholder="Enter email to test..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => simulateEmailSend('verification')}
              disabled={loading || !verificationLimit.canSend}
              className={`w-full ${
                verificationLimit.canSend 
                  ? 'bg-brand-gradient hover:opacity-90' 
                  : 'opacity-50 cursor-not-allowed bg-gray-400'
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </div>
              ) : !verificationLimit.canSend ? (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Wait {verificationLimit.formatTime(verificationLimit.timeRemaining)}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Send Verification Email</span>
                </div>
              )}
            </Button>

            <Button
              onClick={() => simulateEmailSend('reset')}
              disabled={loading || !resetLimit.canSend}
              variant="outline"
              className={`w-full ${
                resetLimit.canSend 
                  ? 'border-brand-green-200 text-brand-green-700 hover:bg-brand-green-50' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span>Sending...</span>
                </div>
              ) : !resetLimit.canSend ? (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Wait {resetLimit.formatTime(resetLimit.timeRemaining)}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Send Reset Email</span>
                </div>
              )}
            </Button>
          </div>

          {/* Status Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EmailLimitStatus 
              title="Email Verification" 
              limit={verificationLimit} 
              icon={Mail}
            />
            <EmailLimitStatus 
              title="Password Reset" 
              limit={resetLimit} 
              icon={RefreshCw}
            />
          </div>

          {/* Reset Buttons */}
          <div className="border-t pt-4">
            <div className="flex space-x-2">
              <Button
                onClick={verificationLimit.resetCooldown}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Reset Verification Cooldown
              </Button>
              <Button
                onClick={resetLimit.resetCooldown}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Reset Password Cooldown
              </Button>
            </div>
          </div>

          {/* Features List */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Features Implemented:</h4>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>60-second cooldown between email sends</li>
              <li>Visual countdown timer showing remaining time</li>
              <li>Persistent across page refreshes (localStorage)</li>
              <li>Independent cooldowns for different email types</li>
              <li>Disabled buttons during cooldown</li>
              <li>Clear visual feedback and status indicators</li>
            </ul>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500 mt-0.5 flex-shrink-0"></div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-800">
                  Spam Protection Active 🛡️
                </p>
                <p className="text-sm text-green-700">
                  Rate limiting prevents abuse and protects your email sending reputation. 
                  Users must wait 60 seconds between resend attempts.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailRateLimitDemo; 