import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Role = "USER" | "LAWYER";

type User = {
  id: number;
  email: string;
  role: Role;
};

type AuthContextType = {
  token: string | null;
  role: Role | null;
  user: User | null;
  login: (email: string, password: string, selectedRole: Role) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("authRole") as Role | null;
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedRole && storedUser) {
      setToken(storedToken);
      setRole(storedRole);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Mock login function - TODO: Replace with real API call
  const login = async (email: string, password: string, selectedRole: Role) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock response
    const mockResponse = {
      accessToken: `mock-token-${Date.now()}`,
      user: {
        id: Math.floor(Math.random() * 1000),
        email,
        role: selectedRole,
      },
    };

    // Save to state
    setToken(mockResponse.accessToken);
    setRole(mockResponse.user.role);
    setUser(mockResponse.user);

    // Persist to localStorage
    localStorage.setItem("authToken", mockResponse.accessToken);
    localStorage.setItem("authRole", mockResponse.user.role);
    localStorage.setItem("authUser", JSON.stringify(mockResponse.user));
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);

    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    localStorage.removeItem("authUser");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, role, user, login, logout, isAuthenticated }}>
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
