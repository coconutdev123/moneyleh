import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    normalizedEmail: v.string(),
    displayName: v.optional(v.string()),
    emailVerifiedAt: v.optional(v.number()),
    status: v.union(
      v.literal("active"),
      v.literal("disabled"),
      v.literal("pending")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_normalizedEmail", ["normalizedEmail"]),

  authIdentities: defineTable({
    userId: v.id("users"),
    provider: v.string(), // "password", "google", "github", etc.
    providerAccountId: v.string(),
    passwordHash: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_providerAccount", ["provider", "providerAccountId"]),

  sessions: defineTable({
    userId: v.id("users"),
    tokenHash: v.string(),
    expiresAt: v.number(),
    revokedAt: v.optional(v.number()),
    createdAt: v.number(),
    lastSeenAt: v.optional(v.number()),
  })
    .index("by_tokenHash", ["tokenHash"])
    .index("by_userId", ["userId"]),

  emailVerificationTokens: defineTable({
    userId: v.id("users"),
    tokenHash: v.string(),
    expiresAt: v.number(),
    consumedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_tokenHash", ["tokenHash"]),

  passwordResetTokens: defineTable({
    userId: v.id("users"),
    tokenHash: v.string(),
    expiresAt: v.number(),
    consumedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_tokenHash", ["tokenHash"]),
});