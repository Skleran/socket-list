import { useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import DefaultListDialog from "./default-list-dialog";
import EditableDefaultListItem from "./editable-default-list-item";

type Props = {
  listId: Id<"lists">;
};

export default function DefaultList({ listId }: Props) {
  const listItems = useQuery(api.listItems.getListItems, { listId });

  return (
    <div className="w-full">
      {listItems === undefined ? (
        <p className="animate-spin w-fit ml-6">|</p>
      ) : listItems.length === 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground">no items</p>
          <DefaultListDialog listId={listId} />
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {listItems.map((item) => (
            <EditableDefaultListItem
              key={item._id}
              _id={item._id}
              content={item.content}
            />
          ))}
          <li className="w-full">
            <DefaultListDialog listId={listId} />
          </li>
        </ul>
      )}
    </div>
  );
}
