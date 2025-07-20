import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCollaboratedLists = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("unauthorized");
    }

    const collaborations = await ctx.db
      .query("listCollaborators")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const listIds = collaborations.map((c) => c.listId);

    const listPromises = listIds.map((id) => ctx.db.get(id));
    const lists = await Promise.all(listPromises);

    const collaboratedLists = lists
      .map((list, index) => {
        if (!list) return null;
        return {
          ...list,
          role: collaborations[index].role,
        };
      })
      .filter((list): list is NonNullable<typeof list> => list !== null);

    return collaboratedLists;
  },
});

export const getCollaborators = query({
  args: {
    listId: v.id("lists"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const list = await ctx.db.get(args.listId);

    if (!list) {
      throw new Error("list doesn't exist");
    }

    // require login
    if (!userId) {
      throw new Error("unauthorized");
    }

    // if user is owner
    if (userId === list.userId) {
      return await ctx.db
        .query("listCollaborators")
        .withIndex("by_list", (q) => q.eq("listId", args.listId))
        .collect();
    }

    // if user is a collaborator
    const isCollab = await ctx.db
      .query("listCollaborators")
      .withIndex("by_user_list", (q) =>
        q.eq("userId", userId).eq("listId", args.listId)
      )
      .unique();

    if (!isCollab) {
      return null;
    }

    return await ctx.db
      .query("listCollaborators")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();
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

export const removeSelfCollaboration = mutation({
  args: {
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

    const existing = await ctx.db
      .query("listCollaborators")
      .withIndex("by_user_list", (q) =>
        q.eq("userId", currentUserId).eq("listId", args.listId)
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
