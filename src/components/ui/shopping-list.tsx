import { useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import ShoppingListDialog from "./shopping-list-dialog";

type Props = {
  listId: Id<"lists">;
};

export default function ShoppingList({ listId }: Props) {
  const listItems = useQuery(api.listItems.getListItems, { listId });

  return (
    <div className="w-full">
      {listItems === undefined ? (
        <p className="animate-spin w-fit ml-6">|</p>
      ) : listItems.length === 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground">no items</p>
          <ShoppingListDialog listId={listId} />
        </div>
      ) : (
        <ul className="flex flex-col gap-3 list-disc ml-6">
          {listItems.map((item) => (
            <li key={item._id}>
              <div className="w-full grid grid-cols-5 gap-0">
                <p>{item.content}</p>
                <p className="text-center text-muted-foreground">|</p>
                <p className="text-center">{item.shopName}</p>
                <p className="text-center text-muted-foreground">|</p>
                <p className="text-end">{item.quantity}</p>
              </div>
            </li>
          ))}
          <li className="w-full">
            <ShoppingListDialog listId={listId} />
          </li>
        </ul>
      )}
    </div>
  );
}
