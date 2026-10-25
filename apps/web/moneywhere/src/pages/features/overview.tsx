import { ArrowDownLeft, ArrowUpRight, CalendarDays, Target, Wallet } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@web_backend/convex/_generated/api";
import Header from "../../components/Header";

const expenseFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "HKD" });
const savingsFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const categoryColors = ["bg-[#e88976]", "bg-[#9ed9c2]", "bg-[#a9c7f5]", "bg-[#f8d66d]", "bg-[#c3b3e5]"];

function formatMonth(month: string) {
  return new Date(`${month}-01T00:00:00`).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function formatDate(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Overview() {
  const overview = useQuery(api.overview.getOverview);

  if (overview === undefined) {
    return <main className="min-h-screen bg-[#f8f6f0] px-4 py-8 text-[#75837b]"><div className="mx-auto max-w-7xl"><Header /><p className="py-24 text-center text-sm font-semibold">Loading your spending and savings overview...</p></div></main>;
  }

  const latestMonths = overview.monthlyTotals.slice(-6);
  const maxExpenseMonth = Math.max(0, ...latestMonths.map((month) => month.expenses));
  const maxSavingsMonth = Math.max(0, ...latestMonths.map((month) => month.savings));
  const maxCategoryAmount = Math.max(0, ...overview.categoryTotals.map((category) => category.amount));
  const activities = [
    ...overview.expenses.map((expense) => ({
      id: `expense-${expense._id}`,
      title: expense.title || expense.merchant,
      detail: `${expense.category} · ${formatDate(expense.date)}`,
      date: expense.date,
      amount: `-${expenseFormatter.format(expense.amount)}`,
      icon: ArrowUpRight,
      color: "bg-[#fff0ec] text-[#bf624f]",
    })),
    ...overview.savings.map((saving) => ({
      id: `saving-${saving._id}`,
      title: `Saved for ${saving.wishlistTitle}`,
      detail: formatDate(saving.savedAt),
      date: saving.savedAt,
      amount: `+${savingsFormatter.format(saving.amount)}`,
      icon: ArrowDownLeft,
      color: "bg-[#edf7ed] text-[#4e7460]",
    })),
  ].sort((first, second) => second.date.localeCompare(first.date)).slice(0, 20);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f6f0] px-4 py-5 text-[#27352f] sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-96 bg-[radial-gradient(circle_at_85%_0%,rgba(169,199,245,0.34),transparent_36%),radial-gradient(circle_at_10%_10%,rgba(158,217,194,0.26),transparent_30%)]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <Header />
        <section className="pb-7 pt-9">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#e88976]">Your money, at a glance</p>
          <h1 className="text-3xl font-black tracking-[-0.07em] sm:text-4xl">Spending &amp; savings overview</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#75837b]">A complete view of your recorded expenses and every contribution to your wishlist goals.</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Total spending" value={expenseFormatter.format(overview.totals.expenseAmount)} detail={`${overview.totals.expenseCount} recorded expenses · HKD`} icon={ArrowUpRight} tone="bg-[#fff0ec]" />
          <SummaryCard label="Total saved" value={savingsFormatter.format(overview.totals.savingsAmount)} detail={`${overview.totals.savingsCount} wishlist contributions · HKD`} icon={ArrowDownLeft} tone="bg-[#edf7ed]" />
          <SummaryCard label="Wishlist goals" value={String(overview.wishlists.length)} detail={`${overview.wishlists.filter((wishlist) => wishlist.targetAmount > 0 && wishlist.savedAmount >= wishlist.targetAmount).length} goals reached`} icon={Target} tone="bg-[#fff8dd]" />
          <SummaryCard label="Active months" value={String(overview.monthlyTotals.length)} detail="Months with recorded spending or savings" icon={CalendarDays} tone="bg-[#edf2fb]" />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[28px] border border-[#dce6dc] bg-white/90 p-5 shadow-[0_12px_30px_rgba(39,53,47,0.04)] sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="text-lg font-black tracking-[-0.04em]">Monthly activity</h2><p className="mt-1 text-xs text-[#829087]">Your six most recent months with recorded activity</p></div>
              <div className="flex gap-3 text-xs font-semibold text-[#627069]"><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-[#e88976]" />Spending · HKD</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-[#9ed9c2]" />Savings · USD</span></div>
            </div>
            {latestMonths.length === 0 ? (
              <EmptyMessage message="Your monthly activity will appear here once you add an expense or wishlist contribution." />
            ) : (
              <div className="mt-7 space-y-5">
                {latestMonths.map((month) => (
                  <div key={month.month} className="grid grid-cols-[3.25rem_1fr] items-center gap-3">
                    <span className="text-xs font-bold text-[#829087]">{formatMonth(month.month)}</span>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2"><div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#f5f2ed]"><div className="h-full rounded-full bg-[#e88976]" style={{ width: `${maxExpenseMonth ? (month.expenses / maxExpenseMonth) * 100 : 0}%` }} /></div><span className="w-24 text-right text-[11px] font-semibold text-[#627069]">{expenseFormatter.format(month.expenses)}</span></div>
                      <div className="flex items-center gap-2"><div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#f5f2ed]"><div className="h-full rounded-full bg-[#9ed9c2]" style={{ width: `${maxSavingsMonth ? (month.savings / maxSavingsMonth) * 100 : 0}%` }} /></div><span className="w-24 text-right text-[11px] font-semibold text-[#627069]">{savingsFormatter.format(month.savings)}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-5 text-[11px] text-[#9aaa9f]">Spending and savings bars are scaled separately; the currencies differ.</p>
          </article>

          <article className="rounded-[28px] border border-[#dce6dc] bg-white/90 p-5 shadow-[0_12px_30px_rgba(39,53,47,0.04)] sm:p-6">
            <h2 className="text-lg font-black tracking-[-0.04em]">Spending by category</h2>
            <p className="mt-1 text-xs text-[#829087]">All recorded expenses · HKD</p>
            {overview.categoryTotals.length === 0 ? <EmptyMessage message="Expense categories will appear here after you record an expense." /> : (
              <div className="mt-6 space-y-5">
                {overview.categoryTotals.map((category, index) => (
                  <div key={category.category}>
                    <div className="mb-2 flex items-center gap-2 text-sm"><span className="flex-1 font-bold capitalize">{category.category}</span><span className="font-bold">{expenseFormatter.format(category.amount)}</span><span className="w-16 text-right text-xs text-[#829087]">{category.count} {category.count === 1 ? "entry" : "entries"}</span></div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#f5f2ed]"><div className={`h-full rounded-full ${categoryColors[index % categoryColors.length]}`} style={{ width: `${maxCategoryAmount ? (category.amount / maxCategoryAmount) * 100 : 0}%` }} /></div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[28px] border border-[#dce6dc] bg-white/90 p-5 shadow-[0_12px_30px_rgba(39,53,47,0.04)] sm:p-6">
            <div className="flex items-center gap-2"><Target size={18} className="text-[#4e7460]" /><h2 className="text-lg font-black tracking-[-0.04em]">Wishlist progress</h2></div>
            <p className="mt-1 text-xs text-[#829087]">Saved amounts and targets · USD</p>
            {overview.wishlists.length === 0 ? <EmptyMessage message="Create a wishlist goal to track your savings progress." /> : (
              <div className="mt-5 space-y-4">
                {overview.wishlists.map((wishlist) => {
                  const progress = wishlist.targetAmount > 0 ? Math.min(100, (wishlist.savedAmount / wishlist.targetAmount) * 100) : 0;
                  return <div key={wishlist._id} className="rounded-2xl border border-[#edf0ea] bg-[#fdfcf8] p-4">
                    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-bold">{wishlist.title}</p><p className="mt-1 truncate text-xs text-[#829087]">{wishlist.item}</p></div><span className="shrink-0 text-xs font-bold text-[#4e7460]">{Math.round(progress)}%</span></div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#edf0ea]"><div className="h-full rounded-full bg-[#9ed9c2]" style={{ width: `${progress}%` }} /></div>
                    <p className="mt-2 text-xs font-semibold text-[#627069]">{savingsFormatter.format(wishlist.savedAmount)} of {savingsFormatter.format(wishlist.targetAmount)} · {wishlist.savingsCount} {wishlist.savingsCount === 1 ? "contribution" : "contributions"}</p>
                  </div>;
                })}
              </div>
            )}
          </article>

          <article className="rounded-[28px] border border-[#dce6dc] bg-white/90 p-5 shadow-[0_12px_30px_rgba(39,53,47,0.04)] sm:p-6">
            <div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-black tracking-[-0.04em]">Recent activity</h2><p className="mt-1 text-xs text-[#829087]">Latest expenses and savings contributions</p></div><Wallet size={19} className="text-[#627069]" /></div>
            {activities.length === 0 ? <EmptyMessage message="Your activity will appear here when you record an expense or add wishlist savings." /> : (
              <div className="mt-5 divide-y divide-[#edf0ea]">
                {activities.map((activity) => { const Icon = activity.icon; return <div key={activity.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${activity.color}`}><Icon size={16} /></span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{activity.title}</p><p className="mt-0.5 truncate text-xs text-[#829087]">{activity.detail}</p></div>
                  <span className="shrink-0 text-sm font-black">{activity.amount}</span>
                </div>; })}
              </div>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: typeof Wallet; tone: string }) {
  return <article className={`rounded-[24px] border border-[#dce6dc] ${tone} p-5 shadow-[0_10px_24px_rgba(39,53,47,0.04)]`}>
    <div className="flex items-start justify-between gap-2"><p className="text-sm font-bold text-[#627069]">{label}</p><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-[#27352f]"><Icon size={18} /></span></div>
    <p className="mt-6 text-2xl font-black tracking-[-0.06em]">{value}</p>
    <p className="mt-2 text-xs font-semibold text-[#75837b]">{detail}</p>
  </article>;
}

function EmptyMessage({ message }: { message: string }) {
  return <p className="mt-6 rounded-2xl bg-[#f8f6f0] px-4 py-5 text-sm leading-6 text-[#829087]">{message}</p>;
}