import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { MutationCtx } from "./_generated/server";

export async function assertCanCreateListItem(
  ctx: MutationCtx,
  listId: Id<"lists">,
  expectedType: "DEFAULT" | "CHECK" | "SHOPPING"
): Promise<{ list: any; userId: Id<"users"> }> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const list = await ctx.db.get(listId);
  if (!list || list.type !== expectedType) {
    throw new Error("Invalid list or type mismatch");
  }

  const isOwner = userId === list.userId;
  if (isOwner) {
    return { list, userId };
  }

  const collaborator = await ctx.db
    .query("listCollaborators")
    .withIndex("by_user_list", (q) =>
      q.eq("userId", userId).eq("listId", listId)
    )
    .unique();

  if (collaborator?.role === "editor") {
    return { list, userId };
  }

  throw new Error("You don’t have permission to add items to this list");
}

export async function assertCanEditListItem(
  ctx: MutationCtx,
  listItemId: Id<"listItems">
  // expectedType: "DEFAULT" | "CHECK" | "SHOPPING"
): Promise<{ listItem: any; userId: Id<"users"> }> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const listItem = await ctx.db.get(listItemId);
  if (!listItem) {
    throw new Error("Invalid list item");
  }

  const isOwner = userId === listItem.userId;
  if (isOwner) {
    return { listItem, userId };
  }

  const collaborator = await ctx.db
    .query("listCollaborators")
    .withIndex("by_user_list", (q) =>
      q.eq("userId", userId).eq("listId", listItem.listId)
    )
    .unique();

  if (collaborator?.role === "editor") {
    return { listItem, userId };
  }

  throw new Error("You don’t have permission to modify this list item");
}
