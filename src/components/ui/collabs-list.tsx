import { useQuery } from "convex/react";
import { Badge } from "./badge";
import { ScrollArea } from "./scroll-area";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

type Props = {
  listId: Id<"lists">;
};

export default function CollabsList({ listId }: Props) {
  const collabs = useQuery(api.collaborators.getCollaborators, { listId });

  return (
    <div className="w-full">
      <div className="">
        <ScrollArea className="h-52 rounded-sm border">
          {collabs?.map(({ _id, userName, role }) => (
            <div key={_id}>
              <div key={_id} className="flex p-3 items-end justify-between">
                <div className="text-sm">{userName}</div>
                <Badge
                  variant={`${role === "viewer" ? "secondary" : "default"}`}
                >
                  {role === "viewer" ? "viewer" : "editor"}
                </Badge>
              </div>
              <div className="border-b-1" />
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
