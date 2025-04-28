import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { AUTHORIZED_EMAILS } from "../config/auth";

// Define types for user and context
interface User {
  email: string;
  name: string;
  authorized: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  clearError: () => {},
});

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check local storage for logged in user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("mockingbird_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("mockingbird_user");
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Validate email domain
      if (!email.endsWith("@magnitglobal.com")) {
        throw new Error("Only magnitglobal.com email addresses are allowed");
      }

      // Mock login - in a real app, this would call an API
      // For demo purposes, simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Determine if user is authorized to use Test Case Generator
      const isAuthorized = AUTHORIZED_EMAILS.includes(email);

      // Create user object
      const newUser = {
        email,
        name: email.split("@")[0],
        authorized: isAuthorized,
      };

      // Store in state and localStorage
      setUser(newUser);
      localStorage.setItem("mockingbird_user", JSON.stringify(newUser));
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Validate email domain
      if (!email.endsWith("@magnitglobal.com")) {
        throw new Error("Only magnitglobal.com email addresses are allowed");
      }

      // Mock signup - in a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Determine if user is authorized to use Test Case Generator
      const isAuthorized = AUTHORIZED_EMAILS.includes(email);

      // Create user object
      const newUser = {
        email,
        name,
        authorized: isAuthorized,
      };

      // Store in state and localStorage
      setUser(newUser);
      localStorage.setItem("mockingbird_user", JSON.stringify(newUser));
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("mockingbird_user");
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        signup,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
