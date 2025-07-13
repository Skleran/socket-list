import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import EditableListBase from "./editable-list-base";
import { Checkbox } from "./checkbox";

type Props = {
  _id: Id<"listItems">;
  content: string;
  isCompleted: boolean | undefined;
  listId: Id<"lists">;
};

export default function EditableChecklistItem({
  _id,
  content,
  isCompleted,
  listId,
}: Props) {
  const updateCompletion = useMutation(
    api.listItems.updateCompletionChecklistItem
  ).withOptimisticUpdate((store, { listItemId, isCompleted }) => {
    const items = store.getQuery(api.listItems.getListItems, { listId });

    if (!items) return;

    const updatedItems = items.map((item) =>
      item._id === listItemId ? { ...item, isCompleted } : item
    );

    store.setQuery(api.listItems.getListItems, { listId }, updatedItems);
  });
  const updateItem = useMutation(api.listItems.updateChecklistItem);

  return (
    <li key={_id} className="flex items-center gap-3">
      <Checkbox
        id={_id}
        checked={isCompleted}
        onCheckedChange={(checked) => {
          updateCompletion({
            listItemId: _id,
            isCompleted: !!checked,
          });
        }}
      />
      <EditableListBase
        value={content}
        onSave={(val: string) =>
          updateItem({
            listItemId: _id,
            content: val,
          })
        }
      />
    </li>
  );
}
