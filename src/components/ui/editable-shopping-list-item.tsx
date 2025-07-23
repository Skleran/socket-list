import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import EditableListBase from "./editable-list-base";
import DeleteListItemButton from "./delete-list-item-button";
import { Separator } from "./separator";

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
      <div className="w-full grid grid-cols-[1fr_auto_1fr_auto_1fr_auto] items-center gap-0">
        <EditableListBase
          value={content}
          onSave={(val: string) =>
            updateItem({ listItemId: _id, content: val, shopName, quantity })
          }
        />
        <Separator orientation="vertical" className="mx-2" />
        <EditableListBase
          value={shopName}
          onSave={(val: string) =>
            updateItem({ listItemId: _id, content, shopName: val, quantity })
          }
          className="text-center"
        />
        <Separator orientation="vertical" className="mx-2" />
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
          className="text-end pr-2"
        />
        <div className="flex justify-end">
          <DeleteListItemButton _id={_id} />
        </div>
      </div>
    </li>
  );
}
