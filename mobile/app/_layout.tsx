import { Slot, Redirect, useSegments } from "expo-router";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import { View, ActivityIndicator } from "react-native";

function RootLayoutNav() {
  const segments = useSegments(); // 👈 SIEMPRE primero
  const { token, isLoading } = useContext(AuthContext); // 👈 SIEMPRE después

  const inAuthGroup = segments[0] === "(auth)";

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!token && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }

  if (token && inAuthGroup) {
    return <Redirect href="/(tabs)" />;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
