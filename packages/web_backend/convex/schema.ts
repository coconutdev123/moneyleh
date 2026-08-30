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
  }).index("by_user", ["userId"]),

});