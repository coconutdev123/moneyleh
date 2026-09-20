import { Button } from "@shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/ui/card";
import Header from "../../components/Header";

const summaryCards = [
  {
    label: "Total balance",
    value: "$24,860",
    change: "+8.2%",
    tone: "text-emerald-600",
    bg: "from-emerald-500/15 to-emerald-500/5",
    icon: "◌",
  },
  {
    label: "Monthly spend",
    value: "$3,240",
    change: "-4.1%",
    tone: "text-sky-600",
    bg: "from-sky-500/15 to-sky-500/5",
    icon: "◍",
  },
  {
    label: "Savings",
    value: "$8,140",
    change: "+12.4%",
    tone: "text-violet-600",
    bg: "from-violet-500/15 to-violet-500/5",
    icon: "◎",
  },
  {
    label: "Bills due",
    value: "$1,480",
    change: "2 this week",
    tone: "text-amber-600",
    bg: "from-amber-500/15 to-amber-500/5",
    icon: "◔",
  },
];

const expenseBreakdown = [
  { category: "Housing", amount: 920, percent: 72, color: "bg-slate-900" },
  { category: "Food", amount: 480, percent: 58, color: "bg-emerald-500" },
  { category: "Transport", amount: 260, percent: 38, color: "bg-sky-500" },
  { category: "Shopping", amount: 210, percent: 32, color: "bg-violet-500" },
  { category: "Utilities", amount: 180, percent: 26, color: "bg-amber-500" },
];

const recentExpenses = [
  { name: "Rent", date: "Today, 8:40 AM", amount: "-$1,200", tag: "Housing" },
  { name: "Groceries", date: "Yesterday", amount: "-$148", tag: "Food" },
  { name: "Fuel", date: "Mon, 9:15 AM", amount: "-$62", tag: "Transport" },
  { name: "Streaming", date: "Sun", amount: "-$19", tag: "Utilities" },
];

const spendingBars = [36, 58, 42, 78, 62, 88, 70];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#f1f5f9_32%,_#e2e8f0_100%)] p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Header />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <Card
              key={card.label}
              className="overflow-hidden rounded-[24px] border-0 bg-white/90 shadow-[0_18px_36px_rgba(15,23,42,0.04)]"
            >
              <CardHeader className="pb-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${card.bg} text-sm font-bold ${card.tone}`}>
                    {card.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pb-5">
                <div className="text-3xl font-semibold tracking-tight text-slate-900">{card.value}</div>
                <div className={`inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold ${card.tone}`}>
                  {card.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
          <Card className="rounded-[28px] border-0 bg-white/90 shadow-[0_18px_36px_rgba(15,23,42,0.04)]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-slate-900">Expense breakdown</CardTitle>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">May 2026</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pb-6">
              {expenseBreakdown.map((item) => (
                <div key={item.category}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.category}</span>
                    <span className="font-medium text-slate-500">${item.amount}</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className={`${item.color} h-full rounded-full shadow-sm`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-0 bg-white/90 shadow-[0_18px_36px_rgba(15,23,42,0.04)]">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl font-semibold text-slate-900">Spending pulse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              <div className="rounded-[22px] bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)] p-4 text-white shadow-lg shadow-slate-300/40">
                <p className="text-sm text-slate-300">This month</p>
                <div className="mt-2 text-4xl font-semibold tracking-tight">$3,240</div>
                <p className="mt-2 text-sm text-emerald-400">+12% vs last month</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Fixed costs", value: "$1,680", width: "55%" },
                  { label: "Variable costs", value: "$980", width: "32%" },
                  { label: "Goals", value: "$580", width: "19%" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-medium text-slate-800">{item.value}</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-[linear-gradient(90deg,#0f172a_0%,#475569_55%,#94a3b8_100%)]" style={{ width: item.width }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-[28px] border-0 bg-white/90 shadow-[0_18px_36px_rgba(15,23,42,0.04)]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-slate-900">Recent expenses</CardTitle>
                <Button variant="ghost" size="sm" className="rounded-lg text-slate-600 hover:bg-slate-100">View all</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentExpenses.map((expense) => (
                  <div key={expense.name} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-100/80">
                    <div>
                      <div className="font-medium text-slate-800">{expense.name}</div>
                      <div className="text-sm text-slate-500">{expense.date}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 ring-1 ring-slate-200">
                        {expense.tag}
                      </span>
                      <span className="font-semibold text-slate-900">{expense.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-0 bg-white/90 shadow-[0_18px_36px_rgba(15,23,42,0.04)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold text-slate-900">Weekly spend</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex h-44 items-end gap-3 rounded-[24px] bg-gradient-to-b from-slate-50 to-white p-4 ring-1 ring-slate-200/80">
                {spendingBars.map((height, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center justify-end gap-2">
                    <div
                      className="w-full rounded-t-2xl bg-[linear-gradient(180deg,#0f172a_0%,#475569_100%)] shadow-[0_10px_20px_rgba(15,23,42,0.18)]"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
