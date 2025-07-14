"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import NewListDialog from "@/components/ui/new-list-dialog";
import HomeListCard from "@/components/ui/home-list-card";

export type ListType = "DEFAULT" | "CHECK" | "SHOPPING";

export default function Lists() {
  const lists = useQuery(api.lists.get);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 grid-rows-auto gap-3 sm:gap-4">
      {lists?.map(({ _id, title, type }) => (
        <HomeListCard listId={_id} title={title} type={type} key={_id} />
      ))}

      <NewListDialog />
    </div>
  );
}
