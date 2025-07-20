"use client";

import { useQuery } from "convex-helpers/react/cache/hooks";
import { api } from "../../convex/_generated/api";
import NewListDialog from "@/components/ui/new-list-dialog";
import HomeListCard from "@/components/ui/home-list-card";
import { AnimatePresence } from "framer-motion";
import HomeCollaboratedListCard from "@/components/ui/home-collaborated-list-card";

export type ListType = "DEFAULT" | "CHECK" | "SHOPPING";
export type Visibility = "private" | "public-read" | "public-edit";

export default function Lists() {
  const lists = useQuery(api.lists.get);
  const collabLists = useQuery(api.collaborators.getCollaboratedLists);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 grid-rows-auto gap-3 sm:gap-4 mb-6">
        <AnimatePresence>
          {lists?.map(({ _id, title, type }) => (
            <HomeListCard listId={_id} title={title} type={type} key={_id} />
          ))}
          <NewListDialog />
        </AnimatePresence>
      </div>
      {!collabLists ? (
        <p className="animate-spin w-fit">|</p>
      ) : collabLists?.length === 0 ? (
        <></>
      ) : (
        <>
          <div className="border-b-1 w-full mb-4" />
          <h4 className="text-xl font-semibold tracking-tight mb-3">
            collaborated lists
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 grid-rows-auto gap-3 sm:gap-4 mb-6">
            <AnimatePresence>
              {collabLists?.map(({ _id, title, type }) => (
                <HomeCollaboratedListCard
                  listId={_id}
                  title={title}
                  type={type}
                  key={_id}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
