import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import EditableListBase from "./editable-list-base";
import { Dot } from "lucide-react";

type Props = {
  _id: Id<"listItems">;
  content: string;
};

export default function EditableDefaultListItem({ _id, content }: Props) {
  const updateItem = useMutation(api.listItems.updateDefaultItem);

  return (
    <li key={_id} className="flex items-center gap-1">
      <Dot className="size-7" />
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
