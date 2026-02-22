import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { spacing } from "./spacing";

export const components = StyleSheet.create({
  userItem: {
    paddingVertical: 10,
  },

  userName: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 15,
  },

  userEmail: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    marginTop: 2,
  },

  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 8,
  },

  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: 12,
    borderRadius: spacing.inputRadius,
    color: colors.text,
    marginBottom: 16,
  },

  button: {
    marginTop: 10,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: spacing.buttonRadius,
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "700",
    color: colors.background,
  },
});
