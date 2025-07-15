import React, { useState } from "react";
import { Button } from "./button";
import { Trash2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

type Props = {
  _id: Id<"lists">;
};

export default function DeleteListButton({ _id }: Props) {
  const deleteList = useMutation(api.lists.deleteList);
  const [confirming, setConfirming] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!confirming) {
      setConfirming(true);

      setTimeout(() => setConfirming(false), 3000);
    } else {
      deleteList({ listId: _id });
    }
  };

  return (
    <Button
      variant={confirming ? "destructive" : "ghost"}
      size={"icon"}
      className={`transition-opacity ${
        confirming
          ? "opacity-100"
          : "opacity-30 hover:opacity-100 focus:opacity-100"
      }`}
      onClick={handleClick}
    >
      <Trash2 />
    </Button>
  );
}
