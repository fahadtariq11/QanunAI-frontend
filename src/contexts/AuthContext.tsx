import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, type User as ApiUser, type Role, type LawyerRegistrationData } from "@/lib/api";

type User = ApiUser;

type AuthContextType = {
  token: string | null;
  refreshToken: string | null;
  role: Role | null;
  user: User | null;
  login: (email: string, password: string, selectedRole: Role) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, selectedRole: Role, lawyerData?: LawyerRegistrationData) => Promise<{ requiresVerification: boolean }>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
  isVerified: boolean;
  lawyerStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedRole = localStorage.getItem("authRole") as Role | null;
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedRole && storedUser) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      setRole(storedRole);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, selectedRole: Role) => {
    const response = await api.login(email, password, selectedRole);

    // Save to state
    setToken(response.accessToken);
    setRefreshToken(response.refreshToken);
    setRole(response.user.role);
    setUser(response.user);

    // Persist to localStorage
    localStorage.setItem("authToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem("authRole", response.user.role);
    localStorage.setItem("authUser", JSON.stringify(response.user));
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    selectedRole: Role,
    lawyerData?: LawyerRegistrationData
  ): Promise<{ requiresVerification: boolean }> => {
    const response = await api.register(email, password, firstName, lastName, selectedRole, lawyerData);

    // Save to state
    setToken(response.accessToken);
    setRefreshToken(response.refreshToken);
    setRole(response.user.role);
    setUser(response.user);

    // Persist to localStorage
    localStorage.setItem("authToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem("authRole", response.user.role);
    localStorage.setItem("authUser", JSON.stringify(response.user));

    return { requiresVerification: response.requiresVerification || !response.user.is_verified };
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("authUser", JSON.stringify(updatedUser));
  };

  const logout = async () => {
    // Try to invalidate token on server (don't fail if it errors)
    if (refreshToken) {
      try {
        await api.logout(refreshToken);
      } catch {
        // Ignore logout API errors
      }
    }

    setToken(null);
    setRefreshToken(null);
    setRole(null);
    setUser(null);

    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authRole");
    localStorage.removeItem("authUser");
  };

  const isAuthenticated = !!token;
  const isVerified = user?.is_verified ?? false;
  const lawyerStatus = user?.lawyer_status ?? null;

  return (
    <AuthContext.Provider value={{ token, refreshToken, role, user, login, register, logout, updateUser, isAuthenticated, isVerified, lawyerStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
