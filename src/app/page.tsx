"use client";

import { useQuery } from "convex-helpers/react/cache/hooks";
import { api } from "../../convex/_generated/api";
import NewListDialog from "@/components/ui/new-list-dialog";
import { AnimatePresence } from "framer-motion";
import HomeListCardGrid from "@/components/ui/home-list-card-grid";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
import HomeListCardList from "@/components/ui/home-list-card-list";
import HomeCollaboratedListCardList from "@/components/ui/home-collaborated-list-card-list";
import HomeCollaboratedListCardGrid from "@/components/ui/home-collaborated-list-card-grid";
import { useLayoutContext } from "@/components/ui/layout-context";

export type ListType = "DEFAULT" | "CHECK" | "SHOPPING";
export type Visibility = "private" | "public-read" | "public-edit";

export default function Lists() {
  const lists = useQuery(api.lists.get);
  const collabLists = useQuery(api.collaborators.getCollaboratedLists);
  const { layoutMode } = useLayoutContext();

  return (
    <div className="w-full">
      <div
        className={`grid grid-rows-auto sm:gap-4 mb-6 ${layoutMode === "grid" ? "grid-cols-2 gap-3 sm:grid-cols-3" : "grid-cols-1 gap-4 sm:grid-cols-2"}`}
      >
        <AnimatePresence>
          {lists?.map(({ _id, title, type }) =>
            layoutMode === "grid" ? (
              <HomeListCardGrid
                listId={_id}
                title={title}
                type={type}
                key={_id}
              />
            ) : (
              <HomeListCardList
                listId={_id}
                title={title}
                type={type}
                key={_id}
              />
            )
          )}
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
          <div
            className={`grid grid-rows-auto sm:gap-4 mb-6 ${layoutMode === "grid" ? "grid-cols-2 gap-3 sm:grid-cols-3" : "grid-cols-1 gap-4 sm:grid-cols-2"}`}
          >
            <AnimatePresence>
              {collabLists?.map(({ _id, title, type }) =>
                layoutMode === "grid" ? (
                  <HomeCollaboratedListCardGrid
                    listId={_id}
                    title={title}
                    type={type}
                    key={_id}
                  />
                ) : (
                  <HomeCollaboratedListCardList
                    listId={_id}
                    title={title}
                    type={type}
                    key={_id}
                  />
                )
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
