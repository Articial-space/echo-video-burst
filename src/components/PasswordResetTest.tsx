import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const PasswordResetTest = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{ email: string; response: string }>>([]);
  
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const testEmails = [
    'existing@example.com', // This would be an existing email
    'nonexistent@example.com', // This would not exist
    'test@test.com', // Another non-existent email
  ];

  const testPasswordReset = async (testEmail: string) => {
    setLoading(true);
    try {
      const { error, message, rateLimited } = await resetPassword(testEmail);
      
      let response = '';
      if (error) {
        response = rateLimited ? `Rate Limited: ${error.message}` : `Error: ${error.message}`;
      } else {
        response = message || 'Reset email sent (security message)';
      }
      
      setResults(prev => [...prev, { email: testEmail, response }]);
      
      toast({
        title: "Test completed",
        description: `Tested password reset for ${testEmail}`,
      });
    } catch (error) {
      setResults(prev => [...prev, { 
        email: testEmail, 
        response: `Exception: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const testSingleEmail = async () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    
    await testPasswordReset(email.trim());
  };

  const testAllEmails = async () => {
    setResults([]);
    for (const testEmail of testEmails) {
      await testPasswordReset(testEmail);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password Reset Security Test 🔐</CardTitle>
          <p className="text-sm text-muted-foreground">
            This component tests the security fix for password reset functionality.
            Notice how the response is the same regardless of whether the email exists.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Single Email Test */}
          <div className="space-y-2">
            <Label htmlFor="test-email">Test Single Email:</Label>
            <div className="flex space-x-2">
              <Input
                id="test-email"
                type="email"
                placeholder="Enter email to test..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={testSingleEmail} 
                disabled={loading}
                variant="outline"
              >
                Test Reset
              </Button>
            </div>
          </div>

          {/* Batch Test */}
          <div className="flex space-x-2">
            <Button 
              onClick={testAllEmails} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Testing...' : 'Test All Sample Emails'}
            </Button>
            <Button 
              onClick={clearResults} 
              disabled={loading}
              variant="outline"
            >
              Clear Results
            </Button>
          </div>

          {/* Test Results */}
          {results.length > 0 && (
            <div className="space-y-2">
              <Label>Test Results:</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.map((result, index) => (
                  <Card key={index} className="p-3">
                    <div className="space-y-1">
                      <div className="font-mono text-sm">
                        <strong>Email:</strong> {result.email}
                      </div>
                      <div className="font-mono text-sm text-muted-foreground">
                        <strong>Response:</strong> {result.response}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500 mt-0.5 flex-shrink-0"></div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-800">
                  Security Fix Applied ✅
                </p>
                <p className="text-sm text-green-700">
                  All password reset requests now return the same response regardless of whether 
                  the email exists in the database. This prevents user enumeration attacks.
                </p>
              </div>
            </div>
          </div>

          {/* Expected Behavior */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-800">Expected Behavior:</p>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li><strong>Existing emails:</strong> Same message as non-existing emails</li>
                <li><strong>Non-existing emails:</strong> Same message as existing emails</li>
                <li><strong>Rate limited:</strong> Specific error about rate limiting</li>
                <li><strong>System errors:</strong> Generic error message</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordResetTest; 