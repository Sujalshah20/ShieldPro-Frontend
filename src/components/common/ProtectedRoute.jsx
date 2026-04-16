import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useToast } from "../../hooks/use-toast.tsx";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const toastShown = useRef(false);

  // Reset toastShown when user changes (e.g., after logout/login)
  useEffect(() => {
    toastShown.current = false;
  }, [user]);

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

  // Redirect to verify-email if user is not verified
  if (!user.isVerified) {
    return <Navigate to={`/verify-email?email=${user.email}`} replace />;
  }

  return children;
}
