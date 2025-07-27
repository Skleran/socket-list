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
import { Separator } from "./separator";
import { useTranslations } from "next-intl";

type Props = {
  listId: Id<"lists">;
  title: string;
  type: ListType;
};

export default function HomeCollaboratedListCardList({
  listId,
  title,
  type,
}: Props) {
  const items = useQuery(api.listItems.getNumberOfItems, { listId });
  const t = useTranslations();

  const typeIconMap: Record<ListType, React.ReactNode> = {
    DEFAULT: <List className="size-5 text-muted-foreground flex-none" />,
    CHECK: <CheckSquare className="size-5 text-muted-foreground flex-none" />,
    SHOPPING: (
      <ShoppingCart className="size-5 text-muted-foreground flex-none" />
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
        <Card className="p-3 py-4">
          <div className="px-2 sm:px-3.5 sm:py-1.5 flex items-center justify-between gap-2">
            <div className="flex flex-col gap-2.5">
              <div className="items-center gap-2 mb-0.5">
                <h2 className="text-lg font-semibold text-balance leading-5 line-clamp-2 break-words">
                  {title}
                </h2>
              </div>
              <div className="flex space-x-2 h-5 flex-row items-center text-sm text-muted-foreground">
                {typeIconMap[type]}
                {/* <Dot className="" /> */}
                <Separator orientation="vertical" />
                {items === 0 ? (
                  <p>{t("ListCard.empty_list")}</p>
                ) : (
                  <p>
                    {items} {t("ListCard.items")}
                  </p>
                )}
              </div>
            </div>
            <div>
              <LeaveCollaboratedListButton _id={listId} />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
