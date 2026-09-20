import { ArrowDownLeft, ArrowUpRight, CalendarDays, ChevronDown, CircleHelp, Coffee, Home, MoreHorizontal, Plus, ShoppingBag, Sparkles, Target, TrendingUp, Utensils, Wallet } from "lucide-react";
import Header from "../../components/Header";

const summaryCards = [
  { label: "Available to spend", value: "$2,846.20", note: "68% of your monthly plan", tone: "bg-[#edf7ed]", icon: Wallet },
  { label: "Spent this month", value: "$1,353.80", note: "12% less than last month", tone: "bg-[#fff0ec]", icon: ArrowUpRight },
  { label: "Saved this month", value: "$620.00", note: "18% toward your goal", tone: "bg-[#fff8dd]", icon: Target },
];

const categories = [
  { label: "Home", amount: "$920", percent: 76, color: "bg-[#e88976]", icon: Home },
  { label: "Food & coffee", amount: "$438", percent: 46, color: "bg-[#9ed9c2]", icon: Utensils },
  { label: "Transport", amount: "$182", percent: 22, color: "bg-[#a9c7f5]", icon: Coffee },
  { label: "Shopping", amount: "$96", percent: 12, color: "bg-[#f8d66d]", icon: ShoppingBag },
];

const transactions = [
  { name: "Sunrise Market", category: "Groceries", date: "Today, 9:42 AM", amount: "-$64.80", color: "bg-[#9ed9c2]", icon: ShoppingBag },
  { name: "The Daily Grind", category: "Food & coffee", date: "Yesterday, 8:15 AM", amount: "-$8.50", color: "bg-[#fff8dd]", icon: Coffee },
  { name: "Monthly rent", category: "Home", date: "May 01, 2026", amount: "-$920.00", color: "bg-[#fff0ec]", icon: Home },
  { name: "Salary deposit", category: "Income", date: "May 01, 2026", amount: "+$4,200.00", color: "bg-[#edf7ed]", icon: ArrowDownLeft },
];

const weeklySpend = [38, 52, 34, 68, 46, 84, 58];

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-black tracking-[-0.04em] text-[#27352f]">{title}</h2>{action && <button type="button" className="text-xs font-bold text-[#e88976] transition-colors hover:text-[#bf624f]">{action}</button>}</div>;
}

