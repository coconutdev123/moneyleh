import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";
import { api } from "@web_backend/convex/_generated/api";
import type { Id } from "@web_backend/convex/_generated/dataModel";
import AppHeader from "@/components/app-header";
import {
  ActionButton,
  BodyText,
  Card,
  colors,
  EmptyState,
  ErrorMessage,
  Eyebrow,
  Field,
  Heading,
  ProgressBar,
  Screen,
  SectionTitle,
} from "@/components/ui";
import { savingsFormatter } from "@/lib/format";

type WishlistId = Id<"wishlist">;

export default function WishlistScreen() {
  const wishlists = useQuery(api.wishlist.getWishlists);
  const createWishlist = useMutation(api.wishlist.createWishlist);
  const addSavings = useMutation(api.wishlist.addSavings);
  const reorderWishlists = useMutation(api.wishlist.reorderWishlists);
  const removeWishlist = useMutation(api.wishlist.removeWishlist);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [projectedDate, setProjectedDate] = useState("");
  const [link, setLink] = useState("");
  const [savingsInputs, setSavingsInputs] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<WishlistId | null>(null);
  const [error, setError] = useState("");
  const today = new Date();

  const addWishlist = async () => {
    setError("");
    const target = Number(price);
    let parsedLink: URL;
    try {
      parsedLink = new URL(link.trim());
    } catch {
      setError("Paste a valid product link, including https://.");
      return;
    }
    if (!["http:", "https:"].includes(parsedLink.protocol)) {
      setError("Use a product link that starts with https://.");
      return;
    }
    if (!title.trim() || !item.trim() || !projectedDate || !Number.isFinite(target) || target <= 0) {
      setError("Add a name, item, target amount, and end date first.");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(projectedDate)) {
      setError("Use a date in YYYY-MM-DD format.");
      return;
    }

    try {
      await createWishlist({
        title: title.trim(),
        item: item.trim(),
        price: target,
        projectedDate,
        link: parsedLink.toString(),
      });
      setTitle("");
      setItem("");
      setPrice("");
      setProjectedDate("");
      setLink("");
      setIsAdding(false);
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "We couldn't add this wishlist. Please try again.",
      );
    }
  };

  const addContribution = async (id: WishlistId) => {
    const amount = Number(savingsInputs[id] ?? "");
    if (!Number.isFinite(amount) || amount <= 0) {
      Alert.alert("Check amount", "Enter a savings amount greater than zero.");
      return;
    }

    setSavingId(id);
    try {
      await addSavings({ wishlistId: id, amount, savedAt: new Date().toISOString() });
      setSavingsInputs((current) => ({ ...current, [id]: "" }));
    } catch (saveError) {
      Alert.alert(
        "Couldn't add savings",
        saveError instanceof Error ? saveError.message : "Please try again.",
      );
    } finally {
      setSavingId(null);
    }
  };

  const reorder = async (id: WishlistId, direction: -1 | 1) => {
    if (!wishlists) return;
    const from = wishlists.findIndex((wishlist) => wishlist._id === id);
    const to = from + direction;
    if (from < 0 || to < 0 || to >= wishlists.length) return;
    const ordered = [...wishlists];
    const [moved] = ordered.splice(from, 1);
    ordered.splice(to, 0, moved);
    try {
      await reorderWishlists({ orderedIds: ordered.map((wishlist) => wishlist._id) });
    } catch (reorderError) {
      Alert.alert(
        "Couldn't change priority",
        reorderError instanceof Error ? reorderError.message : "Please try again.",
      );
    }
  };

  const confirmDelete = (id: WishlistId, name: string) => {
    Alert.alert("Remove wishlist?", `“${name}” and its savings history will be deleted.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          void removeWishlist({ id }).catch((removeError: unknown) => {
            Alert.alert(
              "Couldn't remove wishlist",
              removeError instanceof Error ? removeError.message : "Please try again.",
            );
          });
        },
      },
    ]);
  };

  const openLink = async (url?: string) => {
    if (!url) return;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Couldn't open link", "Check that the product link is valid.");
    }
  };

  return (
    <Screen>
      <AppHeader />
      <View style={{ gap: 8 }}>
        <Eyebrow>Save toward something lovely</Eyebrow>
        <Heading>Your wishlists</Heading>
        <BodyText>
          Keep your next purchases visible, give each one a finish line, and move your priority to the front.
        </BodyText>
        <ActionButton
          label={isAdding ? "Close form" : "＋  New wishlist"}
          onPress={() => {
            setIsAdding((current) => !current);
            setError("");
          }}
        />
      </View>

      {isAdding ? (
        <Card style={{ gap: 15 }}>
          <SectionTitle title="What are you saving for?" detail="New goal" />
          <Field label="Wishlist name" onChangeText={setTitle} placeholder="Travel fund" value={title} />
          <Field label="Item name" onChangeText={setItem} placeholder="What do you want?" value={item} />
          <Field
            keyboardType="decimal-pad"
            label="Target amount · USD"
            onChangeText={setPrice}
            placeholder="0.00"
            value={price}
          />
          <Field
            label="Target date · YYYY-MM-DD"
            onChangeText={setProjectedDate}
            placeholder="2026-12-31"
            value={projectedDate}
          />
          <Field
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            label="Product link"
            onChangeText={setLink}
            placeholder="https://"
            value={link}
          />
          <ErrorMessage>{error}</ErrorMessage>
          <ActionButton label="Save wishlist" onPress={() => void addWishlist()} />
        </Card>
      ) : null}

      {wishlists === undefined ? (
        <Card><EmptyState>Loading your wishlists...</EmptyState></Card>
      ) : wishlists.length === 0 ? (
        <Card style={{ alignItems: "center", gap: 12, paddingVertical: 34 }}>
          <Text style={{ color: colors.green, fontSize: 30 }}>✦</Text>
          <Heading style={{ fontSize: 22 }}>Nothing on the horizon yet</Heading>
          <BodyText>
            Add something you want, then turn small daily savings into a visible plan.
          </BodyText>
        </Card>
      ) : (
        <View style={{ gap: 14 }}>
          {wishlists.map((wishlist, index) => {
            const savedAmount = wishlist.savedAmount ?? 0;
            const percent =
              wishlist.price > 0
                ? Math.min(100, Math.round((savedAmount / wishlist.price) * 100))
                : 0;
            const remaining = Math.max(0, wishlist.price - savedAmount);
            const daysLeft = Math.max(
              0,
              Math.ceil(
                (new Date(`${wishlist.projectedDate}T23:59:59`).getTime() - today.getTime()) /
                  86_400_000,
              ),
            );
            return (
              <Card key={wishlist._id} style={{ gap: 15 }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                  <View style={{ flex: 1, gap: 5 }}>
                    <Eyebrow>Priority {index + 1}</Eyebrow>
                    <Heading style={{ fontSize: 21 }}>{wishlist.title}</Heading>
                    <BodyText>{wishlist.item}</BodyText>
                  </View>
                  <View style={{ flexDirection: "row", gap: 4 }}>
                    <SmallButton
                      label="↑"
                      disabled={index === 0}
                      onPress={() => void reorder(wishlist._id, -1)}
                      accessibilityLabel="Move wishlist up"
                    />
                    <SmallButton
                      label="↓"
                      disabled={index === wishlists.length - 1}
                      onPress={() => void reorder(wishlist._id, 1)}
                      accessibilityLabel="Move wishlist down"
                    />
                    <SmallButton
                      label="×"
                      onPress={() => confirmDelete(wishlist._id, wishlist.title)}
                      accessibilityLabel={`Delete ${wishlist.title}`}
                    />
                  </View>
                </View>

                <View
                  style={{
                    padding: 12,
                    borderRadius: 15,
                    backgroundColor: colors.background,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "800" }}>
                    ◷ {daysLeft} days left
                  </Text>
                  <Pressable
                    accessibilityRole="link"
                    disabled={!wishlist.link}
                    onPress={() => void openLink(wishlist.link)}
                  >
                    <Text style={{ color: colors.green, fontSize: 12, fontWeight: "900" }}>
                      View item ↗
                    </Text>
                  </Pressable>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                  <View>
                    <Text style={{ color: colors.subtle, fontSize: 12, fontWeight: "700" }}>
                      Saved so far
                    </Text>
                    <Text style={{ marginTop: 3, color: colors.ink, fontSize: 23, fontWeight: "900" }}>
                      {savingsFormatter.format(savedAmount)}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ color: colors.green, fontSize: 16, fontWeight: "900" }}>
                      {percent}%
                    </Text>
                    <Text style={{ color: colors.subtle, fontSize: 11 }}>
                      of {savingsFormatter.format(wishlist.price)}
                    </Text>
                  </View>
                </View>
                <ProgressBar percent={percent} />

                <View style={{ gap: 9, borderTopWidth: 1, borderTopColor: "#edf0ea", paddingTop: 13 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 6 }}>
                    <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "800" }}>
                      Add today’s savings
                    </Text>
                    <Text style={{ color: colors.subtle, fontSize: 11 }}>
                      {savingsFormatter.format(remaining)} left
                    </Text>
                  </View>
                  <Field
                    keyboardType="decimal-pad"
                    label=""
                    onChangeText={(value) =>
                      setSavingsInputs((current) => ({ ...current, [wishlist._id]: value }))
                    }
                    placeholder="How much did you save?"
                    value={savingsInputs[wishlist._id] ?? ""}
                  />
                  <ActionButton
                    disabled={savingId === wishlist._id}
                    label={savingId === wishlist._id ? "Saving..." : "Add savings"}
                    onPress={() => void addContribution(wishlist._id)}
                  />
                </View>

                {wishlist.savings.length > 0 ? (
                  <View style={{ gap: 8, padding: 12, borderRadius: 14, backgroundColor: colors.background }}>
                    <Text style={{ color: colors.subtle, fontSize: 11, fontWeight: "900" }}>
                      SAVINGS HISTORY
                    </Text>
                    {wishlist.savings.slice(0, 3).map((saving) => (
                      <View
                        key={saving._id}
                        style={{ flexDirection: "row", justifyContent: "space-between" }}
                      >
                        <Text style={{ color: colors.muted, fontSize: 12 }}>
                          {new Date(saving.savedAt).toLocaleDateString()}
                        </Text>
                        <Text style={{ color: colors.green, fontSize: 12, fontWeight: "800" }}>
                          +{savingsFormatter.format(saving.amount)}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </Card>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

function SmallButton({
  label,
  onPress,
  disabled = false,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      style={{
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: disabled ? "#f5f5f0" : colors.paleGreen,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Text style={{ color: colors.green, fontSize: 18, fontWeight: "900" }}>{label}</Text>
    </Pressable>
  );
}
