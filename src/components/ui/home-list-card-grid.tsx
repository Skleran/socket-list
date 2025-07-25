import React from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { ListType } from "@/app/page";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { api } from "../../../convex/_generated/api";
import { Card } from "./card";
// import Link from "next/link";
import { CheckSquare, ShoppingCart, List } from "lucide-react";
// import DeleteListButton from "./delete-list-button";
import AnimatedListToolbox from "./animated-list-toolbox";
import { useRouter } from "next/navigation";

type Props = {
  listId: Id<"lists">;
  title: string;
  type: ListType;
};

export default function HomeListCardGrid({ listId, title, type }: Props) {
  const items = useQuery(api.listItems.getPreviewItems, { listId });

  const typeIconMap: Record<ListType, React.ReactNode> = {
    DEFAULT: <List className="w-4 h-4 text-muted-foreground flex-none" />,
    CHECK: <CheckSquare className="w-4 h-4 text-muted-foreground flex-none" />,
    SHOPPING: (
      <ShoppingCart className="w-4 h-4 text-muted-foreground flex-none" />
    ),
  };

  const router = useRouter();

  return (
    <div>
      <div className="rounded-xl" key={listId}>
        <Card className="aspect-square p-2">
          <div className="px-2 py-1 sm:px-3.5 sm:py-1.5 h-full">
            <div className="grid grid-cols-[16px_1fr_16px] items-center gap-2 border-b pb-1 mb-2">
              {typeIconMap[type]}
              <h2
                className="text-lg text-center font-semibold tracking-tight text-balance leading-6 py-0.5 line-clamp-2 break-words hover:cursor-pointer"
                onClick={() => router.push(`/${listId}`)}
              >
                {title}
              </h2>
              <div className="relative left-2">
                <AnimatedListToolbox listId={listId} />
              </div>
            </div>
            <div className="h-[80%] overflow-hidden">
              <ul
                className="list-disc ml-4 text-sm space-y-1 h-full hover:cursor-pointer"
                onClick={() => router.push(`/${listId}`)}
              >
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
          </div>
        </Card>
      </div>
    </div>
  );
}
