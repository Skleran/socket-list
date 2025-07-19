import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useCurrentUser } from "./useCurrentUser";

export function useListPermissions(listId: Id<"lists">) {
  const user = useCurrentUser();
  const userId = user?._id;

  const list = useQuery(api.lists.getById, { listId });

  // pass undefined when userId is not present
  const collaborators = useQuery(
    api.collaborators.getCollaborators,
    userId ? { listId } : "skip"
  );

  // early loading state or guest
  if (
    list === undefined ||
    (userId && collaborators === undefined) ||
    list === null
  ) {
    return {
      canEdit: false,
      isOwner: false,
      role: null,
      isGuest: userId === undefined,
    };
  }

  if (!userId) {
    return {
      canEdit: false,
      isOwner: false,
      role: null,
      isGuest: true,
    };
  }

  const isOwner = list.userId === userId;
  const collabEntry = collaborators?.find((c) => c.userId === userId);
  const role = isOwner ? "creator" : (collabEntry?.role ?? null);
  const canEdit = isOwner || role === "editor";

  return {
    canEdit,
    isOwner,
    role, // "viewer", "editor", "creator", or null
    isGuest: false,
  };
}
