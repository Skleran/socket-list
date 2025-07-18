import { useMutation, useQuery } from "convex/react";
import { ScrollArea } from "./scroll-area";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Button } from "./button";
import { useState } from "react";
import { Popover, PopoverContent } from "./popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { MoreHorizontal } from "lucide-react";
import { HoldToDeleteButton } from "./hold-to-delete-button";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  listId: Id<"lists">;
};

export default function CollabsList({ listId }: Props) {
  const collabs = useQuery(api.collaborators.getCollaborators, { listId });

  const updateRole = useMutation(api.collaborators.updateCollabRole);
  const removeCollaborator = useMutation(api.collaborators.removeCollaborator);

  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const handleRemove = async (userId: Id<"users">, _id: string) => {
    setRemovedIds((prev) => new Set(prev).add(_id));
    await removeCollaborator({ listId, userId });
  };

  return (
    <div className="w-full">
      <ScrollArea className="h-52 rounded-sm border">
        <AnimatePresence>
          {collabs
            ?.filter(({ _id }) => !removedIds.has(_id))
            .map(({ _id, userName, userId, role }) => (
              <motion.div
                key={_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex p-3 items-center justify-between">
                  <div className="text-sm">{userName}</div>

                  <Popover>
                    <PopoverTrigger>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-6"
                        asChild
                      >
                        <MoreHorizontal />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm">collab role:</p>
                          <Select
                            value={role}
                            onValueChange={(value) => {
                              const newRole = value as "viewer" | "editor";
                              updateRole({ listId, role: newRole, userId });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>
                                  update collaborator role
                                </SelectLabel>
                                <SelectItem value="viewer">Viewer</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <HoldToDeleteButton
                          onHoldComplete={() => handleRemove(userId, _id)}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="border-b" />
              </motion.div>
            ))}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
