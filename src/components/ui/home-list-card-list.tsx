"use client";

import React from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { ListType } from "@/app/page";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { api } from "../../../convex/_generated/api";
import { Card } from "./card";
// import Link from "next/link";
import {
  CheckSquare,
  ShoppingCart,
  List,
  // Dot,
  // MoreVertical,
} from "lucide-react";
// import DeleteListButton from "./delete-list-button";
import { Separator } from "./separator";
// import { Button } from "./button";
import AnimatedListToolbox from "./animated-list-toolbox";
import { useRouter } from "next/navigation";

type Props = {
  listId: Id<"lists">;
  title: string;
  type: ListType;
};

export default function HomeListCardList({ listId, title, type }: Props) {
  const items = useQuery(api.listItems.getNumberOfItems, { listId });

  const typeIconMap: Record<ListType, React.ReactNode> = {
    DEFAULT: <List className="size-5 text-muted-foreground flex-none" />,
    CHECK: <CheckSquare className="size-5 text-muted-foreground flex-none" />,
    SHOPPING: (
      <ShoppingCart className="size-5 text-muted-foreground flex-none" />
    ),
  };

  const router = useRouter();

  return (
    <div>
      {/* <Link href={listId} className="rounded-xl" key={listId}> */}
      <Card className="p-3 py-4">
        <div className="px-2 sm:px-3.5 sm:py-1.5 flex items-center justify-between gap-8">
          <div
            className="flex flex-col gap-2.5 w-full hover:cursor-pointer"
            onClick={() => router.push(`/${listId}`)}
          >
            <div className="items-center gap-2 mb-0.5">
              <h2 className="text-lg font-semibold text-balance leading-5 line-clamp-2 break-words">
                {title}
              </h2>
            </div>
            <div className="flex space-x-2 h-5 flex-row items-center text-sm text-muted-foreground">
              {typeIconMap[type]}
              {/* <Dot className="" /> */}
              <Separator orientation="vertical" />
              {items === 0 ? <p>empty list</p> : <p>{items} items</p>}
            </div>
          </div>

          {/* <div className="border-1 border-destructive relative"> */}
          {/* <Button variant={"ghost"} size={"icon"}> */}
          {/* <MoreVertical className="size-5" /> */}
          <AnimatedListToolbox listId={listId} />
          {/* </Button> */}
          {/* </div> */}
        </div>
      </Card>
      {/* </Link> */}
    </div>
  );
}
