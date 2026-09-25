import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";

export const getExpenses = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("expense")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const createExpense = mutation({
  args: {
    title: v.string(),
    amount: v.number(),
    category: v.string(),
    date: v.string(),
    merchant: v.string(),
    paymentMethod: v.string(),
    notes: v.optional(v.string()),
    recurring: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const expenseId = await ctx.db.insert("expense", {
      userId,
      title: args.title.trim(),
      amount: Number(args.amount),
      category: args.category,
      date: args.date,
      merchant: args.merchant.trim(),
      paymentMethod: args.paymentMethod,
      notes: args.notes?.trim() || undefined,
      recurring: args.recurring ?? false,
    });

    return await ctx.db.get(expenseId);
  },
});
