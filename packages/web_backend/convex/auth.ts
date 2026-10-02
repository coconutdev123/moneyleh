import { convexAuth } from "@convex-dev/auth/server";
import type { MutationCtx } from "./_generated/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";
import { normalizeUsername, validateUsername } from "../../shared/src/lib/username";
import { internal } from "./_generated/api";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password({
    profile: (params) => ({
      email: typeof params.email === "string" ? params.email : "",
      ...(typeof params.username === "string" ? { name: params.username } : {}),
    }),
  }), Google],
  callbacks: {
    afterUserCreatedOrUpdated: async (ctx: MutationCtx, args) => {
      const { userId, profile, type } = args;
      const existing = await ctx.db
        .query("profile")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first();
      if (existing) return;

      let username = "";
      const email = typeof profile.email === "string" ? profile.email : "";

      if (type === "credentials") {
        if (typeof profile.name !== "string") throw new Error("A username is required");
        username = profile.name;
        const validationError = validateUsername(username);
        if (validationError) throw new Error(validationError);
        const normalized = normalizeUsername(username);
        const profiles = await ctx.db.query("profile").collect();
        if (profiles.some((candidate) => normalizeUsername(candidate.username) === normalized)) {
          throw new Error("Username is already taken");
        }
      }

      await ctx.db.insert("profile", {
        userId,
        username,
        normalizedUsername: normalizeUsername(username),
        email,
        gender: "",
        dob: "",
        pfp: "",
        onboardingCompleted: false,
      });
      await ctx.scheduler.runAfter(0, internal.usernameFilter.rebuildUsernameFilter, {});
    },
  },
});