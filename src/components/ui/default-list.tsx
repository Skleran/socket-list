import { useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import DefaultListDialog from "./default-list-dialog";
import EditableDefaultListItem from "./editable-default-list-item";
import { useListPermissions } from "@/hooks/useListPermission";
import { Dot } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  listId: Id<"lists">;
};

export default function DefaultList({ listId }: Props) {
  const listItems = useQuery(api.listItems.getListItems, { listId });
  const { canEdit } = useListPermissions(listId);
  const t = useTranslations();

  return (
    <div className="w-full">
      {listItems === undefined ? (
        <p className="animate-spin w-fit ml-6">|</p>
      ) : listItems.length === 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground">{t("ListItems.no_item")}</p>
          {canEdit && <DefaultListDialog listId={listId} />}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {listItems.map((item) =>
            canEdit ? (
              <EditableDefaultListItem
                key={item._id}
                _id={item._id}
                content={item.content}
              />
            ) : (
              <li key={item._id} className="flex items-center gap-1">
                <Dot className="size-7" />
                {item.content}
              </li>
            )
          )}
          {canEdit && (
            <li className="w-full">
              <DefaultListDialog listId={listId} />
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
