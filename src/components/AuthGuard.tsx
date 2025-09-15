import React, { useEffect } from 'react';
import { useAppSelector } from '../hooks/redux';
import { useAppNavigation } from '../hooks/useAppNavigation';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = false,
}) => {
  const { isAuthenticated, user, requiresVerification, isLoading } =
    useAppSelector(state => state.auth);
  const { replace } = useAppNavigation();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      replace('Login');
    } else if (!requireAuth && isAuthenticated && !requiresVerification) {
      replace('Home');
    }
  }, [isAuthenticated, requireAuth, requiresVerification, isLoading, replace]);

  if (requireAuth && !isAuthenticated && !isLoading) {
    return null;
  }

  if (!requireAuth && isAuthenticated && !requiresVerification && !isLoading) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
