import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type Role = "USER" | "LAWYER";

type RequireAuthProps = {
  children: React.ReactNode;
  roles: Role[];
};

const RequireAuth = ({ children, roles }: RequireAuthProps) => {
  const { isAuthenticated, role } = useAuth();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Authenticated but wrong role - redirect to appropriate dashboard
  if (role && !roles.includes(role)) {
    if (role === "USER") {
      return <Navigate to="/app/dashboard" replace />;
    }
    if (role === "LAWYER") {
      return <Navigate to="/lawyer/dashboard" replace />;
    }
  }

  // Authenticated and has correct role
  return <>{children}</>;
};

export default RequireAuth;
