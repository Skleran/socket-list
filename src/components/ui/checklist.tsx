import { useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import ChecklistDialog from "./checklist-dialog";
import EditableChecklistItem from "./editable-checklist-item";
import { useListPermissions } from "@/hooks/useListPermission";
import { Checkbox } from "./checkbox";

type Props = {
  listId: Id<"lists">;
};

export default function Checklist({ listId }: Props) {
  const listItems = useQuery(api.listItems.getListItems, { listId });
  const { canEdit } = useListPermissions(listId);

  return (
    <div className="w-full">
      {listItems === undefined ? (
        <p className="animate-spin w-fit">|</p>
      ) : listItems.length === 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground">no items</p>
          {canEdit && <ChecklistDialog listId={listId} />}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {listItems.map((item) =>
            canEdit ? (
              <EditableChecklistItem
                key={item._id}
                _id={item._id}
                content={item.content}
                isCompleted={item.isCompleted}
                listId={listId}
              />
            ) : (
              <li key={item._id} className="flex items-center gap-3.5 my-1">
                <Checkbox checked={item.isCompleted} />
                {item.content}
              </li>
            )
          )}
          {canEdit && (
            <li className="w-full">
              <ChecklistDialog listId={listId} />
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
