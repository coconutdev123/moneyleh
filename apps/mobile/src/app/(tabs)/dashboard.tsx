import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { api } from "@web_backend/convex/_generated/api";
import AppHeader from "@/components/app-header";
import {
  ActionButton,
  BodyText,
  Card,
  colors,
  EmptyState,
  Eyebrow,
  Heading,
  ProgressBar,
  Screen,
  SectionTitle,
} from "@/components/ui";
import { expenseFormatter, savingsFormatter } from "@/lib/format";

function isInCurrentMonth(value: string, year: number, month: number) {
  const date = new Date(value);
  return (
    Number.isFinite(date.getTime()) &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month
  );
}

function formatActivityDate(timestamp: number) {
  const date = new Date(timestamp);
  const today = new Date();
  const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const activityStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const daysAgo = Math.round((dayStart - activityStart) / 86_400_000);
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function DashboardScreen() {
  const profile = useQuery(api.profile.getProfile);
  const expenses = useQuery(api.expense.getExpenses);
  const wishlists = useQuery(api.wishlist.getWishlists);
  const now = new Date();
  const monthlyExpenses = (expenses ?? []).filter((expense) =>
    isInCurrentMonth(expense.date, now.getUTCFullYear(), now.getUTCMonth()),
  );
  const monthlySavings = (wishlists ?? [])
    .flatMap((wishlist) => wishlist.savings)
    .filter((saving) =>
      isInCurrentMonth(saving.savedAt, now.getUTCFullYear(), now.getUTCMonth()),
    );
  const spent = monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);
  const saved = monthlySavings.reduce((total, saving) => total + saving.amount, 0);
  const income = profile?.monthlyIncome;
  const available = income === undefined ? undefined : income - spent - saved;
  const usedPercent =
    income && income > 0 ? Math.min(100, Math.round(((spent + saved) / income) * 100)) : 0;
  const loading = profile === undefined || expenses === undefined || wishlists === undefined;
  const weeklySpend = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const dateKey = date.toISOString().slice(0, 10);
    return {
      label: date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1),
      amount: (expenses ?? [])
        .filter((expense) => expense.date === dateKey)
        .reduce((total, expense) => total + expense.amount, 0),
    };
  });
  const maxDailySpend = Math.max(0, ...weeklySpend.map((day) => day.amount));
  const weeklyTotal = weeklySpend.reduce((total, day) => total + day.amount, 0);
  const categoryTotals = new Map<string, number>();
  monthlyExpenses.forEach((expense) =>
    categoryTotals.set(
      expense.category,
      (categoryTotals.get(expense.category) ?? 0) + expense.amount,
    ),
  );
  const categories = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topCategory = categories[0];
  const activities = [
    ...(expenses ?? []).map((expense) => ({
      id: `expense-${expense._id}`,
      title: expense.title || expense.merchant,
      detail: `${expense.category} · ${expense.date}`,
      timestamp: Date.parse(`${expense.date}T00:00:00`),
      amount: `−${expenseFormatter.format(expense.amount)}`,
      positive: false,
    })),
    ...(wishlists ?? []).flatMap((wishlist) =>
      wishlist.savings.map((saving) => ({
        id: `saving-${saving._id}`,
        title: `Saved for ${wishlist.title}`,
        detail: `Savings · ${saving.savedAt.slice(0, 10)}`,
        timestamp: Date.parse(saving.savedAt),
        amount: `+${savingsFormatter.format(saving.amount)}`,
        positive: true,
      })),
    ),
    ...(profile?.monthlyIncome !== undefined && profile.monthlyIncomeUpdatedAt !== undefined
      ? [
          {
            id: `income-${profile.monthlyIncomeUpdatedAt}`,
            title: "Monthly income updated",
            detail: "Income",
            timestamp: profile.monthlyIncomeUpdatedAt,
            amount: `+${expenseFormatter.format(profile.monthlyIncome)}`,
            positive: true,
          },
        ]
      : []),
  ]
    .filter((activity) => Number.isFinite(activity.timestamp))
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 6);
  const greeting =
    now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <Screen>
      <AppHeader />
      <View style={{ gap: 8 }}>
        <Eyebrow>
          {now.toLocaleDateString("en-US", { dateStyle: "full" })}
        </Eyebrow>
        <Heading>
          {greeting} @{profile?.username || "Stranger"}.
        </Heading>
        <BodyText>Here’s the gentle version of your money story this month.</BodyText>
        <ActionButton
          label="＋  Add expense"
          onPress={() => router.push("/(tabs)/expense")}
        />
      </View>

      {profile && income === undefined ? (
        <Card style={{ backgroundColor: colors.paleYellow, gap: 6 }}>
          <Text style={{ color: "#6e5e32", fontSize: 14, fontWeight: "800" }}>
            Add your monthly income to see how much you have available to spend.
          </Text>
          <Text style={{ color: "#806b32", fontSize: 12 }}>
            You can enter it manually in your account information.
          </Text>
        </Card>
      ) : null}

      <View style={{ gap: 12 }}>
        {[
          {
            label: "Available to spend",
            value: loading ? "..." : available === undefined ? "Set income" : expenseFormatter.format(available),
            note: available === undefined ? "Add monthly income in account info" : "After expenses and savings",
            tone: colors.paleGreen,
          },
          {
            label: "Spent this month",
            value: loading ? "..." : expenseFormatter.format(spent),
            note: `${monthlyExpenses.length} ${monthlyExpenses.length === 1 ? "expense" : "expenses"} this month`,
            tone: colors.paleCoral,
          },
          {
            label: "Saved this month",
            value: loading ? "..." : savingsFormatter.format(saved),
            note: `${monthlySavings.length} ${monthlySavings.length === 1 ? "contribution" : "contributions"} this month`,
            tone: colors.paleYellow,
          },
        ].map((item) => (
          <Card key={item.label} style={{ gap: 12, backgroundColor: item.tone }}>
            <Text style={{ color: colors.muted, fontSize: 13, fontWeight: "800" }}>
              {item.label}
            </Text>
            <Text style={{ color: colors.ink, fontSize: 26, fontWeight: "900", letterSpacing: -1 }}>
              {item.value}
            </Text>
            <Text style={{ color: colors.subtle, fontSize: 12, fontWeight: "700" }}>
              {item.note}
            </Text>
          </Card>
        ))}
      </View>

      <Card style={{ backgroundColor: colors.ink, gap: 15 }}>
        <Text style={{ color: "#b7c6bc", fontSize: 14, fontWeight: "800" }}>
          Monthly income
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
          <Text style={{ color: colors.white, fontSize: 24, fontWeight: "900" }}>
            {loading ? "..." : income === undefined ? "Not set" : expenseFormatter.format(income)}
          </Text>
          {income === undefined ? null : (
            <Text style={{ color: colors.yellow, fontWeight: "900" }}>{usedPercent}% used</Text>
          )}
        </View>
        <ProgressBar percent={usedPercent} color={colors.yellow} />
        <Text style={{ color: "#dfe7df", fontSize: 12, lineHeight: 18 }}>
          {available === undefined
            ? "Set income in account info to track your budget"
            : `${expenseFormatter.format(available)} available after spending and savings`}
        </Text>
      </Card>

      <Card>
        <SectionTitle title="Spending overview" detail="Your daily spending over the past week" />
        <View style={{ height: 150, flexDirection: "row", alignItems: "flex-end", gap: 8 }}>
          {weeklySpend.map((day, index) => {
            const height = maxDailySpend > 0 ? Math.max(8, (day.amount / maxDailySpend) * 100) : 0;
            return (
              <View
                key={`${day.label}-${index}`}
                style={{ flex: 1, height: "100%", alignItems: "center", justifyContent: "flex-end", gap: 8 }}
              >
                <View
                  style={{
                    width: "72%",
                    height,
                    borderTopLeftRadius: 9,
                    borderTopRightRadius: 9,
                    backgroundColor: index === 6 ? colors.coral : colors.blue,
                  }}
                />
                <Text style={{ color: "#9aaa9f", fontSize: 11, fontWeight: "900" }}>
                  {day.label}
                </Text>
              </View>
            );
          })}
        </View>
        <Text style={{ marginTop: 12, color: colors.green, fontSize: 12, fontWeight: "800" }}>
          {weeklyTotal === 0
            ? "No expenses recorded in the past 7 days"
            : `${expenseFormatter.format(weeklyTotal)} spent in the past 7 days`}
        </Text>
      </Card>

      <Card>
        <SectionTitle title="Where it goes" detail="This month · HKD" />
        {expenses === undefined ? (
          <EmptyState>Loading expense categories...</EmptyState>
        ) : categories.length === 0 ? (
          <EmptyState>No expenses recorded this month.</EmptyState>
        ) : (
          <View style={{ gap: 16 }}>
            {categories.map(([label, amount], index) => (
              <View key={label} style={{ gap: 7 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ color: colors.ink, fontSize: 14, fontWeight: "800" }}>
                    {label}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: 13, fontWeight: "800" }}>
                    {expenseFormatter.format(amount)}
                  </Text>
                </View>
                <ProgressBar
                  percent={spent > 0 ? (amount / spent) * 100 : 0}
                  color={[colors.coral, colors.mint, colors.blue, colors.yellow, "#c3b3e5"][index % 5]}
                />
              </View>
            ))}
          </View>
        )}
      </Card>

      <Card>
        <SectionTitle title="Recent activity" />
        {loading ? (
          <EmptyState>Loading recent activity...</EmptyState>
        ) : activities.length === 0 ? (
          <EmptyState>No recent expenses, savings, or income changes.</EmptyState>
        ) : (
          <View style={{ gap: 10 }}>
            {activities.map((activity) => (
              <View
                key={activity.id}
                style={{
                  padding: 12,
                  borderRadius: 15,
                  backgroundColor: "#fdfcf8",
                  borderWidth: 1,
                  borderColor: "#edf0ea",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: activity.positive ? colors.paleGreen : colors.paleCoral,
                  }}
                >
                  <Text style={{ color: activity.positive ? colors.green : colors.coral, fontWeight: "900" }}>
                    {activity.positive ? "↓" : "↑"}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ color: colors.ink, fontSize: 13, fontWeight: "800" }}>
                    {activity.title}
                  </Text>
                  <Text style={{ color: colors.subtle, fontSize: 11, marginTop: 3 }}>
                    {activity.detail} · {formatActivityDate(activity.timestamp)}
                  </Text>
                </View>
                <Text
                  style={{
                    color: activity.positive ? colors.green : colors.ink,
                    fontSize: 12,
                    fontWeight: "900",
                  }}
                >
                  {activity.amount}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      <Card style={{ backgroundColor: colors.paleYellow, gap: 12 }}>
        <Eyebrow>Spending insight</Eyebrow>
        <SectionTitle title="Top category this month" />
        {topCategory ? (
          <>
            <Heading>{topCategory[0]}</Heading>
            <Text style={{ color: "#806b32", fontSize: 19, fontWeight: "900" }}>
              {expenseFormatter.format(topCategory[1])}
            </Text>
            <ProgressBar
              percent={spent > 0 ? (topCategory[1] / spent) * 100 : 0}
              color={colors.coral}
            />
            <BodyText>
              {spent > 0 ? Math.round((topCategory[1] / spent) * 100) : 0}% of this month’s
              spending across {monthlyExpenses.length}{" "}
              {monthlyExpenses.length === 1 ? "expense" : "expenses"}.
            </BodyText>
          </>
        ) : (
          <>
            <BodyText>
              Add an expense to see which category takes the biggest share of your spending this month.
            </BodyText>
            <Pressable onPress={() => router.push("/(tabs)/expense")}>
              <Text style={{ color: colors.green, fontWeight: "900" }}>Add your first expense →</Text>
            </Pressable>
          </>
        )}
      </Card>
    </Screen>
  );
}
