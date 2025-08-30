import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requireEmailVerification = false, 
  redirectTo = '/signin' 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      // Redirect if no user
      if (!user) {
        navigate(redirectTo, { replace: true });
        return;
      }

      // Redirect if email verification is required but user hasn't verified
      if (requireEmailVerification && !user.email_confirmed_at) {
        navigate('/email-verification', { replace: true });
        return;
      }
    }
  }, [user, loading, navigate, redirectTo, requireEmailVerification]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50">
        <div className="gradient-mesh min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green-600"></div>
        </div>
      </div>
    );
  }

  // Don't render if no user or email not verified (when required)
  if (!user || (requireEmailVerification && !user.email_confirmed_at)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 