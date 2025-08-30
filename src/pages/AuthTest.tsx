import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const AuthTest = () => {
  const { user, session, loading, signOut, signUp, verifyEmail } = useAuth();
  const { toast } = useToast();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('password123');
  const [testName, setTestName] = useState('Test User');
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  const checkLocalStorage = () => {
    const keys = Object.keys(localStorage);
    const authKeys = keys.filter(key => key.includes('supabase') || key.includes('auth'));
    console.log('Auth-related localStorage keys:', authKeys);
    
    authKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        console.log(`${key}:`, value);
      } catch (error) {
        console.log(`${key}: Error reading value`);
      }
    });
  };

  const checkSessionStorage = () => {
    const keys = Object.keys(sessionStorage);
    console.log('sessionStorage keys:', keys);
    
    keys.forEach(key => {
      try {
        const value = sessionStorage.getItem(key);
        console.log(`${key}:`, value);
      } catch (error) {
        console.log(`${key}: Error reading value`);
      }
    });
  };

  const clearAllStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast({
      title: "Storage cleared",
      description: "All local and session storage has been cleared.",
    });
  };

  const testSignUp = async () => {
    try {
      const { error } = await signUp(testEmail, testPassword, testName);
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign up successful",
          description: "Please check your email for verification.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const testEmailVerification = async () => {
    if (!accessToken || !refreshToken) {
      toast({
        title: "Missing tokens",
        description: "Please provide both access token and refresh token.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await verifyEmail(accessToken, refreshToken);
      if (error) {
        toast({
          title: "Email verification failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email verification successful",
          description: "Email has been verified successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during verification.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Authentication State</h2>
            <div className="space-y-2">
              <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
              <div><strong>User:</strong> {user ? 'Authenticated' : 'Not authenticated'}</div>
              <div><strong>Session:</strong> {session ? 'Active' : 'No session'}</div>
            </div>
            
            {user && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold mb-2">User Details:</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>ID:</strong> {user.id}</div>
                  <div><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</div>
                  <div><strong>Email Confirmed:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</div>
                </div>
              </div>
            )}
            
            {session && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Session Details:</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>Access Token:</strong> {session.access_token ? 'Present' : 'Missing'}</div>
                  <div><strong>Refresh Token:</strong> {session.refresh_token ? 'Present' : 'Missing'}</div>
                  <div><strong>Expires:</strong> {new Date(session.expires_at * 1000).toLocaleString()}</div>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Storage Debug</h2>
            <div className="space-y-4">
              <Button onClick={checkLocalStorage} variant="outline" className="w-full">
                Check localStorage
              </Button>
              <Button onClick={checkSessionStorage} variant="outline" className="w-full">
                Check sessionStorage
              </Button>
              <Button onClick={clearAllStorage} variant="destructive" className="w-full">
                Clear All Storage
              </Button>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Click "Check localStorage" to see auth-related keys</li>
                <li>Click "Check sessionStorage" to see session storage</li>
                <li>Open browser console to see detailed logs</li>
                <li>Try signing in/out to see state changes</li>
              </ol>
            </div>
          </Card>
        </div>

        {/* Email Verification Test */}
        <Card className="mt-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Email Verification Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="testEmail">Test Email</Label>
                <Input
                  id="testEmail"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>
              <div>
                <Label htmlFor="testPassword">Test Password</Label>
                <Input
                  id="testPassword"
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  placeholder="password123"
                />
              </div>
              <div>
                <Label htmlFor="testName">Test Name</Label>
                <Input
                  id="testName"
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="Test User"
                />
              </div>
              <Button onClick={testSignUp} className="w-full">
                Test Sign Up
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="accessToken">Access Token</Label>
                <Input
                  id="accessToken"
                  type="text"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="Paste access token from email"
                />
              </div>
              <div>
                <Label htmlFor="refreshToken">Refresh Token</Label>
                <Input
                  id="refreshToken"
                  type="text"
                  value={refreshToken}
                  onChange={(e) => setRefreshToken(e.target.value)}
                  placeholder="Paste refresh token from email"
                />
              </div>
              <Button onClick={testEmailVerification} className="w-full">
                Test Email Verification
              </Button>
            </div>
          </div>
        </Card>

        {user && (
          <Card className="mt-6 p-6">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <Button onClick={signOut} variant="destructive">
              Sign Out
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AuthTest; 