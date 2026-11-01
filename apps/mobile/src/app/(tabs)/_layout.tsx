import { Redirect, Tabs } from "expo-router";
import { useConvexAuth } from "@convex-dev/auth/react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "@/components/ui";

const tabSymbols: Record<string, string> = {
  dashboard: "⌂",
  expense: "+",
  wishlist: "♡",
  overview: "▥",
};

export default function TabsLayout() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.coral} />
      </View>
    );
  }
  if (!isAuthenticated) return <Redirect href="/auth/sign-in" />;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.subtle,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "800", marginBottom: 4 },
        tabBarStyle: {
          height: 66,
          paddingTop: 5,
          borderTopColor: colors.line,
          backgroundColor: "#fffefa",
        },
        tabBarIcon: ({ color }) => (
          <Text style={{ color, fontSize: 23, fontWeight: "700" }}>
            {tabSymbols[route.name]}
          </Text>
        ),
      })}
    >
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="expense" options={{ title: "Add expense" }} />
      <Tabs.Screen name="wishlist" options={{ title: "Wishlist" }} />
      <Tabs.Screen name="overview" options={{ title: "Overview" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
