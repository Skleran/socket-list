"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { ListType } from "../page";

import DefaultList from "@/components/ui/default-list";
import Checklist from "@/components/ui/checklist";
import ShoppingList from "@/components/ui/shopping-list";
import EditableListTitle from "@/components/ui/editable-list-title";
import ManageListButton from "@/components/ui/manage-list-button";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function ListPage() {
  const params = useParams<{ listId: string }>();
  const listId = params.listId as Id<"lists">;
  const user = useCurrentUser();
  const list = useQuery(api.lists.getById, { listId });
  const [type, setType] = useState<ListType | "">("");
  const updateListTitle = user ? useMutation(api.lists.updateListTitle) : null;
  const addCollab = user
    ? useMutation(api.collaborators.addCollaborator)
    : null;
  const isCreator = user && list?.userId === user._id;

  useEffect(() => {
    if (
      user &&
      list &&
      (list.visibility === "public-read" ||
        list.visibility === "public-edit") &&
      addCollab
    ) {
      addCollab({ listId }).catch((err) => {
        console.error("Failed to add collaborator:", err);
      });
    }
  }, [user, list, addCollab, listId]);

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

  const renderHeader = () => (
    <div className="flex items-center gap-2 justify-between mb-4">
      {isCreator && updateListTitle ? (
        <EditableListTitle
          value={list.title}
          onSave={(val: string) =>
            updateListTitle({
              listId: list._id,
              title: val,
            })
          }
        />
      ) : (
        <h1 className="text-xl tracking-tight font-semibold">{list.title}</h1>
      )}

      {isCreator && (
        <ManageListButton
          listId={list._id}
          currentVisibility={list.visibility}
        />
      )}
    </div>
  );

  switch (type) {
    case "DEFAULT":
      return (
        <div>
          {renderHeader()}
          <DefaultList listId={listId} />
        </div>
      );
    case "CHECK":
      return (
        <div>
          {renderHeader()}
          <Checklist listId={listId} />
        </div>
      );
    case "SHOPPING":
      return (
        <div>
          {renderHeader()}
          <ShoppingList listId={listId} />
        </div>
      );
    default:
      return <p>unknown list type</p>;
  }
}
