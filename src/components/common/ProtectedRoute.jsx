import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useToast } from "../../hooks/use-toast";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to access your profile",
        variant: "destructive"
      });
    } else if (role && user.role !== role) {
      toast({
        title: "Access Denied",
        description: "You are not authorized to access this page.",
        variant: "destructive"
      });
    }
  }, [user, role, toast]);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    const dashboardRedirects = {
      admin: "/admin",
      agent: "/agent",
      customer: "/customer",
    };
    return <Navigate to={dashboardRedirects[user.role] || "/login"} replace />;
  }

  return children;
}
