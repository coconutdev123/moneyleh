import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  numbers: defineTable({
    value: v.number(),
  }),

  profile: defineTable({
    userId: v.id("users"), 
    username: v.string(),
    email: v.string(),
    gender: v.string(),
    dob: v.string(), 
    pfp: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  expense: defineTable({
    userId: v.id("users"),
    title: v.string(),
    amount: v.number(),
    category: v.string(),
    date: v.string(),
    merchant: v.string(),
    paymentMethod: v.string(),
    notes: v.optional(v.string()),
    recurring: v.optional(v.boolean()),
  }).index("by_user", ["userId"]),

  wishlist: defineTable({
    userId: v.id("users"),
    title: v.string(),
    price: v.number(),
    item: v.string(),
    projectedDate: v.string(),
    link: v.optional(v.string()),
    savedAmount: v.optional(v.number()),
    priority: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  wishlistSavings: defineTable({
    userId: v.id("users"),
    wishlistId: v.id("wishlist"),
    amount: v.number(),
    savedAt: v.string(),
  })
    .index("by_wishlist", ["wishlistId"])
    .index("by_user", ["userId"]),
});