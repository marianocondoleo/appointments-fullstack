import { SafeAreaView, Text, View } from "react-native";
import { layout } from "@/theme/layout";

export default function AppointmentsScreen() {
  return (
    <SafeAreaView style={layout.container}>
      <View style={layout.card}>
        <Text style={layout.subtitle}>
          Acá vamos a listar turnos, crear turnos y gestionar disponibilidad.
        </Text>
      </View>
    </SafeAreaView>
  );
}
