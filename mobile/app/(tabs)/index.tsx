import { useState, useMemo, useCallback } from "react";
import {
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "expo-router";

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

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err: any) {
      console.error("Error fetching tasks:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const now = new Date();

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ANALISIS":
        return "En análisis";
      case "IN_PROGRESS":
        return "En progreso";
      default:
        return "";
    }
  };

  const stats = useMemo(() => {
    const analisis = tasks.filter((t) => t.status === "ANALISIS").length;
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const completed = tasks.filter((t) => t.status === "COMPLETED").length;
    const total = tasks.length;

    return { analisis, inProgress, completed, total };
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return [...tasks]
      .filter((t) => t.status !== "COMPLETED")
      .sort(
        (a, b) =>
          new Date(a.deadline).getTime() -
          new Date(b.deadline).getTime()
      );
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return [...tasks]
      .filter((t) => t.status === "COMPLETED")
      .sort(
        (a, b) =>
          new Date(b.deadline).getTime() -
          new Date(a.deadline).getTime()
      );
  }, [tasks]);

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return { color: "#b91c1c", background: "#fee2e2", label: "Alta" };
      case "MEDIUM":
        return { color: "#b45309", background: "#fef3c7", label: "Media" };
      default:
        return { color: "#065f46", background: "#d1fae5", label: "Baja" };
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
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* <Text style={layout.title}>Dashboard</Text> */}

        <Text
          style={{
            textAlign: "center",
            color: "#fff",
            fontSize: 16,
            marginBottom: 20,
          }}
        >
          {formatDate(now)}
        </Text>

        {/* 🔝 CARDS */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {[
            { label: "En análisis", value: stats.analisis },
            { label: "En progreso", value: stats.inProgress },
            { label: "Completadas", value: stats.completed },
            { label: "Totales", value: stats.total },
          ].map((item, index) => (
            <View
              key={index}
              style={{
                width: "48%",
                backgroundColor: "#fff",
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 14, color: "#666" }}>
                {item.label}
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: colors.primary,
                  marginTop: 4,
                }}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* 🔽 PRÓXIMAS TAREAS */}
        <Text style={[layout.title, { fontSize: 18, marginTop: 20 }]}>
          Próximas tareas
        </Text>

        {upcomingTasks.map((task) => {
          const style = getPriorityStyle(task.priority);

          return (
            <View
              key={task.id}
              style={{
                backgroundColor: style.background,
                padding: 14,
                borderRadius: 10,
                marginTop: 10,
              }}
            >
              <Text style={{ fontWeight: "700", fontSize: 16 }}>
                {task.title}{" "}
                <Text style={{ fontSize: 13, color: "#555" }}>
                  ({getStatusLabel(task.status)})
                </Text>
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  color: style.color,
                  fontWeight: "600",
                }}
              >
                Prioridad: {style.label}
              </Text>

              <Text style={{ marginTop: 4, fontSize: 13, color: "#555" }}>
                {formatDate(new Date(task.deadline))}
              </Text>
            </View>
          );
        })}

        {/* 📂 COMPLETADAS DESPLEGABLE */}
        <TouchableOpacity
          onPress={() => setShowCompleted(!showCompleted)}
        >
          <Text
            style={[
              layout.title,
              { fontSize: 18, marginTop: 30 },
            ]}
          >
            {showCompleted ? "▼" : "▶"} Tareas completadas
          </Text>
        </TouchableOpacity>

        {showCompleted &&
          completedTasks.map((task) => (
            <View
              key={task.id}
              style={{
                backgroundColor: "#e5e7eb",
                padding: 14,
                borderRadius: 10,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontWeight: "600",
                  textDecorationLine: "line-through",
                  color: "#374151",
                }}
              >
                {task.title}
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  fontSize: 13,
                  color: "#6b7280",
                }}
              >
                {formatDate(new Date(task.deadline))}
              </Text>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}