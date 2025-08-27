// components/PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';

interface PrivateRouteProps {
  allowedRoles?: ('USER' | 'ADMIN')[];
  children?: React.ReactNode;
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { user } = useUser();

  console.log('PrivateRoute user:', user);
  console.log('PrivateRoute allowedRoles:', allowedRoles);
  console.log('PrivateRoute isAuthenticated:', isAuthenticated);
  // Always normalize user.role to uppercase string for comparison
  const normalizedRole = user && typeof user.role === 'string'
    ? (user.role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER')
    : undefined;
  if (user) {
    console.log('PrivateRoute user.role (normalized):', normalizedRole);
  }

  // If user is present but isAuthenticated is false, try to recover session (only once)
  React.useEffect(() => {
    // @ts-ignore
    if (user && !isAuthenticated && !window.__egret_auth_reload) {
      // @ts-ignore
      window.__egret_auth_reload = true;
      window.location.reload();
    }
  }, [user, isAuthenticated]);

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  if (allowedRoles && (!normalizedRole || !allowedRoles.includes(normalizedRole as 'ADMIN' | 'USER'))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
