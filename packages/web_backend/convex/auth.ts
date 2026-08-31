import { convexAuth } from "@convex-dev/auth/server";
import { MutationCtx } from "./_generated/server";
import { Password } from "@convex-dev/auth/providers/Password";
// import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  // providers: [Password, GitHub, Google],
  providers: [Password, Google],
  callbacks: {
    afterUserCreatedOrUpdated: async (ctx: MutationCtx, args) => {
      const { userId } = args;
      const existing = await ctx.db
        .query("profile")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first();
      if (existing) return;

      const username: string = (args as any).profile?.name ?? "";
      const email: string = (args as any).profile?.email ?? "";

      await ctx.db.insert("profile", {
        userId,
        username: "",
        email: "",
        gender: "",
        dob: "",
      });
    },
  },
});