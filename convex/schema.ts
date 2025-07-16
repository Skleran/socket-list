import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  lists: defineTable({
    title: v.string(),
    userId: v.id("users"),
    type: v.union(
      v.literal("DEFAULT"),
      v.literal("CHECK"),
      v.literal("SHOPPING")
    ),
    visibility: v.union(
      v.literal("private"), // only owner
      v.literal("public-read"), // anyone with the link can view
      v.literal("public-edit") // anyone with the link can edit
    ),
    // description: v.optional(v.string()),
    // createdAt: v.number(),
    updatedAt: v.number(), //updatedAt: Date.now(),
  }).index("by_user", ["userId"]),

  listItems: defineTable({
    listId: v.id("lists"),
    userId: v.id("users"),
    content: v.string(),
    isCompleted: v.optional(v.boolean()),
    quantity: v.optional(v.number()),
    shopName: v.optional(v.string()),
    // shopName: v.union(v.literal("FILE"), v.literal("BIM"), v.literal("A101"), v.literal("TARIM KREDI")),
    // order: v.number(), // for ordering items
    // createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_list", ["listId"]),

  tasks: defineTable({
    isCompleted: v.boolean(),
    text: v.string(),
  }),

  todos: defineTable({ text: v.string(), userId: v.id("users") }),
});
