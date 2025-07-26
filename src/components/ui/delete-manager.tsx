// components/DeleteManager.tsx
"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

type PendingDelete = {
  listId: Id<"lists">;
  listName: string;
  onConfirm?: () => void;
  onUndo?: () => void;
};

export function useDeleteManager() {
  const [queue, setQueue] = useState<PendingDelete[]>([]);

  const addDeleteRequest = (item: PendingDelete) => {
    setQueue((prev) => [...prev, item]);
  };

  return {
    addDeleteRequest,
    DeleteManager: () => (
      <>
        {queue.map((item, index) => (
          <DeleteToast key={item.listId + index} {...item} />
        ))}
      </>
    ),
  };
}

function DeleteToast({ listId, listName, onConfirm, onUndo }: PendingDelete) {
  const deleteList = useMutation(api.lists.deleteList);

  // This toast will immediately render and manage its own timer
  useEffect(() => {
    const toastId = toast(`${listName} deleted`, {
      description: "The list has been removed from your view.",
      duration: 4000,
      action: {
        label: "Undo",
        onClick: () => {
          onUndo?.();
          toast.success("List restored", {
            description: `${listName} has been restored.`,
          });
        },
      },
    });

    const timeout = setTimeout(() => {
      onConfirm?.();
      void deleteList({ listId });
      toast.dismiss(toastId);
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  return null; // No visible JSX — just logic and toast
}
