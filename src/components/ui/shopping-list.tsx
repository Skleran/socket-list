import { useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import ShoppingListDialog from "./shopping-list-dialog";
import EditableShoppingListItem from "./editable-shopping-list-item";
import { useListPermissions } from "@/hooks/useListPermission";
import { Dot } from "lucide-react";

type Props = {
  listId: Id<"lists">;
};

export default function ShoppingList({ listId }: Props) {
  const listItems = useQuery(api.listItems.getListItems, { listId });
  const { canEdit } = useListPermissions(listId);

  return (
    <div className="w-full">
      {listItems === undefined ? (
        <p className="animate-spin w-fit ml-6">|</p>
      ) : listItems.length === 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground">no items</p>
          {canEdit && <ShoppingListDialog listId={listId} />}
        </div>
      ) : (
        <ul className="flex flex-col gap-3 list-disc ml-6">
          {listItems.map((item) =>
            canEdit ? (
              <EditableShoppingListItem
                key={item._id}
                _id={item._id}
                content={item.content}
                shopName={item.shopName}
                quantity={item.quantity}
              />
            ) : (
              <li
                key={item._id}
                className="w-full grid grid-cols-[auto_1fr_auto_20%_auto_1fr_auto] items-center gap-0"
              >
                <Dot className="size-7" />
                {item.content}
                <p className="text-center text-muted-foreground">|</p>
                <p className="text-center">{item.shopName}</p>

                <p className="text-center text-muted-foreground">|</p>
                <p className="text-end pr-6">{item.quantity}</p>
              </li>
            )
          )}
          {canEdit && (
            <li className="w-full">
              <ShoppingListDialog listId={listId} />
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
