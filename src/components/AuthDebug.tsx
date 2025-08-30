import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

interface DebugInfo {
  connection?: string;
  error?: string;
  supabaseUrl?: string;
  hasAnonKey?: boolean;
  sessionExists?: boolean;
  userExists?: boolean;
  userId?: string;
  userEmail?: string;
  profilesCount?: unknown;
}

const AuthDebug = () => {
  const { user, session, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  const checkSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
      
      const info = {
        connection: error ? 'Failed' : 'Success',
        error: error?.message,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        sessionExists: !!session,
        userExists: !!user,
        userId: user?.id,
        userEmail: user?.email,
        profilesCount: data
      };
      
      setDebugInfo(info);
      console.log('Debug Info:', info);
    } catch (err) {
      console.error('Debug check failed:', err);
      setDebugInfo({ error: 'Failed to check connection' });
    }
  };

  const testGoogleAuth = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      console.log('Google auth test:', { data, error });
    } catch (err) {
      console.error('Google auth test failed:', err);
    }
  };

  if (loading) {
    return <div>Loading auth state...</div>;
  }

  return (
    <Card className="p-6 m-4">
      <h2 className="text-xl font-bold mb-4">Authentication Debug Panel</h2>
      
      <div className="space-y-4">
        <div>
          <strong>Authentication State:</strong>
          <ul className="ml-4 mt-2">
            <li>Loading: {loading ? 'Yes' : 'No'}</li>
            <li>User: {user ? `${user.email} (${user.id})` : 'None'}</li>
            <li>Session: {session ? 'Active' : 'None'}</li>
            <li>Session expires: {session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'N/A'}</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button onClick={checkSupabaseConnection}>
            Check Supabase Connection
          </Button>
          <Button onClick={testGoogleAuth} variant="outline">
            Test Google Auth
          </Button>
        </div>

        {debugInfo && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <strong>Debug Results:</strong>
            <pre className="mt-2 text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p><strong>Environment:</strong></p>
          <ul className="ml-4">
            <li>Supabase URL: {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</li>
            <li>Has Anon Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Yes' : 'No'}</li>
            <li>Current URL: {window.location.href}</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default AuthDebug; 