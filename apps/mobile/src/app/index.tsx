import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useConvexAuth } from "@convex-dev/auth/react";
import { colors } from "@/components/ui";

export default function IndexRoute() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.coral} size="large" />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? "/(tabs)/dashboard" : "/auth/sign-in"} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
