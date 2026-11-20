"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { User } from "../types";
import { api } from "../lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isOwnerOrAgent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user from localStorage on mount
    try {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("accessToken");
      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      const data = await api.login(credentials);
      setUser(data.user);
      return data.user;
    },
    []
  );

  const register = useCallback(
    async (payload: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      role: string;
    }) => {
      const data = await api.register(payload);
      setUser(data.user);
      return data.user;
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // Clear tokens regardless of network/server state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    } finally {
      setUser(null);
    }
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    try {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.getMe();
      if (res.data) {
        updateUser(res.data);
      }
    } catch {
      // Ignore refresh error
    }
  }, [updateUser]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      updateUser,
      refreshUser,
      isAuthenticated: !!user,
      isOwnerOrAgent:
        user?.role === "OWNER" || user?.role === "AGENT" || user?.role === "ADMIN",
    }),
    [user, loading, login, register, logout, updateUser, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>
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
