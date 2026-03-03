import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type UserRole = "sender" | "traveller" | "receiver";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("carrygo_user");
    if (stored) setUser(JSON.parse(stored));
    setIsLoading(false);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem("carrygo_user", JSON.stringify(u));
    else localStorage.removeItem("carrygo_user");
  };

  const signup = (name: string, email: string, _password: string, role: UserRole) => {
    const users: User[] = JSON.parse(localStorage.getItem("carrygo_users") || "[]");
    if (users.find((u) => u.email === email)) return false;
    const newUser: User = { id: crypto.randomUUID(), name, email, role };
    users.push(newUser);
    localStorage.setItem("carrygo_users", JSON.stringify(users));
    persist(newUser);
    return true;
  };

  const login = (email: string, _password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem("carrygo_users") || "[]");
    const found = users.find((u) => u.email === email);
    if (!found) return false;
    persist(found);
    return true;
  };

  const logout = () => persist(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
