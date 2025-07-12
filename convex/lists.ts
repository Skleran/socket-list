import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createList = mutation({
  args: {
    title: v.string(),
    type: v.union(
      v.literal("DEFAULT"),
      v.literal("CHECK"),
      v.literal("SHOPPING")
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
      userId,
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
