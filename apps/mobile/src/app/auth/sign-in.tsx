import { Link, Redirect, router } from "expo-router";
import { useState } from "react";
import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import {
  ActionButton,
  BodyText,
  Card,
  colors,
  ErrorMessage,
  Eyebrow,
  Field,
  Heading,
  Screen,
} from "@/components/ui";

export default function SignInScreen() {
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) return <Redirect href="/(tabs)/dashboard" />;

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      await signIn("password", {
        email: email.trim(),
        password,
        flow: "signIn",
      });
      router.replace("/(tabs)/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Card style={{ gap: 18, marginTop: 34 }}>
          <Eyebrow>Welcome back</Eyebrow>
          <Heading>Good to see you</Heading>
          <BodyText>
            Pick up where you left off and keep your money moving with intention.
          </BodyText>
          <Field
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            label="Email"
            onChangeText={setEmail}
            placeholder="you@example.com"
            value={email}
          />
          <Field
            autoComplete="password"
            label="Password"
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
          />
          <ErrorMessage>{error}</ErrorMessage>
          <ActionButton
            disabled={loading || !email.trim() || !password}
            label={loading ? "Signing in..." : "Sign in"}
            onPress={() => void submit()}
          />
          <View style={{ alignItems: "center", gap: 8 }}>
            <Text style={{ color: colors.muted, fontSize: 13 }}>
              New to moneyleh?
            </Text>
            <Link href="/auth/sign-up" style={{ color: colors.coral, fontWeight: "900" }}>
              Create an account
            </Link>
          </View>
        </Card>
      </KeyboardAvoidingView>
    </Screen>
  );
}
