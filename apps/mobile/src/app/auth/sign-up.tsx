import { Link, Redirect, router } from "expo-router";
import { useQuery } from "convex/react";
import { useState } from "react";
import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { api } from "@web_backend/convex/_generated/api";
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

const passwordRules = [
  (value: string) => value.length >= 8,
  (value: string) => /[A-Z]/.test(value),
  (value: string) => /[0-9]/.test(value),
  (value: string) => /[^A-Za-z0-9]/.test(value),
];

export default function SignUpScreen() {
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const usernameAvailability = useQuery(
    api.usernameFilter.isUsernameAvailable,
    username.trim().length >= 3 ? { username: username.trim() } : "skip",
  );

  if (isAuthenticated) return <Redirect href="/(tabs)/dashboard" />;

  const submit = async () => {
    setError("");
    if (!usernameAvailability?.available) {
      setError(usernameAvailability?.reason ?? "Please choose an available username.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!passwordRules.every((rule) => rule(password))) {
      setError("Password needs 8+ characters, uppercase, a number, and a symbol.");
      return;
    }

    setLoading(true);
    try {
      await signIn("password", {
        email: email.trim(),
        password,
        username: username.trim(),
        flow: "signUp",
      });
      router.replace("/(tabs)/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Card style={{ gap: 16, marginTop: 20 }}>
          <Eyebrow>Make room for more</Eyebrow>
          <Heading>Create your account</Heading>
          <BodyText>
            A clearer money routine starts with one small, kind-to-yourself step.
          </BodyText>
          <Field
            autoCapitalize="none"
            label="Username"
            maxLength={16}
            onChangeText={setUsername}
            placeholder="Choose a username"
            value={username}
          />
          {username.trim().length >= 3 ? (
            <Text
              style={{
                color: usernameAvailability?.available ? colors.green : colors.subtle,
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              {usernameAvailability === undefined
                ? "Checking username..."
                : usernameAvailability.available
                  ? "Username is available"
                  : usernameAvailability.reason}
            </Text>
          ) : null}
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
            autoComplete="new-password"
            label="Password"
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry
            value={password}
          />
          {password.length > 0 ? (
            <View style={{ gap: 5 }}>
              {["8+ characters", "uppercase letter", "number", "special character"].map(
                (rule, index) => (
                  <Text
                    key={rule}
                    style={{
                      color: passwordRules[index](password) ? colors.green : colors.subtle,
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    {passwordRules[index](password) ? "✓" : "○"} {rule}
                  </Text>
                ),
              )}
            </View>
          ) : null}
          <Field
            autoComplete="new-password"
            label="Confirm password"
            onChangeText={setConfirmPassword}
            placeholder="Re-enter your password"
            secureTextEntry
            value={confirmPassword}
          />
          <ErrorMessage>{error}</ErrorMessage>
          <ActionButton
            disabled={
              loading ||
              !email.trim() ||
              !username.trim() ||
              !usernameAvailability?.available ||
              !password ||
              !confirmPassword
            }
            label={loading ? "Creating account..." : "Create account"}
            onPress={() => void submit()}
          />
          <View style={{ alignItems: "center", gap: 8 }}>
            <Text style={{ color: colors.muted, fontSize: 13 }}>
              Already have an account?
            </Text>
            <Link href="/auth/sign-in" style={{ color: colors.coral, fontWeight: "900" }}>
              Sign in
            </Link>
          </View>
        </Card>
      </KeyboardAvoidingView>
    </Screen>
  );
}
