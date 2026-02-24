import { useState, useContext } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Link } from "expo-router";

import { AuthContext } from "../../context/AuthContext";
import { layout } from "@/theme/layout";
import { colors } from "@/theme/colors";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      await login(email, password);
    } catch (error: any) {
      alert(error?.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[layout.container, { justifyContent: "center" }]}>
      <View style={layout.card}>
        <Text style={layout.title}>Iniciar Sesión</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            fontSize: 16,
          }}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 20,
            fontSize: 16,
          }}
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={{
            backgroundColor: colors.primary,
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
              Entrar
            </Text>
          )}
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <Link
            href="/(auth)/register"
            style={{ color: colors.primary, fontWeight: "600" }}
          >
            Crear cuenta
          </Link>

          <TouchableOpacity onPress={() => alert("Función no implementada")}>
            <Text style={{ color: colors.primary, fontWeight: "600" }}>
              Olvidé mi contraseña
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
