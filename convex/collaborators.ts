import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCollaborators = query({
  args: {
    listId: v.id("lists"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const list = await ctx.db.get(args.listId);

    if (!userId) {
      throw new Error("unauthorized");
    }
    if (!list) {
      throw new Error("list doesn't exist");
    }
    if (userId !== list.userId) {
      throw new Error("only the list owner can fetch collabs");
    }

    const collabs = await ctx.db
      .query("listCollaborators")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();
    return collabs.reverse();
  },
});

export const addCollaborator = mutation({
  args: {
    // userId: v.id("users"),
    listId: v.id("lists"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("unauthorized");
    }

    const list = await ctx.db.get(args.listId);
    if (!list) {
      throw new Error("list doesn't exist");
    }
    if (userId === list.userId) {
      return;
    }
    if (list.visibility === "private") {
      throw new Error("this list is private and not joinable");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("user not found");
    }

    const existing = await ctx.db
      .query("listCollaborators")
      .withIndex("by_user_list", (q) =>
        q.eq("userId", userId).eq("listId", args.listId)
      )
      .unique();

    if (existing) {
      return existing._id; // already a collab
    }

    const role = list.visibility === "public-read" ? "viewer" : "editor";

    return await ctx.db.insert("listCollaborators", {
      userId: userId,
      listId: args.listId,
      userName: user.name ?? "unnamed user",
      role,
    });
  },
});

export const removeCollaborator = mutation({
  args: {
    userId: v.id("users"),
    listId: v.id("lists"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    const list = await ctx.db.get(args.listId);

    if (!currentUserId) {
      throw new Error("unauthorized");
    }
    if (!list) {
      throw new Error("list doesn't exist");
    }
    if (currentUserId !== list.userId) {
      throw new Error("only the owner can remove collabs");
    }

    const existing = await ctx.db
      .query("listCollaborators")
      .withIndex("by_user_list", (q) =>
        q.eq("userId", args.userId).eq("listId", args.listId)
      )
      .unique();
    if (!existing) throw new Error("collaborator not found");

    return ctx.db.delete(existing._id);
  },
});

export const updateCollabRole = mutation({
  args: {
    userId: v.id("users"),
    listId: v.id("lists"),
    role: v.union(v.literal("viewer"), v.literal("editor")),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    const list = await ctx.db.get(args.listId);

    if (!currentUserId) {
      throw new Error("unauthorized");
    }
    if (!list) {
      throw new Error("list doesn't exist");
    }
    if (currentUserId !== list.userId) {
      throw new Error("only the owner can change collab role");
    }

    const existing = await ctx.db
      .query("listCollaborators")
      .withIndex("by_user_list", (q) =>
        q.eq("userId", args.userId).eq("listId", args.listId)
      )
      .unique();

    if (!existing) throw new Error("collaborator not found");

    return ctx.db.patch(existing._id, {
      role: args.role,
    });
  },
});
