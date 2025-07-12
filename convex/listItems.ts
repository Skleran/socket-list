import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
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
      throw new Error("this list belongs to another user");
    }
    const listItems = await ctx.db
      .query("listItems")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();
    return listItems.reverse();
  },
});

export const createDefaultListItem = mutation({
  args: {
    listId: v.id("lists"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const list = await ctx.db.get(args.listId);
    if (!userId) {
      throw new Error("unauthorized");
    }
    if (!list || list.type !== "DEFAULT") {
      throw new Error("Invalid list type");
    }
    if (userId !== list.userId) {
      throw new Error("this list belongs to another user");
    }
    // add validation logic for guest users

    return ctx.db.insert("listItems", {
      listId: args.listId,
      content: args.content,
      userId,
      updatedAt: Date.now(),
    });
  },
});

export const createChecklistItem = mutation({
  args: {
    listId: v.id("lists"),
    content: v.string(),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const list = await ctx.db.get(args.listId);
    if (!userId) {
      throw new Error("unauthorized");
    }
    if (!list || list.type !== "CHECK") {
      throw new Error("Invalid list type");
    }
    if (userId !== list.userId) {
      throw new Error("this list belongs to another user");
    }

    return ctx.db.insert("listItems", {
      listId: args.listId,
      content: args.content,
      isCompleted: args.isCompleted,
      userId,
      updatedAt: Date.now(),
    });
  },
});

export const createShoppingListItem = mutation({
  args: {
    listId: v.id("lists"),
    content: v.string(),
    quantity: v.number(),
    shopName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const list = await ctx.db.get(args.listId);
    if (!userId) {
      throw new Error("unauthorized");
    }
    if (!list || list.type !== "SHOPPING") {
      throw new Error("Invalid list type");
    }
    if (userId !== list.userId) {
      throw new Error("this list belongs to another user");
    }

    return ctx.db.insert("listItems", {
      listId: args.listId,
      content: args.content,
      quantity: args.quantity,
      shopName: args.shopName,
      userId,
      updatedAt: Date.now(),
    });
  },
});
