"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { login, logout, getMe } from "@/lib/auth";

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function handleLoadUser() {
    try {
      const data = await getMe();
      if (data) setUser(data);
    } finally {
      setLoading(false);
    }
  }


  async function handleLogin(email: string, password: string) {
    await login(email, password);
    const data = await getMe();
    setUser(data);
  }

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login: handleLogin,
      logout: handleLogout,
      loadUser: handleLoadUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext missing");
  return ctx;
}
