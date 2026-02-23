import { useEffect, useState } from "react";
import { SafeAreaView, Text, FlatList, ActivityIndicator, View } from "react-native";

import { api } from "@/lib/api";
import { layout } from "@/theme/layout";
import { components } from "@/theme/components";
import { colors } from "@/theme/colors";

type Task = {
  id: string;
  title: string;
  notes?: string | null;
  deadline: string;
  status: "ANALISIS" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
};

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/tasks") // endpoint de tareas
      .then((res) => setTasks(res.data))
      .catch((err) =>
        console.error("Error fetching tasks:", err.response?.data || err)
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

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "ANALISIS":
        return "#f59e0b"; // amarillo
      case "IN_PROGRESS":
        return "#3b82f6"; // azul
      case "COMPLETED":
        return "#10b981"; // verde
      default:
        return "#666";
    }
  };

  const getPriorityLabel = (priority: Task["priority"]) => {
    switch (priority) {
      case "LOW":
        return "Baja";
      case "MEDIUM":
        return "Media";
      case "HIGH":
        return "Alta";
    }
  };

  return (
    <SafeAreaView style={layout.container}>
      <View style={layout.card}>
        <Text style={layout.title}>Mis Tareas</Text>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={components.separator} />}
          ListEmptyComponent={() => (
            <Text style={{ marginTop: 20 }}>No tenés tareas asignadas.</Text>
          )}
          renderItem={({ item }) => (
            <View style={[components.userItem, { padding: 16 }]}>
              <Text style={components.userName}>{item.title}</Text>

              <Text style={{ marginTop: 4, fontSize: 14, color: "#666" }}>
                Deadline: {new Date(item.deadline).toLocaleString()}
              </Text>

              <View style={{ flexDirection: "row", marginTop: 6, alignItems: "center" }}>
                <Text
                  style={{
                    color: "#fff",
                    backgroundColor: getStatusColor(item.status),
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4,
                    fontSize: 12,
                    marginRight: 8,
                  }}
                >
                  {item.status.replace("_", " ")}
                </Text>

                <Text
                  style={{
                    color: "#fff",
                    backgroundColor: "#6b7280",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                >
                  {getPriorityLabel(item.priority)}
                </Text>
              </View>

              {item.notes ? (
                <Text style={{ marginTop: 8, fontSize: 14, color: "#666" }}>
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
