import { useState, type FormEvent } from "react";
import { ArrowLeft, CalendarDays, CreditCard, DollarSign, Sparkles, Tag } from "lucide-react";
import { useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { api } from "@web_backend/convex/_generated/api";
import Header from "../../components/Header";

const quickCategories = ["Groceries", "Dining", "Transport", "Bills", "Shopping", "Health", "Others"];

export default function Expense() {
  const navigate = useNavigate();
  const createExpense = useMutation(api.expense.createExpense);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Groceries",
    date: new Date().toISOString().slice(0, 10),
    merchant: "",
    paymentMethod: "Card",
    notes: "",
    recurring: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fieldClass =
    "h-12 rounded-xl border-[#dce6dc] bg-[#f8f6f0] px-3 text-[#27352f] shadow-none placeholder:text-[#9aaa9f] focus-visible:border-[#9ed9c2] focus-visible:ring-[#9ed9c2]/30";

  const handleChange = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const trimmedTitle = form.title.trim();
    const trimmedMerchant = form.merchant.trim();
    const amountValue = Number(form.amount);

    if (!trimmedTitle || !trimmedMerchant || !form.date || !form.amount || Number.isNaN(amountValue) || amountValue <= 0) {
      setError("Please fill in the expense title, amount, merchant, and date.");
      return;
    }

    setLoading(true);

    try {
      await createExpense({
        title: trimmedTitle,
        amount: amountValue,
        category: form.category,
        date: form.date,
        merchant: trimmedMerchant,
        paymentMethod: form.paymentMethod,
        notes: form.notes.trim() || undefined,
        recurring: form.recurring,
      });

      navigate("/dashboard");
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Something went wrong while saving your expense.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f6f0] px-4 py-5 text-[#27352f] sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-96 bg-[radial-gradient(circle_at_85%_0%,rgba(169,199,245,0.34),transparent_36%),radial-gradient(circle_at_10%_10%,rgba(158,217,194,0.26),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <Header />

        <div className="mt-7 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-full border border-[#dce6dc] bg-white/80 px-3 py-2 text-sm font-bold text-[#627069] shadow-[0_8px_20px_rgba(39,53,47,0.03)] transition-colors hover:bg-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <span className="rounded-full bg-[#edf7ed] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#4e7460]">
            Auto-saved
          </span>
        </div>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <form onSubmit={handleSubmit} className="rounded-[28px] border border-[#dce6dc] bg-white/90 p-5 shadow-[0_12px_30px_rgba(39,53,47,0.04)] sm:p-7">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#e88976]">Track a purchase</p>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.07em] text-[#27352f]">Add expense</h1>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-[#fff8dd] px-3 py-2 text-xs font-bold text-[#9d8950]">
                <Sparkles size={14} />
                Keeping your budget honest
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-xs font-bold text-[#627069]">Expense title</Label>
                <Input
                  type="text"
                  value={form.title}
                  onChange={(event) => handleChange("title", event.target.value)}
                  placeholder="Groceries, rent, coffee, etc."
                  className={fieldClass}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#627069]">Amount</Label>
                <div className="relative">
                  <DollarSign size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aaa9f]" />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={(event) => handleChange("amount", event.target.value)}
                    placeholder="0.00"
                    className={`${fieldClass} pl-9`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#627069]">Category</Label>
                <div className="relative">
                  <Tag size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aaa9f]" />
                  <select
                    value={form.category}
                    onChange={(event) => handleChange("category", event.target.value)}
                    className={`${fieldClass} appearance-none pl-9`}
                  >
                    {quickCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#627069]">Date</Label>
                <div className="relative">
                  <CalendarDays size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aaa9f]" />
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(event) => handleChange("date", event.target.value)}
                    className={`${fieldClass} pl-9`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#627069]">Merchant</Label>
                <Input
                  type="text"
                  value={form.merchant}
                  onChange={(event) => handleChange("merchant", event.target.value)}
                  placeholder="Where was it?"
                  className={fieldClass}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#627069]">Payment method</Label>
                <div className="relative">
                  <CreditCard size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aaa9f]" />
                  <select
                    value={form.paymentMethod}
                    onChange={(event) => handleChange("paymentMethod", event.target.value)}
                    className={`${fieldClass} appearance-none pl-9`}
                  >
                    <option value="Card">Card</option>
                    <option value="Cash">Cash</option>
                    <option value="FPS">FPS</option>
                    <option value="Octopus">Octopus</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-xs font-bold text-[#627069]">Notes</Label>
                <textarea
                  value={form.notes}
                  onChange={(event) => handleChange("notes", event.target.value)}
                  placeholder="Optional details, mood, or context"
                  rows={4}
                  className="w-full rounded-xl border border-[#dce6dc] bg-[#f8f6f0] px-3 py-3 text-[#27352f] placeholder:text-[#9aaa9f] focus:border-[#9ed9c2] focus:outline-none focus:ring-4 focus:ring-[#9ed9c2]/30"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-[#edf0ea] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex cursor-pointer items-center gap-3 text-sm font-bold text-[#627069]">
                <input
                  type="checkbox"
                  checked={form.recurring}
                  onChange={(event) => handleChange("recurring", event.target.checked)}
                  className="h-4 w-4 rounded border-[#cbd8cd] accent-[#e88976]"
                />
                Recurring expense
              </label>

              {error && (
                <div className="rounded-xl bg-[#fff0ec] px-3 py-2 text-sm font-semibold text-[#bf624f]">{error}</div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" variant="outline" className="h-11 rounded-xl border-[#dce6dc] bg-white px-5 text-sm font-bold text-[#627069] hover:bg-[#f8f6f0]">
                  Save draft
                </Button>
                <Button type="submit" disabled={loading} className="h-11 rounded-xl bg-[#e88976] px-5 text-sm font-bold text-white shadow-[3px_3px_0_#27352f] hover:bg-[#d97865] disabled:cursor-not-allowed disabled:opacity-70">
                  {loading ? "Saving..." : "Add expense"}
                </Button>
              </div>
            </div>
          </form>

          <aside className="rounded-[28px] border border-[#dce6dc] bg-[#27352f] p-5 text-white shadow-[0_12px_30px_rgba(39,53,47,0.08)] sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b7c6bc]">Expense preview</p>
            <div className="mt-6 rounded-[22px] bg-white/6 p-4">
              <p className="text-sm font-bold text-[#b7c6bc]">Estimated impact</p>
              <p className="mt-4 text-4xl font-black tracking-[-0.08em]">{form.amount ? `$${Number(form.amount).toFixed(2)}` : "$0.00"}</p>
              <p className="mt-3 text-sm text-[#dfe7df]">{form.title || "New expense"} · {form.category}</p>
            </div>

            <div className="mt-6 space-y-4 text-sm text-[#dfe7df]">
              <div className="flex items-center justify-between">
                <span className="text-[#b7c6bc]">Date</span>
                <span>{form.date || "Not set"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#b7c6bc]">Merchant</span>
                <span>{form.merchant || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#b7c6bc]">Recurring</span>
                <span>{form.recurring ? "Yes" : "No"}</span>
              </div>
            </div>

            <div className="mt-7 rounded-[22px] bg-[#fff8dd] p-4 text-[#27352f]">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#9d8950]">Budget note</p>
              <p className="mt-2 text-sm leading-6 text-[#4d5d57]">
                This expense will be grouped under {form.category.toLowerCase()} and reflected in your monthly overview after you save it.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
