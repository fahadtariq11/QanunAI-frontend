import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type Role = "USER" | "LAWYER";

type RequireAuthProps = {
  children: React.ReactNode;
  roles: Role[];
  allowUnverified?: boolean;
  allowPending?: boolean;
};

const RequireAuth = ({ children, roles, allowUnverified = false, allowPending = false }: RequireAuthProps) => {
  const { isAuthenticated, isVerified, role, lawyerStatus } = useAuth();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Authenticated but not verified - redirect to verification page
  // (unless allowUnverified is true, like for the verification page itself)
  if (!allowUnverified && !isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Authenticated but wrong role - redirect to appropriate dashboard
  if (role && !roles.includes(role)) {
    if (role === "USER") {
      return <Navigate to="/app/dashboard" replace />;
    }
    if (role === "LAWYER") {
      // Check lawyer status - redirect to pending if not verified
      if (lawyerStatus !== 'VERIFIED') {
        return <Navigate to="/lawyer/pending" replace />;
      }
      return <Navigate to="/lawyer/dashboard" replace />;
    }
  }

  // For lawyers, check if they're approved (unless allowPending is true)
  if (role === "LAWYER" && !allowPending && lawyerStatus !== 'VERIFIED') {
    return <Navigate to="/lawyer/pending" replace />;
  }

  // Authenticated, verified, and has correct role (and approved if lawyer)
  return <>{children}</>;
};

export default RequireAuth;
