import {v} from "convex/values";
import { query, mutation ,internalQuery, internalMutation} from "./_generated/server";
import { auth } from "./auth";
import { getAuthUserId } from "@convex-dev/auth/server";

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
            email: "",
            gender: "",
            dob: "",
        };
        const id = await ctx.db.insert("profile", initial);
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("profile", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("profile"),
    updates: v.record(v.string(), v.union(v.string(), v.null())),
  },
  handler: async (ctx, { id, updates }) => {
    await ctx.db.patch(id, updates);
  },
});

export const ensureProfile = mutation({
  args: {},
  returns: v.object({
    _id: v.id("profile"),
    _creationTime: v.number(),
    userId: v.id("users"),
    username: v.string(),
    email: v.string(),
    gender: v.string(),
    dob: v.string(),
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
      email: user?.email ?? "",
      gender: "",
      dob: "",
    });
    return (await ctx.db.get(id))!;
  },
});

export const updateProfile = internalMutation({
    args:{ updates: v.record(v.string(), v.union(v.string(), v.null())) },
    handler: async (ctx, { updates }) => {
        const profile = await ctx.db.query("profile").first();
        if (!profile) {
            throw new Error("Profile not found");
        }
        const updated = { ...profile, ...updates };
        await ctx.db.patch(profile._id, updated);
        return updated;
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
    return { success: true };
  },
});

export const removeById = internalMutation({
  args: { id: v.id("profile") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true };
  },
});