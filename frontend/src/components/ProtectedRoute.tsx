import { Navigate, Outlet, useLocation } from "react-router";
import { isAuthenticated } from "../utils/auth";
import { routes } from "../routes/routes";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

/**
 * ProtectedRoute component that checks if user is authenticated
 * Redirects to login page if not authenticated
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuth = isAuthenticated();

  if (!isAuth) {
    // Redirect to login page and save the location they were trying to access
    return (
      <Navigate to={routes.auth.signIn} state={{ from: location }} replace />
    );
  }

  // If authenticated, render children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
