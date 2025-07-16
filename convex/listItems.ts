import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getListItems = query({
  args: {
    listId: v.id("lists"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const list = await ctx.db.get(args.listId);
    // if (!userId) {
    //   throw new Error("unauthorized");
    // }
    if (!list) {
      throw new Error("list doesn't exist");
    }
    // if (userId !== list.userId) {
    //   throw new Error("this list belongs to another user");
    // }
    const listItems = await ctx.db
      .query("listItems")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();
    return listItems.reverse();
  },
});

export const deleteListItem = mutation({
  args: {
    listItemId: v.id("listItems"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const listItem = await ctx.db.get(args.listItemId);
    if (!userId) {
      throw new Error("unauthorized");
    }
    if (!listItem) {
      throw new Error("list item doesn't exist");
    }
    if (userId !== listItem.userId) {
      throw new Error("this item belongs to another user");
    }

    return ctx.db.delete(args.listItemId);
  },
});

export const getPreviewItems = query({
  args: { listId: v.id("lists") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("listItems")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .order("asc")
      .take(3);
  },
});

// default list item functions
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

export const updateDefaultItem = mutation({
  args: {
    listItemId: v.id("listItems"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const listItem = await ctx.db.get(args.listItemId);
    if (!userId) {
      throw new Error("unauthorized");
    }
    if (!listItem) {
      throw new Error("list item doesn't exist");
    }
    if (userId !== listItem.userId) {
      throw new Error("this item belongs to another user");
    }

    return ctx.db.patch(args.listItemId, {
      content: args.content,
      updatedAt: Date.now(),
    });
  },
});

// checklist item functions
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

export const updateCompletionChecklistItem = mutation({
  args: {
    listItemId: v.id("listItems"),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const listItem = await ctx.db.get(args.listItemId);
    if (!userId) {
      throw new Error("unauthorized");
    }
    if (!listItem) {
      throw new Error("list item doesn't exist");
    }
    if (userId !== listItem.userId) {
      throw new Error("this item belongs to another user");
    }

    return ctx.db.patch(args.listItemId, {
      isCompleted: args.isCompleted,
      updatedAt: Date.now(),
    });
  },
});

export const updateChecklistItem = mutation({
  args: {
    listItemId: v.id("listItems"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const listItem = await ctx.db.get(args.listItemId);
    if (!userId) {
      throw new Error("unauthorized");
    }
    if (!listItem) {
      throw new Error("list item doesn't exist");
    }
    if (userId !== listItem.userId) {
      throw new Error("this item belongs to another user");
    }

    return ctx.db.patch(args.listItemId, {
      content: args.content,
      updatedAt: Date.now(),
    });
  },
});

// shopping list item functions
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

export const updateShoppingListItem = mutation({
  args: {
    listItemId: v.id("listItems"),
    content: v.string(),
    shopName: v.string(),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const listItem = await ctx.db.get(args.listItemId);
    if (!userId) {
      throw new Error("unauthorized");
    }
    if (!listItem) {
      throw new Error("list item doesn't exist");
    }
    if (userId !== listItem.userId) {
      throw new Error("this item belongs to another user");
    }

    return ctx.db.patch(args.listItemId, {
      content: args.content,
      shopName: args.shopName,
      quantity: args.quantity,
      updatedAt: Date.now(),
    });
  },
});
