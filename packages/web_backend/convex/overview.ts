import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const getOverview = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const [expenses, wishlists, savings] = await Promise.all([
      ctx.db
        .query("expense")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
      ctx.db
        .query("wishlist")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
      ctx.db
        .query("wishlistSavings")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
    ]);

    const wishlistById = new Map(wishlists.map((wishlist) => [wishlist._id, wishlist]));
    const savingsWithWishlist = savings.map((saving) => ({
      ...saving,
      wishlistTitle: wishlistById.get(saving.wishlistId)?.title ?? "Removed wishlist",
      wishlistItem: wishlistById.get(saving.wishlistId)?.item ?? "",
    }));

    const categoryTotals = new Map<string, { amount: number; count: number }>();
    const monthlyTotals = new Map<string, { expenses: number; savings: number }>();

    for (const expense of expenses) {
      const category = categoryTotals.get(expense.category) ?? { amount: 0, count: 0 };
      category.amount += expense.amount;
      category.count += 1;
      categoryTotals.set(expense.category, category);

      const month = monthlyTotals.get(expense.date.slice(0, 7)) ?? { expenses: 0, savings: 0 };
      month.expenses += expense.amount;
      monthlyTotals.set(expense.date.slice(0, 7), month);
    }

    for (const saving of savings) {
      const month = monthlyTotals.get(saving.savedAt.slice(0, 7)) ?? { expenses: 0, savings: 0 };
      month.savings += saving.amount;
      monthlyTotals.set(saving.savedAt.slice(0, 7), month);
    }

    return {
      totals: {
        expenseAmount: expenses.reduce((total, expense) => total + expense.amount, 0),
        savingsAmount: savings.reduce((total, saving) => total + saving.amount, 0),
        expenseCount: expenses.length,
        savingsCount: savings.length,
      },
      categoryTotals: [...categoryTotals.entries()]
        .map(([category, totals]) => ({ category, ...totals }))
        .sort((first, second) => second.amount - first.amount),
      monthlyTotals: [...monthlyTotals.entries()]
        .map(([month, totals]) => ({ month, ...totals }))
        .sort((first, second) => first.month.localeCompare(second.month)),
      expenses: expenses.sort((first, second) => second.date.localeCompare(first.date)),
      savings: savingsWithWishlist.sort((first, second) => second.savedAt.localeCompare(first.savedAt)),
      wishlists: wishlists.map((wishlist) => {
        const wishlistSavings = savings.filter((saving) => saving.wishlistId === wishlist._id);
        return {
          _id: wishlist._id,
          title: wishlist.title,
          item: wishlist.item,
          targetAmount: wishlist.price,
          savedAmount: (wishlist.savedAmount ?? 0) + wishlistSavings.reduce((total, saving) => total + saving.amount, 0),
          savingsCount: wishlistSavings.length,
          projectedDate: wishlist.projectedDate,
        };
      }),
    };
  },
});
