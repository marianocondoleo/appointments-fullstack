import { useContext } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { AuthContext } from "@/context/AuthContext";
import { layout } from "@/theme/layout";
import { colors } from "@/theme/colors";

export default function ProfileScreen() {
  const { user, logout, isLoading, token } = useContext(AuthContext);

  if (isLoading) {
    return (
      <SafeAreaView style={layout.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!token) return null;

  if (!user) {
    return (
      <SafeAreaView style={layout.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={layout.container}>
      <View style={[layout.card, styles.card]}>
        <View style={styles.section}>
          <ProfileItem
            label="Nombre"
            value={`${user.firstName} ${user.lastName}`}
          />
          <ProfileItem label="Email" value={user.email} />
          {user.phone && <ProfileItem label="Teléfono" value={user.phone} />}
          {user.address && <ProfileItem label="Dirección" value={user.address} />}
        </View>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>


      </View>
    </SafeAreaView>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 24,
  },
  title: {
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 20,
    opacity: 0.4,
  },
  section: {
    gap: 18,
    marginBottom: 30,
  },
  itemContainer: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 10,
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "red",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
