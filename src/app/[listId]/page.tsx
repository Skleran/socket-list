"use client";

import DefaultList from "@/components/ui/default-list";
import { useParams } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { ListType } from "../page";
import Checklist from "@/components/ui/checklist";
import { Id } from "../../../convex/_generated/dataModel";
import ShoppingList from "@/components/ui/shopping-list";
import EditableListTitle from "@/components/ui/editable-list-title";
import ManageListButton from "@/components/ui/manage-list-button";

export default function ListPage() {
  const params = useParams<{ listId: string }>();
  const listId = params.listId as Id<"lists">;
  const list = useQuery(api.lists.getById, { listId });
  const [type, setType] = useState<ListType | "">("");
  const updateListTitle = useMutation(api.lists.updateListTitle);

  useEffect(() => {
    if (list?.type) {
      setType(list.type as ListType);
    }
  }, [list]);

  if (list === null) {
    return <p>this list doesn&apos;t exist</p>;
  }

  if (!list) {
    return <p className="animate-spin w-fit">|</p>;
  }

  if (type === "DEFAULT") {
    return (
      <div>
        <div className="flex items-center gap-2 justify-between mb-4">
          <EditableListTitle
            value={list.title}
            onSave={(val: string) =>
              updateListTitle({
                listId: list._id,
                title: val,
              })
            }
          />
          <ManageListButton
            listId={list._id}
            currentVisibility={list.visibility}
          />
        </div>

        <DefaultList listId={listId} />
      </div>
    );
  }
  if (type === "CHECK") {
    return (
      <div>
        <div className="flex items-center gap-2 justify-between mb-4">
          <EditableListTitle
            value={list.title}
            onSave={(val: string) =>
              updateListTitle({
                listId: list._id,
                title: val,
              })
            }
          />
          <ManageListButton
            listId={list._id}
            currentVisibility={list.visibility}
          />
        </div>
        <Checklist listId={listId} />
      </div>
    );
  }
  if (type === "SHOPPING") {
    return (
      <div>
        <div className="flex items-center gap-2 justify-between mb-4">
          <EditableListTitle
            value={list.title}
            onSave={(val: string) =>
              updateListTitle({
                listId: list._id,
                title: val,
              })
            }
          />
          <ManageListButton
            listId={list._id}
            currentVisibility={list.visibility}
          />
        </div>
        <ShoppingList listId={listId} />
      </div>
    );
  }
}
