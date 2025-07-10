import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createTodo = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("unauthorized");
    }
    return ctx.db.insert("todos", {
      text: args.text,
      userId,
    });
  },
});

export const get = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("unauthorized");
    }
    const todos = await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    return todos.reverse();
  },
});

export const deleteTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("unauthorized");
    }
    const existingTodo = await ctx.db.get(args.id);
    if (!existingTodo) {
      throw new Error("todo now found");
    }
    if (existingTodo.userId !== userId) {
      throw new Error("unauthorized - this todo belongs to another user");
    }
    return ctx.db.delete(args.id);
  },
});
