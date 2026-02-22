import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  FlatList,
  ActivityIndicator,
  View,
} from "react-native";

import { api } from "@/lib/api";
import { layout } from "@/theme/layout";
import { components } from "@/theme/components";
import { colors } from "@/theme/colors";

type Appointment = {
  id: string;
  date: string;
  title: string;
  notes?: string | null;
};

export default function HomeScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/appointments")
      .then((res) => setAppointments(res.data))
      .catch((err) =>
        console.error("Error fetching appointments:", err.response?.data || err)
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={layout.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={layout.container}>
      <View style={layout.card}>
        <Text style={layout.title}>Mis Turnos</Text>

        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => (
            <View style={components.separator} />
          )}
          ListEmptyComponent={() => (
            <Text style={{ marginTop: 20 }}>
              No tenés turnos agendados.
            </Text>
          )}
          renderItem={({ item }) => (
            <View style={components.userItem}>
              <Text style={components.userName}>{item.title}</Text>

              <Text style={components.userEmail}>
                {new Date(item.date).toLocaleString()}
              </Text>

              {item.notes ? (
                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 14,
                    color: "#666",
                  }}
                >
                  {item.notes}
                </Text>
              ) : null}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
