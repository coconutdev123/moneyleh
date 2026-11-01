import type { ReactNode } from "react";
import { Text, View, type TextStyle } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@web_backend/convex/_generated/api";
import AppHeader from "@/components/app-header";
import {
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
import {
  expenseFormatter,
  formatDate,
  formatMonth,
  savingsFormatter,
} from "@/lib/format";

const categoryColors = [colors.coral, colors.mint, colors.blue, colors.yellow, "#c3b3e5"];

export default function OverviewScreen() {
  const overview = useQuery(api.overview.getOverview);

  if (overview === undefined) {
    return (
      <Screen>
        <AppHeader />
        <BodyText>Loading your spending and savings overview...</BodyText>
      </Screen>
    );
  }

  const latestMonths = overview.monthlyTotals.slice(-6);
  const maxExpenseMonth = Math.max(0, ...latestMonths.map((month) => month.expenses));
  const maxSavingsMonth = Math.max(0, ...latestMonths.map((month) => month.savings));
  const maxCategoryAmount = Math.max(
    0,
    ...overview.categoryTotals.map((category) => category.amount),
  );
  const activities = [
    ...overview.expenses.map((expense) => ({
      id: `expense-${expense._id}`,
      title: expense.title || expense.merchant,
      detail: `${expense.category} · ${formatDate(expense.date)}`,
      date: expense.date,
      amount: `−${expenseFormatter.format(expense.amount)}`,
      positive: false,
    })),
    ...overview.savings.map((saving) => ({
      id: `saving-${saving._id}`,
      title: `Saved for ${saving.wishlistTitle}`,
      detail: formatDate(saving.savedAt),
      date: saving.savedAt,
      amount: `+${savingsFormatter.format(saving.amount)}`,
      positive: true,
    })),
  ]
    .sort((first, second) => second.date.localeCompare(first.date))
    .slice(0, 20);
  const reachedGoals = overview.wishlists.filter(
    (wishlist) =>
      wishlist.targetAmount > 0 && wishlist.savedAmount >= wishlist.targetAmount,
  ).length;

  return (
    <Screen>
      <AppHeader />
      <View>
        <Eyebrow>Your money, at a glance</Eyebrow>
        <Heading>Spending &amp; savings overview</Heading>
        <BodyText>
          A complete view of your recorded expenses and every contribution to your wishlist goals.
        </BodyText>
      </View>

      <View style={{ gap: 12 }}>
        <SummaryCard
          label="Total spending"
          value={expenseFormatter.format(overview.totals.expenseAmount)}
          detail={`${overview.totals.expenseCount} recorded expenses · HKD`}
          tone={colors.paleCoral}
        />
        <SummaryCard
          label="Total saved"
          value={savingsFormatter.format(overview.totals.savingsAmount)}
          detail={`${overview.totals.savingsCount} wishlist contributions · USD`}
          tone={colors.paleGreen}
        />
        <SummaryCard
          label="Wishlist goals"
          value={String(overview.wishlists.length)}
          detail={`${reachedGoals} goals reached`}
          tone={colors.paleYellow}
        />
        <SummaryCard
          label="Active months"
          value={String(overview.monthlyTotals.length)}
          detail="Months with recorded spending or savings"
          tone="#edf2fb"
        />
      </View>

      <Card>
        <SectionTitle
          title="Monthly activity"
          detail="Your six most recent months with recorded activity"
        />
        {latestMonths.length === 0 ? (
          <EmptyState>
            Your monthly activity will appear here once you add an expense or wishlist contribution.
          </EmptyState>
        ) : (
          <View style={{ gap: 18 }}>
            {latestMonths.map((month) => (
              <View key={month.month} style={{ gap: 6 }}>
                <TextLabel>{formatMonth(month.month)}</TextLabel>
                <BarRow
                  value={month.expenses}
                  maximum={maxExpenseMonth}
                  amount={expenseFormatter.format(month.expenses)}
                  color={colors.coral}
                />
                <BarRow
                  value={month.savings}
                  maximum={maxSavingsMonth}
                  amount={savingsFormatter.format(month.savings)}
                  color={colors.mint}
                />
              </View>
            ))}
          </View>
        )}
        <TextLabel style={{ marginTop: 16 }}>
          Spending and savings bars are scaled separately; the currencies differ.
        </TextLabel>
      </Card>

      <Card>
        <SectionTitle title="Spending by category" detail="All recorded expenses · HKD" />
        {overview.categoryTotals.length === 0 ? (
          <EmptyState>Expense categories will appear here after you record an expense.</EmptyState>
        ) : (
          <View style={{ gap: 18 }}>
            {overview.categoryTotals.map((category, index) => (
              <View key={category.category} style={{ gap: 7 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <TextLabel style={{ flex: 1, color: colors.ink, fontWeight: "800" }}>
                    {category.category}
                  </TextLabel>
                  <TextLabel style={{ color: colors.ink, fontWeight: "800" }}>
                    {expenseFormatter.format(category.amount)}
                  </TextLabel>
                </View>
                <TextLabel>
                  {category.count} {category.count === 1 ? "entry" : "entries"}
                </TextLabel>
                <ProgressBar
                  percent={maxCategoryAmount ? (category.amount / maxCategoryAmount) * 100 : 0}
                  color={categoryColors[index % categoryColors.length]}
                />
              </View>
            ))}
          </View>
        )}
      </Card>

      <Card>
        <SectionTitle title="Wishlist progress" detail="Saved amounts and targets · USD" />
        {overview.wishlists.length === 0 ? (
          <EmptyState>Create a wishlist goal to track your savings progress.</EmptyState>
        ) : (
          <View style={{ gap: 12 }}>
            {overview.wishlists.map((wishlist) => {
              const percent =
                wishlist.targetAmount > 0
                  ? Math.min(100, (wishlist.savedAmount / wishlist.targetAmount) * 100)
                  : 0;
              return (
                <View
                  key={wishlist._id}
                  style={{
                    gap: 9,
                    padding: 14,
                    borderRadius: 16,
                    borderColor: "#edf0ea",
                    borderWidth: 1,
                    backgroundColor: "#fdfcf8",
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                    <View style={{ flex: 1 }}>
                      <TextLabel style={{ color: colors.ink, fontWeight: "800" }}>
                        {wishlist.title}
                      </TextLabel>
                      <TextLabel>{wishlist.item}</TextLabel>
                    </View>
                    <TextLabel style={{ color: colors.green, fontWeight: "900" }}>
                      {Math.round(percent)}%
                    </TextLabel>
                  </View>
                  <ProgressBar percent={percent} />
                  <TextLabel>
                    {savingsFormatter.format(wishlist.savedAmount)} of{" "}
                    {savingsFormatter.format(wishlist.targetAmount)} · {wishlist.savingsCount}{" "}
                    {wishlist.savingsCount === 1 ? "contribution" : "contributions"}
                  </TextLabel>
                </View>
              );
            })}
          </View>
        )}
      </Card>

      <Card>
        <SectionTitle title="Recent activity" detail="Latest expenses and savings contributions" />
        {activities.length === 0 ? (
          <EmptyState>
            Your activity will appear here when you record an expense or add wishlist savings.
          </EmptyState>
        ) : (
          <View style={{ gap: 12 }}>
            {activities.map((activity) => (
              <View
                key={activity.id}
                style={{
                  paddingVertical: 9,
                  borderBottomWidth: 1,
                  borderBottomColor: "#edf0ea",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 9,
                }}
              >
                <TextLabel style={{ color: activity.positive ? colors.green : colors.coral }}>
                  {activity.positive ? "↓" : "↑"}
                </TextLabel>
                <View style={{ flex: 1 }}>
                  <TextLabel style={{ color: colors.ink, fontWeight: "800" }}>
                    {activity.title}
                  </TextLabel>
                  <TextLabel>{activity.detail}</TextLabel>
                </View>
                <TextLabel style={{ color: colors.ink, fontWeight: "900" }}>
                  {activity.amount}
                </TextLabel>
              </View>
            ))}
          </View>
        )}
      </Card>
    </Screen>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: string;
}) {
  return (
    <Card style={{ gap: 10, backgroundColor: tone }}>
      <TextLabel style={{ color: colors.muted, fontWeight: "800" }}>{label}</TextLabel>
      <Heading style={{ fontSize: 24 }}>{value}</Heading>
      <TextLabel>{detail}</TextLabel>
    </Card>
  );
}

function BarRow({
  value,
  maximum,
  amount,
  color,
}: {
  value: number;
  maximum: number;
  amount: string;
  color: string;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
      <View style={{ height: 9, flex: 1, overflow: "hidden", borderRadius: 8, backgroundColor: "#f5f2ed" }}>
        <View
          style={{
            height: "100%",
            width: `${maximum > 0 ? (value / maximum) * 100 : 0}%`,
            borderRadius: 8,
            backgroundColor: color,
          }}
        />
      </View>
      <TextLabel style={{ width: 92, textAlign: "right", color: colors.muted }}>
        {amount}
      </TextLabel>
    </View>
  );
}

function TextLabel({
  children,
  style,
}: {
  children: ReactNode;
  style?: TextStyle;
}) {
  return (
    <Text style={[{ color: colors.subtle, fontSize: 12, lineHeight: 18 }, style]}>
      {children}
    </Text>
  );
}
