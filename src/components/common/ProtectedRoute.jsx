import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useRef } from "react";
import { useToast } from "../../hooks/use-toast";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  // BUG FIX: useEffect fires AFTER the redirect is rendered (wrong timing in React 18).
  // Use a ref to show the toast exactly once, inline, before returning the redirect.
  const toastShown = useRef(false);

  if (!user) {
    if (!toastShown.current) {
      toastShown.current = true;
      toast({
        title: "Authentication Required",
        description: "Please login to access this page.",
        variant: "destructive"
      });
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    if (!toastShown.current) {
      toastShown.current = true;
      toast({
        title: "Access Denied",
        description: "You are not authorized to access this page.",
        variant: "destructive"
      });
    }
    const dashboardRedirects = {
      admin: "/admin",
      agent: "/agent",
      customer: "/customer",
    };
    return <Navigate to={dashboardRedirects[user.role] || "/login"} replace />;
  }

  return children;
}
