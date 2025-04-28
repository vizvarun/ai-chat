import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type ProtectedRouteProps = {
  requireAuth?: boolean;
  requireAuthorization?: boolean;
};

const ProtectedRoute = ({ 
  requireAuth = true, 
  requireAuthorization = false 
}: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If not authenticated and auth is required, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authorization is required but user is not authorized, redirect to home
  if (requireAuthorization && (!user?.authorized)) {
    return <Navigate to="/" replace />;
  }

  // If all conditions pass, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
