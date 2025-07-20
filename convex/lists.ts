import { v } from "convex/values";
import { mutation, MutationCtx, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { deleteListCustomMutation } from "./customFunctions";
import { Id } from "./_generated/dataModel";

export const createList = mutation({
  args: {
    title: v.string(),
    type: v.union(
      v.literal("DEFAULT"),
      v.literal("CHECK"),
      v.literal("SHOPPING")
    ),
    visibility: v.union(
      v.literal("private"),
      v.literal("public-read"),
      v.literal("public-edit")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("unauthorized");
    }
    return ctx.db.insert("lists", {
      title: args.title,
      type: args.type,
      visibility: args.visibility,
      userId,
      updatedAt: Date.now(),
    });
  },
});

export const updateListTitle = mutation({
  args: {
    title: v.string(),
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
      throw new Error("only the owner can change list title");
    }

    return ctx.db.patch(args.listId, {
      title: args.title,
      updatedAt: Date.now(),
    });
  },
});

export const updateListVisibility = mutation({
  args: {
    visibility: v.union(
      v.literal("private"),
      v.literal("public-read"),
      v.literal("public-edit")
    ),
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
      throw new Error("only the owner can change list visibility");
    }

    return ctx.db.patch(args.listId, {
      visibility: args.visibility,
      updatedAt: Date.now(),
    });
  },
});

export const get = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("unauthorized");
    }
    const lists = await ctx.db
      .query("lists")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return lists.reverse();
  },
});

export const getById = query({
  args: {
    listId: v.id("lists"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const list = await ctx.db.get(args.listId);
    // if (!userId) {
    //   throw new Error("unauthorized"); // Allow all users
    // }
    if (!list) {
      // throw new Error("List doesn't exist");
      return null; //Solve the issue when authenticated user tries to access non existant list !!!
    }
    // if (isCollaborator(userId, list._id)) return list;
    if (
      list.visibility === "public-read" ||
      list.visibility === "public-edit"
    ) {
      return list;
    }
    if (userId !== list.userId) {
      return null;
    }

    return list;
  },
});

export const deleteList = deleteListCustomMutation({
  args: {
    listId: v.id("lists"),
  },
  handler: async (ctx: MutationCtx, args: { listId: Id<"lists"> }) => {
    const userId = await getAuthUserId(ctx);
    const list = await ctx.db.get(args.listId);

    if (!userId) throw new Error("unauthorized");
    if (!list) throw new Error("list not found");
    if (list.userId !== userId) throw new Error("you cannot delete this list");

    await ctx.db.delete(args.listId);
  },
});
