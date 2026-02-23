import { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { api } from "@/lib/api";
import { layout } from "@/theme/layout";
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
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [searchText, setSearchText] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks");

      // Ordenar por deadline ascendente
      const sortedTasks = res.data.sort(
        (a: Task, b: Task) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      );

      setTasks(sortedTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
            fetchTasks();
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudo eliminar la tarea");
          }
        },
      },
    ]);
  };

  const toggleNotes = (id: string) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusLabel = (status: Task["status"]) => {
    switch (status) {
      case "ANALISIS":
        return "En análisis";
      case "IN_PROGRESS":
        return "En progreso";
      case "COMPLETED":
        return "Completada";
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

  const getStatusColor = (status: Task["status"]) => "#666"; // gris siempre

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
      {/* Buscador */}
      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <TextInput
          placeholder="Buscar tarea por título..."
          value={searchText}
          onChangeText={setSearchText}
          style={{
            backgroundColor: "#f1f5f9",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            fontSize: 14,
            color: "#000",
          }}
        />
      </View>

      {/* Lista de tareas */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={() => (
          <Text
            style={{
              fontSize: 16,
              color: "#666",
              textAlign: "center",
              marginTop: 40,
            }}
          >
            No hay tareas que coincidan con la búsqueda.
          </Text>
        )}
        renderItem={({ item }) => {
          const formattedDate = new Date(item.deadline).toLocaleDateString(
            "es-AR"
          );

          return (
            <View
              style={{
                padding: 16,
                marginBottom: 12,
                borderRadius: 12,
                backgroundColor: "#eff6ff",
                elevation: 3,
              }}
            >
              {/* Primera línea: Título + Status + Prioridad */}
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: "#000" }}>
                  {item.title}{" "}
                  <Text
                    style={{
                      color: getStatusColor(item.status),
                      fontStyle: "italic",                 
                      fontWeight: "600",
                    }}
                  >
                    ({getStatusLabel(item.status)})
                  </Text>
                </Text>

                <Text
                  style={{
                    color: getPriorityColor(item.priority),
                    fontWeight: "800",
                    fontSize: 14,
                    fontStyle: "italic",
                  }}
                >
                  Prioridad {getPriorityLabel(item.priority)}
                </Text>
              </View>

              {/* Deadline */}
              <Text style={{ marginTop: 4, fontSize: 14, color: "#666" }}>
                {formattedDate}
              </Text>

              {/* Notas como desplegable */}
              {item.notes ? (
                <TouchableOpacity
                  onPress={() => toggleNotes(item.id)}
                  style={{ marginTop: 8 }}
                >
                  <Text style={{ color: "#666", fontSize: 14 }}>
                    {expandedNotes[item.id] ? "Ocultar ▲" : "Ver más ▼"}
                  </Text>

                  {expandedNotes[item.id] && (
                    <Text style={{ marginTop: 4, fontSize: 14, color: "#666" }}>
                      {item.notes}
                    </Text>
                  )}
                </TouchableOpacity>
              ) : null}

              {/* Botones como iconos */}
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 12,
                  justifyContent: "flex-end",
                  gap: 16,
                }}
              >
                <TouchableOpacity onPress={() => router.push(`/tasks/edit/${item.id}`)}>
                  <Feather name="edit" size={20} color={colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Feather name="trash-2" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {/* Botón agregar tarea */}
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
          <Feather name="plus-circle" size={20} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}