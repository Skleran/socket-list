"use client";

import DefaultList from "@/components/ui/default-list";
import { useParams } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { ListType } from "../page";
import Checklist from "@/components/ui/checklist";
import { Id } from "../../../convex/_generated/dataModel";
import ShoppingList from "@/components/ui/shopping-list";

export default function ListPage() {
  const params = useParams<{ listId: string }>();
  const listId = params.listId as Id<"lists">;
  const list = useQuery(api.lists.getById, { listId });
  const [type, setType] = useState<ListType | "">("");

  useEffect(() => {
    if (list?.type) {
      setType(list.type as ListType);
    }
  }, [list]);

  if (!list) {
    return <p className="animate-spin w-fit">|</p>;
  }

  if (list === null) {
    return <p>this list doesn't exist</p>;
  }

  if (type === "DEFAULT") {
    return (
      <div>
        <p className="text-xl tracking-tight font-semibold">{list.title}</p>
        <br />
        <DefaultList listId={listId} />
      </div>
    );
  }
  if (type === "CHECK") {
    return (
      <div>
        <p className="text-xl tracking-tight font-semibold">{list.title}</p>
        <br />
        <Checklist listId={listId} />
      </div>
    );
  }
  if (type === "SHOPPING") {
    return (
      <div>
        <p className="text-xl tracking-tight font-semibold">{list.title}</p>
        <br />
        <ShoppingList listId={listId} />
      </div>
    );
  }
}
