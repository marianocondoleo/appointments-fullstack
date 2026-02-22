import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { api } from "../lib/api";
import { Platform } from "react-native";

interface AuthContextData {
  user: any;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("🔥 AuthProvider mounted");
    loadToken();
  }, []);

  async function loadToken() {
    console.log("🔥 loadToken ejecutado");

    try {
      let storedToken: string | null = null;

      if (Platform.OS === "web") {
        storedToken = localStorage.getItem("token");
      } else {
        storedToken = await SecureStore.getItemAsync("token");
      }

      console.log("📦 Stored token:", storedToken);

      if (!storedToken) {
        console.log("❌ No stored token");
        return;
      }

      api.defaults.headers.Authorization = `Bearer ${storedToken}`;
      setToken(storedToken);

      console.log("📡 Calling /auth/me...");

      const response = await api.get("/auth/me");

      console.log("✅ User restored:", response.data);

      setUser(response.data);
    } catch (error: any) {
      console.log("🚨 Error restoring session:", error?.response?.data || error);
      await logout();
    } finally {
      console.log("🔚 isLoading -> false");
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    console.log("🔐 Login attempt");

    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    console.log("✅ Login success:", user);

    if (Platform.OS === "web") {
      localStorage.setItem("token", token);
    } else {
      await SecureStore.setItemAsync("token", token);
    }

    api.defaults.headers.Authorization = `Bearer ${token}`;

    setToken(token);
    setUser(user);
  }

  async function logout() {
    console.log("🚪 Logout");

    if (Platform.OS === "web") {
      localStorage.removeItem("token");
    } else {
      await SecureStore.deleteItemAsync("token");
    }

    delete api.defaults.headers.Authorization;

    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

