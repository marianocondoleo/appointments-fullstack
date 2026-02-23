import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native";

import { layout } from "@/theme/layout";
import { components } from "@/theme/components";
import { colors } from "@/theme/colors";
import { api } from "@/lib/api";

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

      const response = await api.post("/auth/register", {
        firstName: form.nombre,
        lastName: form.apellido,
        phone: form.telefono,
        address: form.direccion,
        email: form.email,
        password: form.password,
      });

      Alert.alert("Éxito", "Cuenta creada correctamente");
      router.replace("/(auth)/login");
    } catch (error: any) {
      if (error.response) {
        Alert.alert("Error", error.response.data.error || "Error del servidor");
      } else {
        Alert.alert("Error", "No se pudo conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[layout.container, { justifyContent: "center" }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={layout.card}>
          <Text style={layout.title}>Crear cuenta</Text>

          {["nombre","apellido","telefono","direccion","email","password","repeatPassword"].map((field, i) => (
            <TextInput
              key={i}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              placeholderTextColor="rgba(255,255,255,0.45)"
              style={components.input}
              secureTextEntry={field.toLowerCase().includes("password")}
              keyboardType={field === "telefono" ? "phone-pad" : field === "email" ? "email-address" : "default"}
              autoCapitalize={field === "email" ? "none" : "sentences"}
              value={(form as any)[field]}
              onChangeText={(value) => handleChange(field, value)}
            />
          ))}

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
            <Text style={{ color: colors.textSecondary }}>¿Ya tenés cuenta?</Text>
            <Link
              href="/(auth)/login"
              style={{ color: colors.primary, fontWeight: "700", marginTop: 4 }}
            >
              Iniciar sesión
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
