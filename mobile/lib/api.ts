// lib/api.ts
import axios from "axios";
import { Platform } from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

/* 🔥 INTERCEPTOR AUTOMÁTICO */
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);
