import React from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { ListType } from "@/app/page";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { api } from "../../../convex/_generated/api";
import { Card } from "./card";
import Link from "next/link";
import { CheckSquare, ShoppingCart, List } from "lucide-react";
import { motion } from "framer-motion";
import LeaveCollaboratedListButton from "./leave-collaborated-list-button";

type Props = {
  listId: Id<"lists">;
  title: string;
  type: ListType;
};

export default function HomeCollaboratedListCard({
  listId,
  title,
  type,
}: Props) {
  const items = useQuery(api.listItems.getPreviewItems, { listId });

  const typeIconMap: Record<ListType, React.ReactNode> = {
    DEFAULT: <List className="w-4 h-4 text-muted-foreground flex-none" />,
    CHECK: <CheckSquare className="w-4 h-4 text-muted-foreground flex-none" />,
    SHOPPING: (
      <ShoppingCart className="w-4 h-4 text-muted-foreground flex-none" />
    ),
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={listId} className="rounded-xl" key={listId}>
        <Card className="aspect-square p-2">
          <div className="px-2 py-1 sm:px-3.5 sm:py-1.5">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 border-b pb-1 mb-2">
              {typeIconMap[type]}
              <h2 className="text-lg text-center font-semibold tracking-tight text-balance leading-6 py-0.5 line-clamp-2 break-words">
                {title}
              </h2>
              <LeaveCollaboratedListButton _id={listId} />
            </div>
            <ul className="list-disc ml-4 text-sm space-y-1">
              {items?.map((item) => (
                <li key={item._id}>
                  <p className="line-clamp-1 break-words">{item.content}</p>
                </li>
              ))}
              {items && items.length === 0 && (
                <li className="text-muted-foreground italic">empty list</li>
              )}
            </ul>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
