import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    // Redirect to their respective dashboard instead of login
    const dashboardRedirects = {
      admin: "/admin",
      agent: "/agent",
      customer: "/customer",
    };
    return <Navigate to={dashboardRedirects[user.role] || "/login"} />;
  }

  return children;
}
