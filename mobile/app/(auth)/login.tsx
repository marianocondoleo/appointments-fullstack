import { Link } from "expo-router";
import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Iniciar sesión</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="rgba(255,255,255,0.45)"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="rgba(255,255,255,0.45)"
          style={styles.input}
          secureTextEntry
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tenés cuenta?</Text>
          <Link href="/(auth)/register" style={styles.link}>
            Registrate
          </Link>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Volver a</Text>
          <Link href="/(tabs)" style={styles.link}>
            Home
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#111B2E",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    color: "white",
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  footerText: {
    color: "rgba(255,255,255,0.7)",
  },
  link: {
    color: "#5BC0EB",
    fontWeight: "700",
  },
});
