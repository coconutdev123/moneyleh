import { useMutation } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { api } from "@web_backend/convex/_generated/api";
import AppHeader from "@/components/app-header";
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
  SectionTitle,
} from "@/components/ui";
import { expenseFormatter, todayString } from "@/lib/format";

const categories = [
  "Groceries",
  "Dining",
  "Transport",
  "Bills",
  "Shopping",
  "Health",
  "Others",
  "Rent",
];
const paymentMethods = ["Card", "Cash", "FPS", "Octopus"];

export default function ExpenseScreen() {
  const createExpense = useMutation(api.expense.createExpense);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [date, setDate] = useState(todayString());
  const [merchant, setMerchant] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [notes, setNotes] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    const amountValue = Number(amount);
    if (
      !title.trim() ||
      !merchant.trim() ||
      !date.trim() ||
      !Number.isFinite(amountValue) ||
      amountValue <= 0
    ) {
      setError("Add an expense title, positive amount, merchant, and date.");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError("Use a date in YYYY-MM-DD format.");
      return;
    }

    setLoading(true);
    try {
      await createExpense({
        title: title.trim(),
        amount: amountValue,
        category,
        date,
        merchant: merchant.trim(),
        paymentMethod,
        notes: notes.trim() || undefined,
        recurring,
      });
      router.replace("/(tabs)/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while saving your expense.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <AppHeader />
      <View style={{ gap: 8 }}>
        <Eyebrow>Track a purchase</Eyebrow>
        <Heading>Add expense</Heading>
        <BodyText>Keep your budget honest with a little detail.</BodyText>
      </View>
      <Card style={{ gap: 18 }}>
        <Field
          label="Expense title"
          onChangeText={setTitle}
          placeholder="Groceries, rent, coffee, etc."
          value={title}
        />
        <Field
          keyboardType="decimal-pad"
          label="Amount · HKD"
          onChangeText={setAmount}
          placeholder="0.00"
          value={amount}
        />
        <View style={{ gap: 8 }}>
          <Text style={{ color: "#627069", fontSize: 12, fontWeight: "800" }}>Category</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {categories.map((item) => (
              <Choice
                key={item}
                label={item}
                selected={category === item}
                onPress={() => setCategory(item)}
              />
            ))}
          </View>
        </View>
        <Field
          autoCapitalize="none"
          label="Date · YYYY-MM-DD"
          onChangeText={setDate}
          placeholder="2026-01-31"
          value={date}
        />
        <Field
          label="Merchant"
          onChangeText={setMerchant}
          placeholder="Where was it?"
          value={merchant}
        />
        <View style={{ gap: 8 }}>
          <Text style={{ color: "#627069", fontSize: 12, fontWeight: "800" }}>Payment method</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {paymentMethods.map((item) => (
              <Choice
                key={item}
                label={item}
                selected={paymentMethod === item}
                onPress={() => setPaymentMethod(item)}
              />
            ))}
          </View>
        </View>
        <Field
          label="Notes"
          multiline
          numberOfLines={4}
          onChangeText={setNotes}
          placeholder="Optional details, mood, or context"
          textAlignVertical="top"
          value={notes}
        />
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: recurring }}
          onPress={() => setRecurring((current) => !current)}
          style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 4 }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: recurring ? colors.coral : colors.line,
              backgroundColor: recurring ? colors.coral : colors.white,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {recurring ? <Text style={{ color: colors.white, fontWeight: "900" }}>✓</Text> : null}
          </View>
          <Text style={{ color: colors.muted, fontSize: 13, fontWeight: "800" }}>
            Recurring expense
          </Text>
        </Pressable>
        <ErrorMessage>{error}</ErrorMessage>
        <ActionButton
          disabled={loading}
          label={loading ? "Saving..." : "Add expense"}
          onPress={() => void submit()}
        />
      </Card>
      <Card style={{ gap: 12, backgroundColor: colors.ink }}>
        <SectionTitle title="Expense preview" detail="Estimated impact" />
        <Heading style={{ color: colors.white }}>
          {Number.isFinite(Number(amount)) && Number(amount) > 0
            ? expenseFormatter.format(Number(amount))
            : expenseFormatter.format(0)}
        </Heading>
        <BodyText style={{ color: "#dfe7df" }}>
          {title || "New expense"} · {category}
        </BodyText>
        <Text style={{ color: "#b7c6bc", fontSize: 13 }}>
          {date || "Not set"} · {merchant || "Merchant not set"}
        </Text>
        <Text style={{ color: "#b7c6bc", fontSize: 13 }}>
          {recurring ? "Recurring" : "One-time"} · {paymentMethod}
        </Text>
      </Card>
    </Screen>
  );
}

function Choice({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderWidth: 1,
        borderColor: selected ? colors.coral : colors.line,
        borderRadius: 999,
        backgroundColor: selected ? colors.paleCoral : colors.white,
      }}
    >
      <Text style={{ color: selected ? "#bf624f" : colors.muted, fontSize: 12, fontWeight: "800" }}>
        {label}
      </Text>
    </Pressable>
  );
}
