import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function AppointmentsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Turnos</Text>
        <Text style={styles.subtitle}>
          Acá vamos a listar turnos, crear turnos, y gestionar disponibilidad.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    padding: 20,
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 20,
  },
});
