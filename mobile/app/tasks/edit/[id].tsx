import { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { api } from "@/lib/api";
import { layout } from "@/theme/layout";
import { components } from "@/theme/components";
import { colors } from "@/theme/colors";

/* ================= WEB DATEPICKER ================= */

let WebDatePicker: any = null;

if (Platform.OS === "web") {
  WebDatePicker = require("react-datepicker").default;
  require("react-datepicker/dist/react-datepicker.css");
}

export default function EditTaskScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [status, setStatus] =
    useState<"ANALISIS" | "IN_PROGRESS" | "COMPLETED">("ANALISIS");
  const [priority, setPriority] =
    useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= TRAER DATA ================= */

  const fetchTask = async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      const task = res.data;

      setTitle(task.title);
      setNotes(task.notes || "");
      setStatus(task.status);
      setPriority(task.priority);
      setDeadline(new Date(task.deadline));
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la tarea");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTask();
  }, [id]);

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS !== "ios") setShowDatePicker(false);
    if (selectedDate) setDeadline(selectedDate);
  };

  /* ================= ACTUALIZAR ================= */

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "El título es obligatorio");
      return;
    }

    if (!deadline) {
      Alert.alert("Error", "Debes seleccionar una fecha y hora");
      return;
    }

    try {
      setSaving(true);

      await api.put(`/tasks/${id}`, {
        title,
        notes,
        deadline: deadline.toISOString(),
        status,
        priority,
      });

      Alert.alert("Éxito", "Tarea actualizada correctamente");
      router.replace("/(tabs)/tasks");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "No se pudo actualizar la tarea"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <SafeAreaView style={layout.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={layout.card}>
          <Text style={layout.title}>Editar Tarea</Text>

          {/* Título */}
          <TextInput
            placeholder="Título"
            placeholderTextColor="#fff"
            value={title}
            onChangeText={setTitle}
            style={components.input}
          />

          {/* Notes */}
          <TextInput
            placeholder="Notas (opcional)"
            placeholderTextColor="#fff"
            value={notes}
            onChangeText={setNotes}
            style={[components.input, { height: 80 }]}
            multiline
          />

          {/* DEADLINE */}
          <Text
            style={{
              marginBottom: 4,
              fontWeight: "600",
              color: "#fff",
              marginTop: 12,
            }}
          >
            Deadline
          </Text>

          {Platform.OS === "web" ? (
            <WebDatePicker
              selected={deadline}
              onChange={(date: Date) => setDeadline(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              minDate={new Date()}
              locale={es}
              className="react-datepicker-custom"
            />
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={[components.input, { justifyContent: "center" }]}
              >
                <Text style={{ color: "#fff" }}>
                  {deadline
                    ? format(deadline, "dd/MM/yyyy HH:mm", { locale: es })
                    : "Seleccionar fecha y hora"}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={deadline || new Date()}
                  mode="datetime"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </>
          )}

          {/* STATUS */}
          <View style={{ marginTop: 12 }}>
            <Text
              style={{
                marginBottom: 4,
                fontWeight: "600",
                color: "#fff",
              }}
            >
              Estado
            </Text>

            <View style={{ flexDirection: "row", gap: 8 }}>
              {["ANALISIS", "IN_PROGRESS", "COMPLETED"].map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setStatus(s as any)}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    backgroundColor:
                      status === s ? colors.primary : "#e5e7eb",
                  }}
                >
                  <Text
                    style={{
                      color: status === s ? "#fff" : "#000",
                      fontWeight: "600",
                    }}
                  >
                    {s.replace("_", " ")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* PRIORITY */}
          <View style={{ marginTop: 12 }}>
            <Text
              style={{
                marginBottom: 4,
                fontWeight: "600",
                color: "#fff",
              }}
            >
              Prioridad
            </Text>

            <View style={{ flexDirection: "row", gap: 8 }}>
              {["LOW", "MEDIUM", "HIGH"].map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPriority(p as any)}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    backgroundColor:
                      priority === p ? colors.primary : "#e5e7eb",
                  }}
                >
                  <Text
                    style={{
                      color: priority === p ? "#fff" : "#000",
                      fontWeight: "600",
                    }}
                  >
                    {p === "LOW"
                      ? "Baja"
                      : p === "MEDIUM"
                      ? "Media"
                      : "Alta"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        {/* BOTONES */}
<View
  style={{
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  }}
>
  <TouchableOpacity
    onPress={() => router.push("/(tabs)/tasks")}
    style={{
      backgroundColor: "#6b7280",
      padding: 16,
      borderRadius: 8,
      flex: 1,
      marginRight: 8,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
      }}
    >
      Volver
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
  onPress={handleUpdate}
  disabled={saving}
  style={{
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <Text
    style={{
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
      textAlign: "center",
      width: "100%",
    }}
  >
    {saving ? "Guardando..." : "Guardar Cambios"}
  </Text>
</TouchableOpacity>
</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}