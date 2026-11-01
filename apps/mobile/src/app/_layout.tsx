import { ConvexAuthProvider } from "@convex-dev/auth/react";
import type { TokenStorage } from "@convex-dev/auth/react";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform, StyleSheet, Text, View } from "react-native";
import { ConvexReactClient } from "convex/react";
import { colors } from "@/components/ui";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
const convexClient = convexUrl ? new ConvexReactClient(convexUrl) : null;

const storage: TokenStorage = {
  getItem: (key) =>
    Platform.OS === "web"
      ? globalThis.localStorage?.getItem(key)
      : SecureStore.getItemAsync(key),
  setItem: (key, value) =>
    Platform.OS === "web"
      ? globalThis.localStorage?.setItem(key, value)
      : SecureStore.setItemAsync(key, value),
  removeItem: (key) =>
    Platform.OS === "web"
      ? globalThis.localStorage?.removeItem(key)
      : SecureStore.deleteItemAsync(key),
};

function MissingConfiguration() {
  return (
    <View style={styles.missingConfig}>
      <Text style={styles.brand}>moneyleh</Text>
      <Text style={styles.title}>Connect your Convex deployment</Text>
      <Text style={styles.message}>
        Copy apps/mobile/.env.example to apps/mobile/.env and set
        EXPO_PUBLIC_CONVEX_URL to your Convex deployment URL, then restart Expo.
      </Text>
    </View>
  );
}

function AppNavigation() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/sign-in" />
      <Stack.Screen name="auth/sign-up" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="profile/account-info" />
    </Stack>
  );
}

export default function RootLayout() {
  if (!convexClient) return <MissingConfiguration />;

  return (
    <ConvexAuthProvider client={convexClient} storage={storage}>
      <AppNavigation />
    </ConvexAuthProvider>
  );
}

const styles = StyleSheet.create({
  missingConfig: {
    flex: 1,
    justifyContent: "center",
    gap: 14,
    padding: 28,
    backgroundColor: colors.background,
  },
  brand: { color: colors.green, fontSize: 16, fontWeight: "900" },
  title: { color: colors.ink, fontSize: 28, fontWeight: "900" },
  message: { color: colors.muted, fontSize: 15, lineHeight: 23 },
});
