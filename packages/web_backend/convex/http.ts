import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

function jsonResponse(
  data: any,
  status = 200,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:5173",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      ...extraHeaders,
    },
  });
}

http.route({
  pathPrefix: "/api/",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return jsonResponse({}, 204);
  }),
});

async function getAuthenticatedUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthenticated");
  }
  return identity;
}

function getEmptyProfile() {
  return {
    username: "",
    email: "",
    gender: "",
    dob: "",
    pfp: "",
  };
}


http.route({
  path: "/api/profile",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const identity = await getAuthenticatedUser(ctx);
    let profile = await ctx.runQuery(internal.profile.getByUser, {
      userId: identity.subject,
    });

    // Auto-create if missing
    if (!profile) {
      await ctx.runMutation(internal.profile.create, {
        userId: identity.subject,
        ...getEmptyProfile(),
      });
      profile = await ctx.runQuery(internal.profile.getByUser, {
        userId: identity.subject,
      });
    }

    return jsonResponse(profile);
  }),
});

http.route({
  path: "/api/profile",
  method: "PUT",
  handler: httpAction(async (ctx, request) => {
    const identity = await getAuthenticatedUser(ctx);
    const body = await request.json();

    await ctx.runMutation(internal.profile.updateProfile, {
      userId: identity.subject,
      updates: body,
    });

    const profile = await ctx.runQuery(internal.profile.getByUser, {
      userId: identity.subject,
    });

    return jsonResponse(profile);
  }),
});

export default http;