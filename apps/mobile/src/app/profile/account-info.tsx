import { useConvexAuth } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { Redirect, useRouter } from "expo-router";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { api } from "@web_backend/convex/_generated/api";
import { normalizeUsername, validateUsername } from "@shared/lib/username";
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

type ProfileForm = {
  username: string;
  email: string;
  gender: string;
  dob: string;
  monthlyIncome: string;
};

const genders = [
  { label: "Prefer not to say", value: "" },
  { label: "Female", value: "female" },
  { label: "Male", value: "male" },
  { label: "Non-binary", value: "non-binary" },
  { label: "Other", value: "other" },
];

export default function AccountInfoScreen() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const profile = useQuery(
    api.profile.getProfile,
    isAuthenticated ? {} : "skip",
  );
  const ensureProfile = useMutation(api.profile.ensureProfile);
  const updateProfile = useMutation(api.profile.update);
  const router = useRouter();
  const [formOverride, setFormOverride] = useState<ProfileForm | null>(null);
  const [photoOverride, setPhotoOverride] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPickingPhoto, setIsPickingPhoto] = useState(false);
  const [error, setError] = useState("");
  const [showSavedToast, setShowSavedToast] = useState(false);
  const initialForm: ProfileForm = profile
    ? {
        username: profile.username,
        email: profile.email,
        gender: profile.gender,
        dob: profile.dob,
        monthlyIncome: profile.monthlyIncome?.toString() ?? "",
      }
    : {
        username: "",
        email: "",
        gender: "",
        dob: "",
        monthlyIncome: "",
      };
  const form = formOverride ?? initialForm;
  const photo = photoOverride ?? profile?.pfp ?? "";

  useEffect(() => {
    if (profile === null) void ensureProfile();
  }, [ensureProfile, profile]);

  useEffect(() => {
    if (!showSavedToast) return;
    const timeout = setTimeout(() => setShowSavedToast(false), 3500);
    return () => clearTimeout(timeout);
  }, [showSavedToast]);

  const usernameError = form.username.trim()
    ? validateUsername(form.username)
    : "Username must be at least 3 characters";
  const usernameChanged =
    !!profile &&
    normalizeUsername(form.username) !== normalizeUsername(profile.username);
  const shouldCheckUsername = !!profile && usernameChanged && !usernameError;
  const usernameAvailability = useQuery(
    api.usernameFilter.isUsernameAvailable,
    shouldCheckUsername ? { username: form.username.trim() } : "skip",
  );
  const isUsernameAvailable =
    !usernameChanged || (!usernameError && usernameAvailability?.available === true);
  const usernameStatus = !profile
    ? ""
    : !usernameChanged
      ? "Using your current username"
      : usernameError
        ? usernameError
        : usernameAvailability === undefined
          ? "Checking username..."
          : usernameAvailability.available
            ? "Username is available"
            : usernameAvailability.reason;

  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect href="/auth/sign-in" />;

  const updateField = (field: keyof ProfileForm, value: string) => {
    setFormOverride((current) => ({ ...(current ?? initialForm), [field]: value }));
    setError("");
  };

  const choosePhoto = async () => {
    setIsPickingPhoto(true);
    setError("");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.86,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      const cropSize = Math.min(asset.width, asset.height);
      const processed = await ImageManipulator.manipulateAsync(
        asset.uri,
        [
          {
            crop: {
              originX: Math.round((asset.width - cropSize) / 2),
              originY: Math.round((asset.height - cropSize) / 2),
              width: cropSize,
              height: cropSize,
            },
          },
          { resize: { width: 256, height: 256 } },
        ],
        {
          base64: true,
          compress: 0.86,
          format: ImageManipulator.SaveFormat.JPEG,
        },
      );
      if (!processed.base64) {
        throw new Error("The selected photo could not be prepared.");
      }
      setPhotoOverride(`data:image/jpeg;base64,${processed.base64}`);
    } catch (pickError) {
      Alert.alert(
        "Couldn't choose that photo",
        pickError instanceof Error ? pickError.message : "Please try another image.",
      );
    } finally {
      setIsPickingPhoto(false);
    }
  };

  const save = async () => {
    if (!profile) return;
    const monthlyIncome =
      form.monthlyIncome.trim() === "" ? undefined : Number(form.monthlyIncome);
    if (
      monthlyIncome !== undefined &&
      (!Number.isFinite(monthlyIncome) || monthlyIncome < 0)
    ) {
      setError("Monthly income must be zero or greater.");
      return;
    }
    if (usernameError) {
      setError(usernameError);
      return;
    }
    if (!isUsernameAvailable) {
      setError(
        usernameAvailability?.available === false
          ? usernameAvailability.reason
          : "Please wait for username availability to finish checking.",
      );
      return;
    }
    if (form.dob && !/^\d{4}-\d{2}-\d{2}$/.test(form.dob)) {
      setError("Enter your date of birth as YYYY-MM-DD.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await updateProfile({
        id: profile._id,
        updates: {
          username: form.username.trim(),
          email: form.email.trim(),
          gender: form.gender,
          dob: form.dob.trim(),
          pfp: photo,
          ...(monthlyIncome === undefined ? {} : { monthlyIncome }),
        },
      });
      setShowSavedToast(true);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "We couldn't save your details. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const loading = profile === undefined || profile === null;

  return (
    <Screen>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text style={styles.backLabel}>‹  Back to profile</Text>
      </Pressable>
      <Card style={styles.formCard}>
        <View style={styles.intro}>
          <Eyebrow>Your details</Eyebrow>
          <Heading>Account information</Heading>
          <BodyText>
            Keep your profile details updated so your moneyleh experience feels
            fresh.
          </BodyText>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.coral} />
        ) : (
          <>
            <View style={styles.fieldGroup}>
              <Field
                label="Username"
                value={form.username}
                onChangeText={(value) => updateField("username", value)}
                editable={!isSaving && !isPickingPhoto}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={16}
                placeholder="Jamie Davis"
              />
              <Text
                style={[
                  styles.status,
                  usernameError || usernameAvailability?.available === false
                    ? styles.statusError
                    : isUsernameAvailable
                      ? styles.statusSuccess
                      : null,
                ]}
              >
                {usernameStatus}
              </Text>
            </View>
            <Field
              label="Email address"
              value={form.email}
              onChangeText={(value) => updateField("email", value)}
              editable={!isSaving && !isPickingPhoto}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              placeholder="you@example.com"
            />
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.options}>
                {genders.map((gender) => {
                  const selected = form.gender === gender.value;
                  return (
                    <Pressable
                      key={gender.value || "unspecified"}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: selected }}
                      disabled={isSaving || isPickingPhoto}
                      onPress={() => updateField("gender", gender.value)}
                      style={[
                        styles.option,
                        selected && styles.optionSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selected && styles.optionTextSelected,
                        ]}
                      >
                        {gender.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <Field
              label="Date of birth"
              value={form.dob}
              onChangeText={(value) => updateField("dob", value)}
              editable={!isSaving && !isPickingPhoto}
              placeholder="YYYY-MM-DD"
              maxLength={10}
              keyboardType="numbers-and-punctuation"
            />
            <Field
              label="Monthly income"
              value={form.monthlyIncome}
              onChangeText={(value) => updateField("monthlyIncome", value)}
              editable={!isSaving && !isPickingPhoto}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />

            <View style={styles.photoSection}>
              <Text style={styles.label}>Profile picture</Text>
              <View style={styles.photoRow}>
                <View style={styles.photoPreview}>
                  {photo ? (
                    <Image source={{ uri: photo }} style={styles.photo} />
                  ) : (
                    <Text style={styles.photoPlaceholder}>No photo yet</Text>
                  )}
                </View>
                <View style={styles.photoActions}>
                  <Text style={styles.photoTitle}>Make it yours</Text>
                  <Text style={styles.photoHelp}>
                    Choose a photo and crop it to a square for your profile.
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    disabled={isSaving || isPickingPhoto}
                    onPress={() => void choosePhoto()}
                    style={styles.photoButton}
                  >
                    <Text style={styles.photoButtonText}>
                      {isPickingPhoto ? "Preparing..." : "Choose photo"}
                    </Text>
                  </Pressable>
                  {photo ? (
                    <Pressable
                      accessibilityRole="button"
                      disabled={isSaving || isPickingPhoto}
                      onPress={() => setPhotoOverride("")}
                      style={styles.removePhoto}
                    >
                      <Text style={styles.removePhotoText}>Delete photo</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            </View>

            <ErrorMessage>{error}</ErrorMessage>
            <View style={styles.actions}>
              <ActionButton
                label="Cancel"
                secondary
                disabled={isSaving || isPickingPhoto}
                onPress={() => router.back()}
              />
              <ActionButton
                label={isSaving ? "Saving..." : "Save changes"}
                disabled={
                  isSaving ||
                  isPickingPhoto ||
                  !isUsernameAvailable ||
                  !!usernameError
                }
                onPress={() => void save()}
              />
            </View>
            {showSavedToast ? (
              <View
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
                style={styles.savedToast}
              >
                <Text style={styles.savedToastCheck}>✓</Text>
                <Text style={styles.savedToastText}>
                  Your account details are saved.
                </Text>
              </View>
            ) : null}
          </>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: { alignSelf: "flex-start", paddingVertical: 8 },
  backLabel: { color: colors.green, fontSize: 14, fontWeight: "800" },
  formCard: { gap: 18 },
  intro: { gap: 9, marginBottom: 3 },
  fieldGroup: { gap: 7 },
  label: { color: "#627069", fontSize: 12, fontWeight: "800" },
  status: { minHeight: 16, color: colors.subtle, fontSize: 11, fontWeight: "700" },
  statusSuccess: { color: colors.green },
  statusError: { color: "#bf624f" },
  options: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: {
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.background,
  },
  optionSelected: { borderColor: colors.mint, backgroundColor: colors.paleGreen },
  optionText: { color: colors.muted, fontSize: 12, fontWeight: "700" },
  optionTextSelected: { color: colors.green },
  photoSection: { gap: 8 },
  photoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.background,
  },
  photoPreview: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: colors.paleYellow,
  },
  photo: { width: "100%", height: "100%" },
  photoPlaceholder: { color: "#806b32", fontSize: 11, fontWeight: "800" },
  photoActions: { flex: 1, gap: 8 },
  photoTitle: { color: colors.ink, fontSize: 13, fontWeight: "800" },
  photoHelp: { color: colors.subtle, fontSize: 11, lineHeight: 16 },
  photoButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 11,
    backgroundColor: colors.mint,
  },
  photoButtonText: { color: colors.ink, fontSize: 11, fontWeight: "900" },
  removePhoto: { alignSelf: "flex-start", paddingVertical: 3 },
  removePhotoText: { color: "#bf624f", fontSize: 11, fontWeight: "800" },
  actions: { gap: 10, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#edf0ea" },
  savedToast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#c5e5d5",
    backgroundColor: colors.paleGreen,
  },
  savedToastCheck: { color: colors.green, fontSize: 17, fontWeight: "900" },
  savedToastText: { color: colors.green, fontSize: 13, fontWeight: "800" },
});
