import type { ReactNode } from "react";
import {
  Pressable,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextStyle,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

export const colors = {
  background: "#f8f6f0",
  ink: "#27352f",
  muted: "#75837b",
  subtle: "#829087",
  line: "#dce6dc",
  coral: "#e88976",
  green: "#4e7460",
  mint: "#9ed9c2",
  blue: "#a9c7f5",
  yellow: "#f8d66d",
  paleGreen: "#edf7ed",
  paleCoral: "#fff0ec",
  paleYellow: "#fff8dd",
  white: "#ffffff",
};

export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <View style={styles.blueGlow} />
        <View style={styles.greenGlow} />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>{children}</View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function AppHeader({
  username,
  photo,
  onPressProfile,
}: {
  username?: string;
  photo?: string;
  onPressProfile: () => void;
}) {
  const initial = username?.trim().charAt(0).toUpperCase() || "U";

  return (
    <View style={styles.header}>
      <View style={styles.brandWrap}>
        <View style={styles.brandIcon}>
          <Text style={styles.brandLeaf}>✦</Text>
        </View>
        <Text style={styles.brand}>moneyleh</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open profile for ${username ?? "user"}`}
        onPress={onPressProfile}
        style={styles.avatar}
      >
        {photo ? (
          <Image source={{ uri: photo }} style={styles.avatarPhoto} />
        ) : (
          <Text style={styles.avatarText}>{initial}</Text>
        )}
      </Pressable>
    </View>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function Heading({
  children,
  style,
}: {
  children: ReactNode;
  style?: TextStyle;
}) {
  return <Text style={[styles.heading, style]}>{children}</Text>;
}

export function BodyText({
  children,
  style,
}: {
  children: ReactNode;
  style?: TextStyle;
}) {
  return <Text style={[styles.bodyText, style]}>{children}</Text>;
}

export function SectionTitle({
  title,
  detail,
}: {
  title: string;
  detail?: string;
}) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionHeading}>{title}</Text>
      {detail ? <Text style={styles.sectionDetail}>{detail}</Text> : null}
    </View>
  );
}

export function Field({
  label,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholderTextColor="#9aaa9f"
        style={styles.input}
        {...props}
      />
    </View>
  );
}

export function ActionButton({
  label,
  onPress,
  disabled = false,
  secondary = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        secondary && styles.secondaryButton,
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressedButton,
      ]}
    >
      <Text style={[styles.actionText, secondary && styles.secondaryText]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ProgressBar({
  percent,
  color = colors.mint,
}: {
  percent: number;
  color?: string;
}) {
  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          { width: `${Math.min(100, Math.max(0, percent))}%`, backgroundColor: color },
        ]}
      />
    </View>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <Text style={styles.emptyState}>
      {children}
    </Text>
  );
}

export function ErrorMessage({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <Text style={styles.errorMessage}>{children}</Text>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  background: { flex: 1, overflow: "hidden" },
  blueGlow: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    top: -170,
    right: -80,
    backgroundColor: "rgba(169,199,245,0.28)",
  },
  greenGlow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    top: -190,
    left: -140,
    backgroundColor: "rgba(158,217,194,0.25)",
  },
  scrollContent: { flexGrow: 1, paddingHorizontal: 16, paddingVertical: 12 },
  content: { width: "100%", maxWidth: 720, alignSelf: "center", gap: 18, paddingBottom: 20 },
  header: {
    minHeight: 62,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "rgba(255,255,255,0.92)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink,
  },
  brandLeaf: { color: colors.yellow, fontSize: 18, fontWeight: "900" },
  brand: { color: colors.ink, fontSize: 17, fontWeight: "900", letterSpacing: -0.5 },
  avatar: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: colors.yellow,
    overflow: "hidden",
  },
  avatarPhoto: { width: "100%", height: "100%" },
  avatarText: { color: colors.ink, fontSize: 15, fontWeight: "900" },
  eyebrow: {
    color: colors.coral,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  heading: { color: colors.ink, fontSize: 29, fontWeight: "900", letterSpacing: -1.5 },
  bodyText: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  sectionTitle: { gap: 4, marginBottom: 14 },
  sectionHeading: { color: colors.ink, fontSize: 18, fontWeight: "900", letterSpacing: -0.6 },
  sectionDetail: { color: colors.subtle, fontSize: 12, lineHeight: 18 },
  card: {
    padding: 18,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.94)",
  },
  field: { gap: 7 },
  fieldLabel: { color: "#627069", fontSize: 12, fontWeight: "800" },
  input: {
    minHeight: 48,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.background,
    color: colors.ink,
    fontSize: 15,
  },
  actionButton: {
    minHeight: 46,
    paddingHorizontal: 18,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.coral,
  },
  actionText: { color: colors.white, fontSize: 14, fontWeight: "900" },
  secondaryButton: { backgroundColor: "#edf0ea" },
  secondaryText: { color: colors.ink },
  disabledButton: { opacity: 0.55 },
  pressedButton: { opacity: 0.8, transform: [{ scale: 0.99 }] },
  progressTrack: { height: 10, overflow: "hidden", borderRadius: 8, backgroundColor: "#edf0ea" },
  progressFill: { height: "100%", borderRadius: 8 },
  emptyState: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: colors.background,
    color: colors.subtle,
    fontSize: 14,
    lineHeight: 21,
  },
  errorMessage: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.paleCoral,
    color: "#bf624f",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },
});
