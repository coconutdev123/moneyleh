import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

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
    state: "",
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

    let profile = await ctx.runQuery(internal.profile.getByUser, {
      userId: identity.subject,
    });

    if (profile) {
      await ctx.runMutation(internal.profile.updateProfile, {
        updates: body,
      });
    } else {
      await ctx.runMutation(internal.profile.create, {
        userId: identity.subject,
        ...getEmptyProfile(),
        ...body,
      });
    }

    profile = await ctx.runQuery(internal.profile.getByUser, {
      userId: identity.subject,
    });

    return jsonResponse(profile);
  }),
});


// Each route module exposes public list/add/update/remove and internal getById.
// We reference them separately so TypeScript is happy.

// const listRoutes = [
//     { path: "education",  pub: api.education,   priv: internal.education },
//     { path: "awards",     pub: api.award,       priv: internal.award },
//     { path: "exams",      pub: api.exam,        priv: internal.exam },
//     { path: "activities", pub: api.activities,   priv: internal.activities },
//     { path: "experience", pub: api.experiences,  priv: internal.experiences },
//     { path: "overseas",   pub: api.overseas,     priv: internal.overseas },
//     { path: "licenses",   pub: api.license,      priv: internal.license },
//     { path: "languages",  pub: api.language,     priv: internal.language },
//     { path: "skills",     pub: api.skills,       priv: internal.skills },
// ];


// listRoutes.forEach(({ path, pub, priv }) => {
//   // GET /api/{path} — list all items
//   http.route({
//     path: `/api/${path}`,
//     method: "GET",
//     handler: httpAction(async (ctx) => {
//       await getAuthenticatedUser(ctx);

//       const items = await ctx.runQuery(pub.list as any, {});

//       const mapped = (items as any[]).map((item: any) => ({
//         ...item,
//         id: item._id,
//       }));

//       return jsonResponse(mapped);
//     }),
//   });

//   // POST /api/{path} — create new
//   http.route({
//     path: `/api/${path}`,
//     method: "POST",
//     handler: httpAction(async (ctx, request) => {
//       const identity = await getAuthenticatedUser(ctx);
//       const body = await request.json();

//       const _id = await ctx.runMutation(pub.add as any, {
//         item: { userId: identity.subject, ...body },
//       });

//       return jsonResponse({ ...body, id: _id });
//     }),
//   });

//   // PUT /api/{path}/:id — update existing
//   http.route({
//     path: `/api/${path}/:id`,
//     method: "PUT",
//     handler: httpAction(async (ctx, request) => {
//       const identity = await getAuthenticatedUser(ctx);
//       const url = new URL(request.url);
//       const pathParts = url.pathname.split("/");
//       const rawId = pathParts[pathParts.length - 1];

//       if (!rawId) {
//         return jsonResponse({ error: "ID required" }, 400);
//       }

//       const id = rawId as Id<any>;
//       const body = await request.json();

//       // Verify the item exists and belongs to user
//       const existing = await ctx.runQuery(priv.getById as any, { id });

//       if (!existing || (existing as any).userId !== identity.subject) {
//         return jsonResponse({ error: "Not found or unauthorized" }, 404);
//       }

//       await ctx.runMutation(pub.update as any, {
//         id,
//         updates: body,
//       });

//       // Fetch and return updated item
//       const updated = await ctx.runQuery(priv.getById as any, { id });
//       return jsonResponse(
//         updated ? { ...(updated as any), id: (updated as any)._id } : null,
//       );
//     }),
//   });

//   // DELETE /api/{path}/:id — delete
//   http.route({
//     path: `/api/${path}/:id`,
//     method: "DELETE",
//     handler: httpAction(async (ctx, request) => {
//       const identity = await getAuthenticatedUser(ctx);
//       const url = new URL(request.url);
//       const pathParts = url.pathname.split("/");
//       const rawId = pathParts[pathParts.length - 1];

//       if (!rawId) {
//         return jsonResponse({ error: "ID required" }, 400);
//       }

//       const id = rawId as Id<any>;

//       const existing = await ctx.runQuery(priv.getById as any, { id });

//       if (!existing || (existing as any).userId !== identity.subject) {
//         return jsonResponse({ error: "Not found or unauthorized" }, 404);
//       }

//       await ctx.runMutation(pub.remove as any, { id });
//       return jsonResponse({ success: true });
//     }),
//   });
// });




export default http;