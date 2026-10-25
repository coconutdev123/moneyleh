import {v} from "convex/values";
import { query, mutation ,internalQuery, internalMutation} from "./_generated/server";
import { auth } from "./auth";
import { getAuthUserId } from "@convex-dev/auth/server";
import { normalizeUsername, validateUsername } from "../../shared/src/lib/username";
import { internal } from "./_generated/api";

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    return await ctx.db.query("profile")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

export const getByUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.query("profile")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

export const getById = internalQuery({
  args: { id: v.id("profile") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const initProfile = internalMutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("profile").first();
        if(existing){
            return existing;
        }
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const initial = {
            userId,
            username: "",
          normalizedUsername: "",
            email: "",
            gender: "",
            dob: "",
            pfp: "",
        };
        const id = await ctx.db.insert("profile", initial);
        await ctx.scheduler.runAfter(0, internal.usernameFilter.rebuildUsernameFilter, {});
        return {...initial, _id: id};
    },
});

export const create = internalMutation({
  args: {
    userId: v.id("users"),
    username: v.string(),
    email: v.string(),
    gender: v.string(),
    dob: v.string(),
    pfp: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("profile", {
      ...args,
      normalizedUsername: normalizeUsername(args.username),
    });
    await ctx.scheduler.runAfter(0, internal.usernameFilter.rebuildUsernameFilter, {});
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("profile"),
    updates: v.object({
      username: v.optional(v.string()),
      email: v.optional(v.string()),
      gender: v.optional(v.string()),
      dob: v.optional(v.string()),
      pfp: v.optional(v.string()),
      monthlyIncome: v.optional(v.number()),
    }),
  },
  handler: async (ctx, { id, updates }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db.get(id);
    if (!profile || profile.userId !== userId) throw new Error("Not authorized to update this profile");

    if (updates.monthlyIncome !== undefined && (!Number.isFinite(updates.monthlyIncome) || updates.monthlyIncome < 0)) {
      throw new Error("Monthly income must be zero or greater");
    }

    if (updates.username !== undefined) {
      const validationError = validateUsername(updates.username);
      if (validationError) throw new Error(validationError);

      const normalized = normalizeUsername(updates.username);
      const profiles = await ctx.db.query("profile").collect();
      if (profiles.some((candidate) => candidate._id !== id && normalizeUsername(candidate.username) === normalized)) {
        throw new Error("Username is already taken");
      }

    }

    const monthlyIncomeChanged = updates.monthlyIncome !== undefined && updates.monthlyIncome !== profile.monthlyIncome;
    await ctx.db.patch(id, {
      ...updates,
      ...(updates.username === undefined ? {} : { normalizedUsername: normalizeUsername(updates.username) }),
      ...(monthlyIncomeChanged ? { monthlyIncomeUpdatedAt: Date.now() } : {}),
    });
    if (updates.username !== undefined) {
      await ctx.scheduler.runAfter(0, internal.usernameFilter.rebuildUsernameFilter, {});
    }
  },
});

export const deleteAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const savings = await ctx.db
      .query("wishlistSavings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const saving of savings) await ctx.db.delete(saving._id);

    const wishlists = await ctx.db
      .query("wishlist")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const wishlist of wishlists) await ctx.db.delete(wishlist._id);

    const expenses = await ctx.db
      .query("expense")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const expense of expenses) await ctx.db.delete(expense._id);

    const profiles = await ctx.db
      .query("profile")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const profile of profiles) await ctx.db.delete(profile._id);

    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    for (const session of sessions) {
      const refreshTokens = await ctx.db
        .query("authRefreshTokens")
        .withIndex("sessionId", (q) => q.eq("sessionId", session._id))
        .collect();
      for (const token of refreshTokens) await ctx.db.delete(token._id);
      await ctx.db.delete(session._id);
    }

    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .collect();
    for (const account of accounts) {
      const verificationCodes = await ctx.db
        .query("authVerificationCodes")
        .withIndex("accountId", (q) => q.eq("accountId", account._id))
        .collect();
      for (const code of verificationCodes) await ctx.db.delete(code._id);
      await ctx.db.delete(account._id);
    }

    if (profiles.length > 0) {
      await ctx.scheduler.runAfter(0, internal.usernameFilter.rebuildUsernameFilter, {});
    }
    await ctx.db.delete(userId);
  },
});

