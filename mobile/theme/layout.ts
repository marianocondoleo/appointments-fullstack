import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";

export const layout = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.screenPadding,
  },

  card: {
    backgroundColor: colors.card,
    padding: spacing.cardPadding,
    borderRadius: spacing.radius,
    borderWidth: 1,
    borderColor: colors.border,
  },

  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
