"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "./api";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  currency: "USD" | "ARS";
  role: "USER" | "ADMIN";
}

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  /** true mientras se valida el token guardado al cargar la app */
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    email: string,
    code: string,
    newPassword: string,
  ) => Promise<void>;
  logout: () => void;
  setCurrency: (currency: "USD" | "ARS") => Promise<void>;
}

const TOKEN_KEY = "finanzasp:token";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app: si hay token guardado, se valida contra /auth/me
  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (!saved) {
      setLoading(false);
      return;
    }
    api<{ user: AuthUser }>("/auth/me", { token: saved })
      .then((res) => {
        setToken(saved);
        setUser(res.user);
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const saveSession = useCallback((res: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    setToken(res.accessToken);
    setUser(res.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      saveSession(res);
    },
    [saveSession],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      // La cuenta queda pendiente hasta verificar el código enviado por correo.
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
    },
    [],
  );

  const verifyEmail = useCallback(
    async (email: string, code: string) => {
      const res = await api<AuthResponse>("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
      saveSession(res);
    },
    [saveSession],
  );

  const resendCode = useCallback(async (email: string) => {
    await api("/auth/resend-code", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }, []);

  // Pide el código de recuperación: el backend responde igual exista o no la cuenta.
  const forgotPassword = useCallback(async (email: string) => {
    await api("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }, []);

  // Envía el código recibido por correo junto con la nueva contraseña.
  const resetPassword = useCallback(
    async (email: string, code: string, newPassword: string) => {
      await api("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, code, newPassword }),
      });
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const setCurrency = useCallback(
    async (currency: "USD" | "ARS") => {
      if (!token) return;
      const res = await api<{ user: AuthUser }>("/users/me", {
        method: "PATCH",
        body: JSON.stringify({ currency }),
        token,
      });
      setUser(res.user);
    },
    [token],
  );

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      verifyEmail,
      resendCode,
      forgotPassword,
      resetPassword,
      logout,
      setCurrency,
    }),
    [
      user,
      token,
      loading,
      login,
      register,
      verifyEmail,
      resendCode,
      forgotPassword,
      resetPassword,
      logout,
      setCurrency,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
