import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types";
import { authService } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ─── Run ONCE on mount ────────────────────────────────────────────
  // Check if a token already exists in localStorage from a previous session.
  // If yes, verify it with /me. If /me fails, clear everything.
  // This is the ONLY place /me is called automatically.
  useEffect(() => {
    const saved = localStorage.getItem("esamu_token");
    if (!saved) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then((res) => {
        setUser(res.data.data);
        setToken(saved);
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          setToken(null);
          localStorage.removeItem("esamu_token");
        }
      })
      .finally(() => setLoading(false));
  }, []); // ← EMPTY array — runs once, never re-runs when token changes

  // ─── Login ────────────────────────────────────────────────────────
  // We get the user object directly from the login response.
  // We do NOT call /me again. We do NOT change the useEffect dependency.
  const login = async (email: string, password: string): Promise<void> => {
    const res = await authService.login(email, password);
    const { token: newToken, user: newUser } = res.data.data;
    localStorage.setItem("esamu_token", newToken);
    setToken(newToken);
    setUser(newUser); // ← set user directly, no /me call needed
  };

  // ─── Logout ───────────────────────────────────────────────────────
  const logout = (): void => {
    authService.logout().catch(() => {});
    localStorage.removeItem("esamu_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
