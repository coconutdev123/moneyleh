import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getWishlists = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const wishlists = await ctx.db
      .query("wishlist")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const wishlistsWithSavings = await Promise.all(
      wishlists.map(async (wishlist) => {
        const savings = await ctx.db
          .query("wishlistSavings")
          .withIndex("by_wishlist", (q) => q.eq("wishlistId", wishlist._id))
          .collect();
        const savedAmount = (wishlist.savedAmount ?? 0) + savings.reduce((total, saving) => total + saving.amount, 0);

        return {
          ...wishlist,
          savedAmount,
          savings: savings.sort((first, second) => second.savedAt.localeCompare(first.savedAt)),
        };
      }),
    );

    return wishlistsWithSavings.sort((first, second) => (first.priority ?? 0) - (second.priority ?? 0));
  },
});

export const createWishlist = mutation({
  args: {
    title: v.string(),
    price: v.number(),
    item: v.string(),
    projectedDate: v.string(),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const item = args.item.trim();
    if (!item) throw new Error("Item name is required");
    if (!Number.isFinite(args.price) || args.price <= 0) throw new Error("Target amount must be positive");

    const existing = await ctx.db
      .query("wishlist")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return await ctx.db.insert("wishlist", {
      userId,
      title: args.title.trim(),
      price: args.price,
      item,
      projectedDate: args.projectedDate,
      link: args.link?.trim() || undefined,
      savedAmount: 0,
      priority: existing.length,
    });
  },
});

export const addSavings = mutation({
  args: {
    wishlistId: v.id("wishlist"),
    amount: v.number(),
    savedAt: v.string(),
  },
  handler: async (ctx, { wishlistId, amount, savedAt }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    if (!Number.isFinite(amount) || amount <= 0) throw new Error("Savings amount must be positive");
    if (!savedAt.trim()) throw new Error("Savings date is required");

    const wishlist = await ctx.db.get(wishlistId);
    if (!wishlist || wishlist.userId !== userId) throw new Error("Wishlist not found");

    return await ctx.db.insert("wishlistSavings", {
      userId,
      wishlistId,
      amount,
      savedAt,
    });
  },
});

export const reorderWishlists = mutation({
  args: { orderedIds: v.array(v.id("wishlist")) },
  handler: async (ctx, { orderedIds }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const userWishlists = await ctx.db
      .query("wishlist")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const validIds = new Set(userWishlists.map((wishlist) => wishlist._id));
    const orderedIdSet = new Set(orderedIds);
    if (orderedIds.length !== userWishlists.length || orderedIdSet.size !== userWishlists.length || orderedIds.some((id) => !validIds.has(id))) {
      throw new Error("Invalid wishlist order");
    }

    for (const [priority, id] of orderedIds.entries()) {
      await ctx.db.patch(id, { priority });
    }
  },
});

export const removeWishlist = mutation({
  args: { id: v.id("wishlist") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const wishlist = await ctx.db.get(id);
    if (!wishlist || wishlist.userId !== userId) throw new Error("Wishlist not found");

    const savings = await ctx.db
      .query("wishlistSavings")
      .withIndex("by_wishlist", (q) => q.eq("wishlistId", id))
      .collect();
    for (const saving of savings) await ctx.db.delete(saving._id);
    await ctx.db.delete(id);
  },
});