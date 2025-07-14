import React from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { ListType } from "@/app/page";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card } from "./card";
import Link from "next/link";
import { CheckSquare, ShoppingCart, List } from "lucide-react";

type Props = {
  listId: Id<"lists">;
  title: string;
  type: ListType;
};

export default function HomeListCard({ listId, title, type }: Props) {
  const items = useQuery(api.listItems.getPreviewItems, { listId });

  const typeIconMap: Record<ListType, React.ReactNode> = {
    DEFAULT: <List className="w-4 h-4 text-muted-foreground flex-none" />,
    CHECK: <CheckSquare className="w-4 h-4 text-muted-foreground flex-none" />,
    SHOPPING: (
      <ShoppingCart className="w-4 h-4 text-muted-foreground flex-none" />
    ),
  };

  return (
    <Link href={listId} className="rounded-xl" key={listId}>
      <Card className="aspect-square p-2">
        <div className="px-2 py-1 sm:px-4 sm:py-2">
          {/* <h2 className="text-lg text-center border-b pb-1 mb-2 line-clamp-2 break-words">
            {title}
          </h2> */}
          <div className="flex items-center gap-2 border-b pb-1 mb-2">
            {typeIconMap[type]}
            <h2 className="text-lg font-semibold tracking-tight text-balance leading-6 py-0.5 line-clamp-2 break-words">
              {title}
            </h2>
          </div>
          <ul className="list-disc ml-4 text-sm space-y-1">
            {items?.map((item) => (
              <li key={item._id}>
                <p className="line-clamp-1 break-words">{item.content}</p>
              </li>
            ))}
            {items && items.length === 0 && (
              <li className="text-muted-foreground">empty list</li>
            )}
          </ul>
        </div>
      </Card>
    </Link>
  );
}