export const ensureProfile = mutation({
  args: {},
  returns: v.object({
    _id: v.id("profile"),
    _creationTime: v.number(),
    userId: v.id("users"),
    username: v.string(),
    normalizedUsername: v.optional(v.string()),
    email: v.string(),
    gender: v.string(),
    dob: v.string(),
    pfp: v.optional(v.string()),
  }),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    const existing = await ctx.db
      .query("profile")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (existing) {
      return existing;
    }
    const user = await ctx.db.get(userId);
    const id = await ctx.db.insert("profile", {
      userId,
      username: user?.name ?? "",
      normalizedUsername: normalizeUsername(user?.name ?? ""),
      email: user?.email ?? "",
      gender: "",
      dob: "",
      pfp: "",
    });
    await ctx.scheduler.runAfter(0, internal.usernameFilter.rebuildUsernameFilter, {});
    return (await ctx.db.get(id))!;
  },
});

export const updateProfile = internalMutation({
  args: {
    userId: v.id("users"),
    updates: v.object({
      username: v.optional(v.string()),
      email: v.optional(v.string()),
      gender: v.optional(v.string()),
      dob: v.optional(v.string()),
      pfp: v.optional(v.string()),
      monthlyIncome: v.optional(v.number()),
      monthlyIncomeUpdatedAt: v.optional(v.number()),
    }),
  },
  handler: async (ctx, { userId, updates }) => {
    const profile = await ctx.db
      .query("profile")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (updates.username !== undefined) {
      const validationError = validateUsername(updates.username);
      if (validationError) throw new Error(validationError);

      const normalized = normalizeUsername(updates.username);
      const profiles = await ctx.db.query("profile").collect();
      if (profiles.some((candidate) => candidate._id !== profile?._id && normalizeUsername(candidate.username) === normalized)) {
        throw new Error("Username is already taken");
      }
    }

    const normalizedUsername = updates.username === undefined
      ? undefined
      : normalizeUsername(updates.username);

    const monthlyIncomeChanged = updates.monthlyIncome !== undefined && updates.monthlyIncome !== profile?.monthlyIncome;

    if (profile) {
      await ctx.db.patch(profile._id, {
        ...updates,
        ...(normalizedUsername === undefined ? {} : { normalizedUsername }),
        ...(monthlyIncomeChanged ? { monthlyIncomeUpdatedAt: Date.now() } : {}),
      });
      if (normalizedUsername !== undefined) {
        await ctx.scheduler.runAfter(0, internal.usernameFilter.rebuildUsernameFilter, {});
      }
      return await ctx.db.get(profile._id);
    }

    const user = await ctx.db.get(userId);
    const id = await ctx.db.insert("profile", {
      userId,
      username: "",
      normalizedUsername: "",
      email: user?.email ?? "",
      gender: "",
      dob: "",
      pfp: "",
      ...updates,
      ...(normalizedUsername === undefined ? {} : { normalizedUsername }),
      ...(monthlyIncomeChanged ? { monthlyIncomeUpdatedAt: Date.now() } : {}),
    });
    await ctx.scheduler.runAfter(0, internal.usernameFilter.rebuildUsernameFilter, {});
    return await ctx.db.get(id);
  },
});

// Add this to your profile.ts file, along with your other mutations

export const remove = mutation({
  args: { id: v.id("profile") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    // First verify the profile belongs to the authenticated user
    const profile = await ctx.db.get(id);
    if (!profile) {
      throw new Error("Profile not found");
    }
    
    if (profile.userId !== userId) {
      throw new Error("Not authorized to delete this profile");
    }
    
    await ctx.db.delete(id);
    await ctx.scheduler.runAfter(0, internal.usernameFilter.rebuildUsernameFilter, {});
    return { success: true };
  },
});

export const removeByUser = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const profile = await ctx.db.query("profile")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    if (!profile) {
      return { success: false, message: "Profile not found" };
    }
    
    await ctx.db.delete(profile._id);
    await ctx.scheduler.runAfter(0, internal.usernameFilter.rebuildUsernameFilter, {});
    return { success: true };
  },
});

export const removeById = internalMutation({
  args: { id: v.id("profile") },
  handler: async (ctx, { id }) => {
    const profile = await ctx.db.get(id);
    await ctx.db.delete(id);
    if (profile) {
      await ctx.scheduler.runAfter(0, internal.usernameFilter.rebuildUsernameFilter, {});
    }
    return { success: true };
  },
});