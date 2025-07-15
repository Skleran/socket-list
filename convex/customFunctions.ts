import { Triggers } from "convex-helpers/server/triggers";
import { DataModel } from "./_generated/dataModel";
import {
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import { mutation as rawMutation } from "./_generated/server";

export const triggers = new Triggers<DataModel>();
export const deleteListCustomMutation = customMutation(
  rawMutation,
  customCtx(triggers.wrapDB)
);

triggers.register("lists", async (ctx, change) => {
  if (change.operation === "delete") {
    const listItems = await ctx.db
      .query("listItems")
      .withIndex("by_list", (q) => q.eq("listId", change.id))
      .collect();
    for (const item of listItems) {
      await ctx.db.delete(item._id);
    }
  }
});
