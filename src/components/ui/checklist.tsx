import { useMutation, useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import ChecklistDialog from "./checklist-dialog";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

type Props = {
  listId: Id<"lists">;
};

export default function Checklist({ listId }: Props) {
  const listItems = useQuery(api.listItems.getListItems, { listId });
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

  return (
    <div className="w-full">
      {listItems === undefined ? (
        <p className="animate-spin w-fit">|</p>
      ) : listItems.length === 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground">no items</p>
          <ChecklistDialog listId={listId} />
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {listItems.map((item) => (
            <li key={item._id} className="flex items-center gap-3">
              <Checkbox
                id={item._id}
                checked={item.isCompleted}
                onCheckedChange={(checked) => {
                  updateCompletion({
                    listItemId: item._id,
                    isCompleted: !!checked,
                  });
                }}
              />
              <Label
                htmlFor={item._id}
                className={`${item.isCompleted ? "text-muted-foreground" : ""}`}
              >
                {item.content}
              </Label>
            </li>
          ))}
          <li className="w-full">
            <ChecklistDialog listId={listId} />
          </li>
        </ul>
      )}
    </div>
  );
}