export default function Dashboard() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f6f0] px-4 py-5 text-[#27352f] sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-96 bg-[radial-gradient(circle_at_85%_0%,rgba(169,199,245,0.34),transparent_36%),radial-gradient(circle_at_10%_10%,rgba(158,217,194,0.26),transparent_30%)]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <Header />

        <section className="flex flex-col gap-5 pb-7 pt-9 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#e88976]">Saturday, May 16, 2026</p><h1 className="text-3xl font-black tracking-[-0.07em] sm:text-4xl">Good morning, Jamie.</h1><p className="mt-2 text-sm text-[#75837b]">Here’s the gentle version of your money story this month.</p></div>
          <button type="button" className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#e88976] px-4 py-3 text-sm font-bold text-white shadow-[3px_3px_0_#27352f] transition-transform hover:-translate-y-0.5 sm:self-auto"><Plus size={17} /> Add expense</button>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {summaryCards.map((card) => { const Icon = card.icon; return <article key={card.label} className={`rounded-[24px] border border-[#dce6dc] ${card.tone} p-5 shadow-[0_10px_24px_rgba(39,53,47,0.04)]`}><div className="flex items-start justify-between"><p className="text-sm font-bold text-[#627069]">{card.label}</p><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-[#27352f]"><Icon size={18} /></span></div><p className="mt-7 text-3xl font-black tracking-[-0.07em]">{card.value}</p><p className="mt-2 text-xs font-semibold text-[#75837b]">{card.note}</p></article>; })}
          <article className="rounded-[24px] border border-[#dce6dc] bg-[#27352f] p-5 text-white shadow-[0_10px_24px_rgba(39,53,47,0.08)] md:col-span-3 lg:col-span-1"><div className="flex items-center justify-between"><p className="text-sm font-bold text-[#b7c6bc]">Monthly budget</p><CircleHelp size={17} className="text-[#f8d66d]" /></div><div className="mt-6 flex items-end justify-between"><span className="text-3xl font-black tracking-[-0.07em]">$4,200</span><span className="text-sm font-bold text-[#f8d66d]">68%</span></div><div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/15"><div className="h-full w-[68%] rounded-full bg-[#f8d66d]" /></div><p className="mt-3 text-xs font-semibold text-[#b7c6bc]">$1,353.80 left in your plan</p></article>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <article className="rounded-[28px] border border-[#dce6dc] bg-white/90 p-5 shadow-[0_12px_30px_rgba(39,53,47,0.04)] sm:p-6"><div className="flex items-center justify-between"><div><SectionTitle title="Spending overview" /><p className="-mt-3 text-xs text-[#829087]">Your daily spending over the past week</p></div><button type="button" className="flex items-center gap-1 rounded-full bg-[#f5f7f2] px-3 py-2 text-xs font-bold text-[#627069]"><CalendarDays size={14} /> This week <ChevronDown size={13} /></button></div><div className="mt-7 flex h-56 items-end gap-2 border-b border-[#e7ece5] px-1 sm:gap-4">{weeklySpend.map((height, index) => <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-3"><div className={`w-full max-w-10 rounded-t-xl transition-opacity hover:opacity-75 ${index === 5 ? "bg-[#e88976]" : "bg-[#a9c7f5]"}`} style={{ height: `${height}%` }} /><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9aaa9f]">{["M", "T", "W", "T", "F", "S", "S"][index]}</span></div>)}</div><div className="mt-5 flex items-center gap-2 text-xs font-bold text-[#4e7460]"><TrendingUp size={15} /> You spent 12% less than last week</div></article>

          <article className="rounded-[28px] border border-[#dce6dc] bg-white/90 p-5 shadow-[0_12px_30px_rgba(39,53,47,0.04)] sm:p-6"><SectionTitle title="Where it goes" action="View details" /><div className="space-y-5">{categories.map((item) => { const Icon = item.icon; return <div key={item.label}><div className="mb-2 flex items-center gap-3"><span className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.color} text-[#27352f]`}><Icon size={15} /></span><span className="flex-1 text-sm font-bold">{item.label}</span><span className="text-sm font-bold text-[#627069]">{item.amount}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#edf0ea]"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} /></div></div>; })}</div></article>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <article className="rounded-[28px] border border-[#dce6dc] bg-white/90 p-5 shadow-[0_12px_30px_rgba(39,53,47,0.04)] sm:p-6"><SectionTitle title="Recent activity" action="View all" /><div className="space-y-2">{transactions.map((transaction) => { const Icon = transaction.icon; return <div key={`${transaction.name}-${transaction.date}`} className="flex items-center gap-3 rounded-2xl border border-[#edf0ea] bg-[#fdfcf8] px-3 py-3 transition-colors hover:bg-[#f8f6f0] sm:px-4"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${transaction.color} text-[#27352f]`}><Icon size={17} /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{transaction.name}</p><p className="mt-0.5 text-xs text-[#829087]">{transaction.category} · {transaction.date}</p></div><p className={`text-sm font-black ${transaction.amount.startsWith("+") ? "text-[#4e7460]" : "text-[#27352f]"}`}>{transaction.amount}</p><button type="button" className="hidden text-[#9aaa9f] hover:text-[#627069] sm:block" aria-label={`More options for ${transaction.name}`}><MoreHorizontal size={17} /></button></div>; })}</div></article>

          <article className="rounded-[28px] border border-[#dce6dc] bg-[#fff8dd] p-5 shadow-[0_12px_30px_rgba(39,53,47,0.04)] sm:p-6"><div className="flex items-start justify-between"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-[#9d8950]">Your next win</p><h2 className="mt-2 text-xl font-black tracking-[-0.05em]">Weekend getaway</h2></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-[#806b32]"><Target size={19} /></span></div><p className="mt-7 text-3xl font-black tracking-[-0.07em]">$620 <span className="text-sm font-bold text-[#9d8950]">/ $1,000</span></p><div className="mt-4 h-3 overflow-hidden rounded-full bg-[#f2e7b7]"><div className="h-full w-[62%] rounded-full bg-[#e88976]" /></div><div className="mt-3 flex justify-between text-xs font-bold text-[#9d8950]"><span>62% complete</span><span>Due Aug 01</span></div><div className="mt-8 rounded-2xl bg-white/60 p-3 text-xs font-semibold leading-5 text-[#806b32]"><Sparkles size={14} className="mb-1 inline-block" /> You’re on track to reach this goal in 3 months.</div></article>
        </section>
      </div>
    </main>
  );
}