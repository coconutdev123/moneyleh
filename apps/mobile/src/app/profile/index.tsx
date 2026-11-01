import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { api } from "@web_backend/convex/_generated/api";
import AppHeader from "@/components/app-header";
import {
  ActionButton,
  BodyText,
  Card,
  colors,
  Eyebrow,
  Heading,
  Screen,
  SectionTitle,
} from "@/components/ui";

const initialPreferences = [
  { label: "Weekly money check-in", detail: "A gentle summary every Sunday", enabled: true },
  { label: "Budget nudges", detail: "Let me know when you're close to a limit", enabled: true },
  { label: "Product updates", detail: "Occasional notes about new features", enabled: false },
];

export default function ProfileScreen() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const profile = useQuery(
    api.profile.getProfile,
    isAuthenticated ? {} : "skip",
  );
  const ensureProfile = useMutation(api.profile.ensureProfile);
  const deleteAccount = useMutation(api.profile.deleteAccount);
  const { signOut } = useAuthActions();
  const router = useRouter();
  const [preferences, setPreferences] = useState(initialPreferences);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (profile === null) void ensureProfile();
  }, [ensureProfile, profile]);

  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect href="/auth/sign-in" />;

  const username = profile?.username.trim() ?? "";
  const displayName = username || "Your profile";
  const displayEmail = profile?.email.trim() || "No email added yet";

  const confirmDelete = () => {
    Alert.alert(
      "Delete your account?",
      "This permanently erases your profile, expenses, wishlist, savings, and sign-in credentials. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete account",
          style: "destructive",
          onPress: () => void performDelete(),
        },
      ],
    );
  };

  const performSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      Alert.alert(
        "Couldn't sign out",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };

  const performDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      await signOut();
      router.replace("/");
    } catch (error) {
      setIsDeleting(false);
      Alert.alert(
        "Couldn't delete your account",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };

  return (
    <Screen>
      <AppHeader />
      <ActionButton
        label="Return to dashboard"
        onPress={() => router.replace("/(tabs)/dashboard")}
        secondary
      />
      <View style={styles.intro}>
        <Eyebrow>Your moneyleh ~~~</Eyebrow>
        <Heading>Profile & preferences</Heading>
        <BodyText>
          Keep your details cur
          rent and shape the way your money check-ins feel.
        </BodyText>
      </View>

      <Card>
        <View style={styles.identity}>
          <View style={styles.avatar}>
            {profile?.pfp ? (
              <Image source={{ uri: profile.pfp }} style={styles.avatarPhoto} />
            ) : (
              <Text style={styles.avatarText}>
                {username ? username.slice(0, 2).toUpperCase() : "U"}
              </Text>
            )}
          </View>
          <View style={styles.identityText}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.detail}>Thoughtful spender with moneyleh</Text>
          </View>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Email</Text>
          <Text style={styles.detailValue}>{displayEmail}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Username</Text>
          <Text style={styles.detailValue}>
            {username ? `@${username.toLowerCase()}` : "Add a username"}
          </Text>
        </View>
        <ActionButton
          label="Edit profile details"
          onPress={() => router.push("/profile/account-info")}
        />
      </Card>

      <Card style={styles.securityCard}>
        <Text style={styles.sectionHeading}>Your account is cozy</Text>
        <BodyText>
          Your profile and money data are protected with secure sign-in.
        </BodyText>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            Alert.alert(
              "Secure sign-in",
              "Your account uses secure sign-in. Password and connected-account management are not available in the mobile app yet.",
            )
          }
          style={styles.textAction}
        >
          <Text style={styles.textActionLabel}>Review security  ›</Text>
        </Pressable>
      </Card>

      <Card>
        <SectionTitle
          title="Preferences"
          detail="Choose what makes your dashboard useful."
        />
        {preferences.map((item, index) => (
          <View
            key={item.label}
            style={[styles.preference, index > 0 && styles.preferenceBorder]}
          >
            <View style={styles.preferenceIcon}>
              <Text style={styles.preferenceIconText}>♧</Text>
            </View>
            <View style={styles.preferenceCopy}>
              <Text style={styles.preferenceLabel}>{item.label}</Text>
              <Text style={styles.preferenceDetail}>{item.detail}</Text>
            </View>
            <Pressable
              accessibilityRole="switch"
              accessibilityLabel={`Toggle ${item.label}`}
              accessibilityState={{ checked: item.enabled }}
              onPress={() =>
                setPreferences((current) =>
                  current.map((preference) =>
                    preference.label === item.label
                      ? { ...preference, enabled: !preference.enabled }
                      : preference,
                  ),
                )
              }
              style={[
                styles.switch,
                item.enabled ? styles.switchOn : styles.switchOff,
              ]}
            >
              <View
                style={[
                  styles.switchThumb,
                  item.enabled ? styles.switchThumbOn : styles.switchThumbOff,
                ]}
              />
            </Pressable>
          </View>
        ))}
      </Card>

      <Card>
        <SectionTitle title="Account settings" />
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            Alert.alert(
              "Password & sign-in",
              "Password and connected-account management are not available in the mobile app yet.",
            )
          }
          style={styles.settingRow}
        >
          <View style={[styles.settingIcon, { backgroundColor: colors.blue }]}>
            <Text style={styles.settingIconText}>⌑</Text>
          </View>
          <View style={styles.preferenceCopy}>
            <Text style={styles.preferenceLabel}>Password & sign-in</Text>
            <Text style={styles.preferenceDetail}>
              Update your password or connected accounts
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            Alert.alert(
              "Connected accounts",
              "Financial account linking is not available in the mobile app yet.",
            )
          }
          style={styles.settingRow}
        >
          <View style={[styles.settingIcon, { backgroundColor: colors.yellow }]}>
            <Text style={styles.settingIconText}>$</Text>
          </View>
          <View style={styles.preferenceCopy}>
            <Text style={styles.preferenceLabel}>Connected accounts</Text>
            <Text style={styles.preferenceDetail}>
              Manage linked financial accounts
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      </Card>

      <Card style={styles.deleteCard}>
        <Text style={styles.deleteTitle}>Delete account</Text>
        <BodyText>
          Permanently erase your profile, expenses, wishlist, savings, and sign-in
          credentials.
        </BodyText>
        <Pressable
          accessibilityRole="button"
          disabled={isDeleting}
          onPress={confirmDelete}
          style={[styles.deleteButton, isDeleting && styles.deleteButtonDisabled]}
        >
          <Text style={styles.deleteButtonText}>
            {isDeleting ? "Deleting account..." : "Delete my account"}
          </Text>
        </Pressable>
      </Card>
      <ActionButton
        label="Sign out"
        onPress={() => void performSignOut()}
        disabled={isDeleting}
        secondary
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: 8, paddingTop: 16 },
  identity: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 18 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.yellow,
  },
  avatarPhoto: { width: "100%", height: "100%" },
  avatarText: { color: colors.ink, fontSize: 20, fontWeight: "900" },
  identityText: { flex: 1, gap: 4 },
  name: { color: colors.ink, fontSize: 20, fontWeight: "900" },
  detail: { color: colors.muted, fontSize: 13 },
  detailBox: {
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: colors.background,
  },
  detailLabel: {
    color: colors.subtle,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  detailValue: { marginTop: 4, color: colors.ink, fontSize: 14, fontWeight: "700" },
  securityCard: { backgroundColor: colors.paleGreen, gap: 8 },
  sectionHeading: { color: colors.ink, fontSize: 16, fontWeight: "900" },
  textAction: { alignSelf: "flex-start", paddingTop: 5 },
  textActionLabel: { color: colors.green, fontSize: 12, fontWeight: "900" },
  preference: { flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 14 },
  preferenceBorder: { borderTopWidth: 1, borderTopColor: "#edf0ea" },
  preferenceIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  preferenceIconText: { color: colors.coral, fontSize: 20, fontWeight: "900" },
  preferenceCopy: { flex: 1, gap: 3 },
  preferenceLabel: { color: colors.ink, fontSize: 13, fontWeight: "800" },
  preferenceDetail: { color: colors.subtle, fontSize: 11, lineHeight: 16 },
  switch: { width: 44, height: 25, borderRadius: 13, justifyContent: "center" },
  switchOn: { backgroundColor: colors.mint },
  switchOff: { backgroundColor: colors.line },
  switchThumb: { width: 17, height: 17, borderRadius: 9, backgroundColor: colors.white },
  switchThumbOn: { alignSelf: "flex-end", marginRight: 4 },
  switchThumbOff: { alignSelf: "flex-start", marginLeft: 4 },
  settingRow: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginTop: 8,
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#edf0ea",
    backgroundColor: "#fdfcf8",
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  settingIconText: { color: colors.ink, fontSize: 16, fontWeight: "900" },
  chevron: { color: "#9aaa9f", fontSize: 24 },
  deleteCard: { gap: 10, borderColor: "#efc9c0" },
  deleteTitle: { color: "#a94f40", fontSize: 17, fontWeight: "900" },
  deleteButton: {
    alignSelf: "flex-start",
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bf624f",
    backgroundColor: colors.paleCoral,
  },
  deleteButtonDisabled: { opacity: 0.6 },
  deleteButtonText: { color: "#a94f40", fontSize: 13, fontWeight: "800" },
});
