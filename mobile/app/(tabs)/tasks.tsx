import { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

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

export default function TasksScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Traer tareas
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Eliminar tarea
  const handleDelete = async (id: string) => {
    Alert.alert("Confirmar", "¿Querés eliminar esta tarea?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/tasks/${id}`);
            Alert.alert("Éxito", "Tarea eliminada");
            fetchTasks(); // refrescar lista
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudo eliminar la tarea");
          }
        },
      },
    ]);
  };

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
  const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "LOW":
      return "#10b981"; // verde
    case "MEDIUM":
      return "#f59e0b"; // amarillo
    case "HIGH":
      return "#ef4444"; // rojo
    default:
      return "#666";
  }
};

  if (loading) {
    return (
      <SafeAreaView style={layout.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={layout.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={() => (
          <Text>No hay tareas creadas aún.</Text>
        )}
        renderItem={({ item }) => (
          <View
            style={[
              components.userItem,
              { padding: 16, marginBottom: 12 },
            ]}
          >
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
                  backgroundColor: getPriorityColor(item.priority),
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

            <View style={{ flexDirection: "row", marginTop: 12, justifyContent: "flex-end" }}>
              <TouchableOpacity
                onPress={() => router.push(`/tasks/edit/${item.id}`)}
                style={{
                  marginRight: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: colors.primary,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: "#ef4444",
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Botón para agregar tarea */}
      <TouchableOpacity
        onPress={() => router.push("/tasks/newTask")}
        style={{
          backgroundColor: colors.primary,
          padding: 16,
          borderRadius: 8,
          alignItems: "center",
          margin: 16,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
          Agregar Tarea
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
