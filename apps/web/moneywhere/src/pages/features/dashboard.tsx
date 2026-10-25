import { ArrowDownLeft, ArrowUpRight, CalendarDays, CircleHelp, Coffee, HeartPulse, Home, Plus, ShoppingBag, Target, TrendingUp, Utensils, Wallet } from "lucide-react";
import Header from "../../components/Header";
import { api } from "@web_backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

function formatMoney(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "HKD",
  });
}

function isInCurrentMonth(value: string, year: number, month: number) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.getUTCFullYear() === year && date.getUTCMonth() === month;
}

const categoryColors = ["bg-[#e88976]", "bg-[#9ed9c2]", "bg-[#a9c7f5]", "bg-[#f8d66d]", "bg-[#c3b3e5]"];
const categoryIcons: Record<string, LucideIcon> = {
  bills: Home,
  dining: Utensils,
  groceries: ShoppingBag,
  health: HeartPulse,
  home: Home,
  others: Wallet,
  shopping: ShoppingBag,
  transport: Coffee,
};

type DashboardActivity = {
  id: string;
  name: string;
  category: string;
  timestamp: number;
  amount: string;
  color: string;
  icon: LucideIcon;
  positive: boolean;
};

function formatActivityDate(timestamp: number) {
  const date = new Date(timestamp);
  const today = new Date();
  const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const activityDayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const daysAgo = Math.round((dayStart - activityDayStart) / 86_400_000);

  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-black tracking-[-0.04em] text-[#27352f]">{title}</h2>{action && <button type="button" className="text-xs font-bold text-[#e88976] transition-colors hover:text-[#bf624f]">{action}</button>}</div>;
}

export default function Dashboard() {
  const navigate = useNavigate();
    const profile = useQuery(api.profile.getProfile);
    const expenses = useQuery(api.expense.getExpenses);
    const wishlists = useQuery(api.wishlist.getWishlists);
    const name = profile?.username || "Stranger";
    const today_date = new Date();
    const currentYear = today_date.getUTCFullYear();
    const currentMonth = today_date.getUTCMonth();
    const currentMonthExpenses = expenses?.filter((expense) =>
      isInCurrentMonth(expense.date, currentYear, currentMonth),
    ) ?? [];
    const savingsThisMonth = wishlists?.flatMap((wishlist) => wishlist.savings)
      .filter((saving) => isInCurrentMonth(saving.savedAt, currentYear, currentMonth)) ?? [];
    const spentThisMonth = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
    const savedThisMonth = savingsThisMonth.reduce((total, saving) => total + saving.amount, 0);
    const monthlyIncome = profile?.monthlyIncome;
    const availableToSpend = monthlyIncome === undefined
      ? undefined
      : monthlyIncome - spentThisMonth - savedThisMonth;
    const budgetUsedPercent = monthlyIncome && monthlyIncome > 0
      ? Math.min(100, Math.round(((spentThisMonth + savedThisMonth) / monthlyIncome) * 100))
      : 0;
    const dashboardDataLoading = profile === undefined || expenses === undefined || wishlists === undefined;
    const summaryCards = [
      {
        label: "Available to spend",
        value: dashboardDataLoading ? "..." : availableToSpend === undefined ? "Set income" : formatMoney(availableToSpend),
        note: availableToSpend === undefined ? "Add monthly income in account info" : "Remaining budget after expenses and savings",
        tone: "bg-[#edf7ed]",
        icon: Wallet,
      },
      {
        label: "Spent this month",
        value: dashboardDataLoading ? "..." : formatMoney(spentThisMonth),
        note: `${currentMonthExpenses.length} ${currentMonthExpenses.length === 1 ? "expense" : "expenses"} this month`,
        tone: "bg-[#fff0ec]",
        icon: ArrowUpRight,
      },
      {
        label: "Saved this month",
        value: dashboardDataLoading ? "..." : formatMoney(savedThisMonth),
        note: `${savingsThisMonth.length} ${savingsThisMonth.length === 1 ? "contribution" : "contributions"} this month`,
        tone: "bg-[#fff8dd]",
        icon: Target,
      },
    ];
    const recentActivities: DashboardActivity[] = [
      ...(expenses ?? []).map((expense) => ({
        id: `expense-${expense._id}`,
        name: expense.title || expense.merchant,
        category: expense.category,
        timestamp: Date.parse(`${expense.date}T00:00:00`),
        amount: `-${formatMoney(expense.amount)}`,
        color: "bg-[#fff0ec]",
        icon: ArrowUpRight,
        positive: false,
      })),
      ...(wishlists ?? []).flatMap((wishlist) => wishlist.savings.map((saving) => ({
        id: `saving-${saving._id}`,
        name: `Saved for ${wishlist.title}`,
        category: "Savings",
        timestamp: Date.parse(saving.savedAt),
        amount: `+${formatMoney(saving.amount)}`,
        color: "bg-[#fff8dd]",
        icon: Target,
        positive: true,
      }))),
      ...(profile?.monthlyIncome !== undefined && profile.monthlyIncomeUpdatedAt !== undefined
        ? [{
            id: `income-${profile.monthlyIncomeUpdatedAt}`,
            name: "Monthly income updated",
            category: "Income",
            timestamp: profile.monthlyIncomeUpdatedAt,
            amount: `+${formatMoney(profile.monthlyIncome)}`,
            color: "bg-[#edf7ed]",
            icon: ArrowDownLeft,
            positive: true,
          }]
        : []),
    ]
      .filter((activity) => Number.isFinite(activity.timestamp))
      .sort((first, second) => second.timestamp - first.timestamp)
      .slice(0, 6);

    const millisecondsPerDay = 86_400_000;
    const todayUtc = Date.UTC(currentYear, currentMonth, today_date.getUTCDate());
    const firstDayOfWeek = todayUtc - 6 * millisecondsPerDay;
    const weeklySpend = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(firstDayOfWeek + index * millisecondsPerDay);
      const dateKey = day.toISOString().slice(0, 10);
      return {
        label: day.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }).slice(0, 1),
        amount: (expenses ?? []).reduce((total, expense) =>
          expense.date === dateKey ? total + expense.amount : total, 0),
      };
    });
    const maxDailySpend = Math.max(0, ...weeklySpend.map((day) => day.amount));
    const weeklySpendTotal = weeklySpend.reduce((total, day) => total + day.amount, 0);
    const weeklyInsight = weeklySpendTotal === 0
      ? "No expenses recorded in the past 7 days"
      : `${formatMoney(weeklySpendTotal)} spent in the past 7 days`;

    const categoryTotals = new Map<string, number>();
    for (const expense of currentMonthExpenses) {
      categoryTotals.set(expense.category, (categoryTotals.get(expense.category) ?? 0) + expense.amount);
    }
    const totalCategorySpend = [...categoryTotals.values()].reduce((total, amount) => total + amount, 0);
    const categories = [...categoryTotals.entries()]
      .sort((first, second) => second[1] - first[1])
      .slice(0, 5)
      .map(([label, amount], index) => ({
        label,
        amount: formatMoney(amount),
        percent: totalCategorySpend > 0 ? Math.round((amount / totalCategorySpend) * 100) : 0,
        color: categoryColors[index % categoryColors.length],
        icon: categoryIcons[label.trim().toLowerCase()] ?? Wallet,
      }));
    const topCategory = [...categoryTotals.entries()].sort((first, second) => second[1] - first[1])[0];
    const topCategoryShare = topCategory && spentThisMonth > 0
      ? Math.round((topCategory[1] / spentThisMonth) * 100)
      : 0;
    const TopCategoryIcon = topCategory
      ? categoryIcons[topCategory[0].trim().toLowerCase()] ?? Wallet
      : Target;

    function Greetings (){
        if(today_date.getHours() < 12){
            return "Good morning";
        }
        else if(today_date.getHours() < 18){
            return "Good afternoon";
        }
        else{
            return "Good evening";
        }
    }

    return (
        <main className="min-h-screen overflow-hidden bg-[#f8f6f0] px-4 py-5 text-[#27352f] sm:px-6 lg:px-8">
        <div className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-96 bg-[radial-gradient(circle_at_85%_0%,rgba(169,199,245,0.34),transparent_36%),radial-gradient(circle_at_10%_10%,rgba(158,217,194,0.26),transparent_30%)]" />
        <div className="relative z-10 mx-auto max-w-7xl">
            <Header />

            <section className="flex flex-col gap-5 pb-7 pt-9 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#e88976]">{today_date.toLocaleDateString('en-US',{dateStyle: 'full'})}</p><h1 className="text-3xl font-black tracking-[-0.07em] sm:text-4xl">{Greetings()} @{name}.</h1><p className="mt-2 text-sm text-[#75837b]">Here’s the gentle version of your money story this month.</p></div>
            <button type="button" onClick={() => navigate("/add-expense")} className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#e88976] px-4 py-3 text-sm font-bold text-white shadow-[3px_3px_0_#27352f] transition-transform hover:-translate-y-0.5 sm:self-auto"><Plus size={17} /> Add expense</button>
            </section>

            {profile && monthlyIncome === undefined && (
              <aside className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#f0dfaa] bg-[#fff8dd] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <CircleHelp size={18} className="mt-0.5 shrink-0 text-[#806b32]" />
                  <p className="text-sm leading-5 text-[#6e5e32]">Add your monthly income to see how much you have available to spend. You can enter it manually in your account information.</p>
                </div>
                <button type="button" onClick={() => navigate("/account-info")} className="shrink-0 self-start text-sm font-bold text-[#806b32] underline underline-offset-4 hover:text-[#27352f] sm:self-auto">Add monthly income</button>
              </aside>
            )}

            <section className="grid gap-4 md:grid-cols-3">
            {summaryCards.map((card) => { const Icon = card.icon; return <article key={card.label} className={`rounded-[24px] border border-[#dce6dc] ${card.tone} p-5 shadow-[0_10px_24px_rgba(39,53,47,0.04)]`}><div className="flex items-start justify-between"><p className="text-sm font-bold text-[#627069]">{card.label}</p><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-[#27352f]"><Icon size={18} /></span></div><p className="mt-7 text-3xl font-black tracking-[-0.07em]">{card.value}</p><p className="mt-2 text-xs font-semibold text-[#75837b]">{card.note}</p></article>; })}
            <article className="rounded-[24px] border border-[#dce6dc] bg-[#27352f] p-5 text-white shadow-[0_10px_24px_rgba(39,53,47,0.08)] md:col-span-3 lg:col-span-1"><div className="flex items-center justify-between"><p className="text-sm font-bold text-[#b7c6bc]">Monthly income</p><CircleHelp size={17} className="text-[#f8d66d]" /></div><div className="mt-6 flex items-end justify-between"><span className="text-3xl font-black tracking-[-0.07em]">{dashboardDataLoading ? "..." : monthlyIncome === undefined ? "Not set" : formatMoney(monthlyIncome)}</span><span className="text-sm font-bold text-[#f8d66d]">{monthlyIncome === undefined ? "" : `${budgetUsedPercent}% used`}</span></div><div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#f8d66d] transition-[width]" style={{ width: `${budgetUsedPercent}%` }} /></div><p className="mt-3 text-xs font-semibold text-[#b7c6bc]">{availableToSpend === undefined ? "Set income in account info to track your budget" : `${formatMoney(availableToSpend)} available after spending and savings`}</p></article>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <article className="rounded-[28px] border border-[#dce6dc] bg-white/90 p-5 shadow-[0_12px_30px_rgba(39,53,47,0.04)] sm:p-6"><div className="flex items-center justify-between"><div><SectionTitle title="Spending overview" /><p className="-mt-3 text-xs text-[#829087]">Your daily spending over the past week</p></div><span className="flex items-center gap-1 rounded-full bg-[#f5f7f2] px-3 py-2 text-xs font-bold text-[#627069]"><CalendarDays size={14} /> Past 7 days</span></div><div className="mt-7 flex h-56 items-end gap-2 border-b border-[#e7ece5] px-1 sm:gap-4">{weeklySpend.map((day, index) => <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-3"><div title={formatMoney(day.amount)} className={`w-full max-w-10 rounded-t-xl transition-opacity hover:opacity-75 ${index === 6 ? "bg-[#e88976]" : "bg-[#a9c7f5]"}`} style={{ height: `${maxDailySpend > 0 ? Math.max(8, (day.amount / maxDailySpend) * 100) : 0}%` }} /><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9aaa9f]">{day.label}</span></div>)}</div><div className="mt-5 flex items-center gap-2 text-xs font-bold text-[#4e7460]"><TrendingUp size={15} /> {weeklyInsight}</div></article>

            <article className="rounded-[28px] border border-[#dce6dc] bg-white/90 p-5 shadow-[0_12px_30px_rgba(39,53,47,0.04)] sm:p-6"><SectionTitle title="Where it goes" /><div className="space-y-5">{expenses === undefined ? <p className="text-sm font-semibold text-[#829087]">Loading expense categories...</p> : categories.length === 0 ? <p className="text-sm font-semibold text-[#829087]">No expenses recorded this month.</p> : categories.map((item) => { const Icon = item.icon; return <div key={item.label}><div className="mb-2 flex items-center gap-3"><span className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.color} text-[#27352f]`}><Icon size={15} /></span><span className="flex-1 text-sm font-bold">{item.label}</span><span className="text-sm font-bold text-[#627069]">{item.amount}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#edf0ea]"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} /></div></div>; })}</div></article>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <article className="rounded-[28px] border border-[#dce6dc] bg-white/90 p-5 shadow-[0_12px_30px_rgba(39,53,47,0.04)] sm:p-6"><SectionTitle title="Recent activity" /><div className="space-y-2">{dashboardDataLoading ? <p className="py-2 text-sm font-semibold text-[#829087]">Loading recent activity...</p> : recentActivities.length === 0 ? <p className="py-2 text-sm font-semibold text-[#829087]">No recent expenses, savings, or income changes.</p> : recentActivities.map((activity) => { const Icon = activity.icon; return <div key={activity.id} className="flex items-center gap-3 rounded-2xl border border-[#edf0ea] bg-[#fdfcf8] px-3 py-3 transition-colors hover:bg-[#f8f6f0] sm:px-4"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${activity.color} text-[#27352f]`}><Icon size={17} /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{activity.name}</p><p className="mt-0.5 text-xs text-[#829087]">{activity.category} · {formatActivityDate(activity.timestamp)}</p></div><p className={`text-sm font-black ${activity.positive ? "text-[#4e7460]" : "text-[#27352f]"}`}>{activity.amount}</p></div>; })}</div></article>

            <article className="rounded-[28px] border border-[#dce6dc] bg-[#fff8dd] p-5 shadow-[0_12px_30px_rgba(39,53,47,0.04)] sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9d8950]">Spending insight</p>
                  <h2 className="mt-2 text-xl font-black tracking-[-0.05em]">Top category this month</h2>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-[#806b32]">
                  <TopCategoryIcon size={19} />
                </span>
              </div>
              {dashboardDataLoading ? (
                <p className="mt-8 text-sm font-semibold text-[#806b32]">Loading your spending...</p>
              ) : topCategory ? (
                <>
                  <p className="mt-7 text-3xl font-black capitalize tracking-[-0.07em]">{topCategory[0]}</p>
                  <p className="mt-2 text-lg font-bold text-[#806b32]">{formatMoney(topCategory[1])}</p>
                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#f2e7b7]">
                    <div className="h-full rounded-full bg-[#e88976]" style={{ width: `${topCategoryShare}%` }} />
                  </div>
                  <p className="mt-3 text-xs font-semibold leading-5 text-[#806b32]">
                    {topCategoryShare}% of this month's {formatMoney(spentThisMonth)} spending across {currentMonthExpenses.length} {currentMonthExpenses.length === 1 ? "expense" : "expenses"}.
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-7 text-sm font-semibold leading-6 text-[#806b32]">Add an expense to see which category takes the biggest share of your spending this month.</p>
                  <button type="button" onClick={() => navigate("/add-expense")} className="mt-5 rounded-xl bg-[#27352f] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#34483f]">Add your first expense</button>
                </>
              )}
            </article>
            </section>
        </div>
        </main>
    );
}