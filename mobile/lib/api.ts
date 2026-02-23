// lib/api.ts
import axios from "axios";
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

let baseURL = "";

if (Platform.OS === "web") {
  baseURL = "http://localhost:4000";
} else {
  const debuggerHost =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest?.debuggerHost;

  const host = debuggerHost?.split(":").shift();
  baseURL = `http://${host}:4000`;
}

export const api = axios.create({
  baseURL,
});

/* 🔥 INTERCEPTOR AUTOMÁTICO CONSISTENTE CON AUTHCONTEXT */
api.interceptors.request.use(
  async (config) => {
    let token: string | null = null;

    try {
      if (Platform.OS === "web") {
        token = localStorage.getItem("token");
      } else {
        token = await SecureStore.getItemAsync("token");
      }

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("Error getting token:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);