import { useState } from "react";
import { Link, useRouter } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import { layout } from "@/theme/layout";
import { components } from "@/theme/components";
import { colors } from "@/theme/colors";
import { API_URL } from "@/lib/api";

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    if (
      !form.nombre ||
      !form.apellido ||
      !form.telefono ||
      !form.direccion ||
      !form.email ||
      !form.password ||
      !form.repeatPassword
    ) {
      Alert.alert("Error", "Completá todos los campos");
      return;
    }

    if (form.password !== form.repeatPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: form.nombre,
          lastName: form.apellido,
          phone: form.telefono,
          address: form.direccion,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar");
      }

      Alert.alert("Éxito", "Cuenta creada correctamente");

      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[layout.container, { justifyContent: "center" }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={layout.card}>
          <Text style={layout.title}>Crear cuenta</Text>

          <TextInput
            placeholder="Nombre"
            placeholderTextColor="rgba(255,255,255,0.45)"
            style={components.input}
            value={form.nombre}
            onChangeText={(value) => handleChange("nombre", value)}
          />

          <TextInput
            placeholder="Apellido"
            placeholderTextColor="rgba(255,255,255,0.45)"
            style={components.input}
            value={form.apellido}
            onChangeText={(value) => handleChange("apellido", value)}
          />

          <TextInput
            placeholder="Teléfono"
            placeholderTextColor="rgba(255,255,255,0.45)"
            style={components.input}
            keyboardType="phone-pad"
            value={form.telefono}
            onChangeText={(value) => handleChange("telefono", value)}
          />

          <TextInput
            placeholder="Dirección"
            placeholderTextColor="rgba(255,255,255,0.45)"
            style={components.input}
            value={form.direccion}
            onChangeText={(value) => handleChange("direccion", value)}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.45)"
            style={components.input}
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(value) => handleChange("email", value)}
          />

          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="rgba(255,255,255,0.45)"
            style={components.input}
            secureTextEntry
            value={form.password}
            onChangeText={(value) => handleChange("password", value)}
          />

          <TextInput
            placeholder="Repetir contraseña"
            placeholderTextColor="rgba(255,255,255,0.45)"
            style={components.input}
            secureTextEntry
            value={form.repeatPassword}
            onChangeText={(value) =>
              handleChange("repeatPassword", value)
            }
          />

          <TouchableOpacity
            style={components.button}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={components.buttonText}>
              {loading ? "Registrando..." : "Registrarse"}
            </Text>
          </TouchableOpacity>

          <View style={{ marginTop: 20 }}>
            <Text style={{ color: colors.textSecondary }}>
              ¿Ya tenés cuenta?
            </Text>
            <Link
              href="/(auth)/login"
              style={{
                color: colors.primary,
                fontWeight: "700",
                marginTop: 4,
              }}
            >
              Iniciar sesión
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
