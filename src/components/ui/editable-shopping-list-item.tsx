import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import EditableListBase from "./editable-list-base";
import DeleteListItemButton from "./delete-list-item-button";

type Props = {
  _id: Id<"listItems">;
  content: string;
  shopName: string | undefined;
  quantity: number | undefined;
};

export default function EditableShoppingListItem({
  _id,
  content,
  shopName,
  quantity,
}: Props) {
  const updateItem = useMutation(api.listItems.updateShoppingListItem);

  if (!shopName || !quantity) {
    return;
  }

  return (
    <li key={_id}>
      <div className="w-full grid grid-cols-[1fr_auto_20%_auto_1fr_auto] items-center gap-0">
        <EditableListBase
          value={content}
          onSave={(val: string) =>
            updateItem({ listItemId: _id, content: val, shopName, quantity })
          }
        />
        <p className="text-center text-muted-foreground">|</p>
        <EditableListBase
          value={shopName}
          onSave={(val: string) =>
            updateItem({ listItemId: _id, content, shopName: val, quantity })
          }
        />
        <p className="text-center text-muted-foreground">|</p>
        <EditableListBase
          value={quantity?.toString() || ""}
          numeric
          onSave={(val: string) =>
            updateItem({
              listItemId: _id,
              content,
              shopName,
              quantity: Number(val),
            })
          }
        />
        <DeleteListItemButton _id={_id} />
      </div>
    </li>
  );
}
