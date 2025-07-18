import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { MoreHorizontal } from "lucide-react";
import { Select, SelectGroup, SelectLabel } from "./select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Visibility } from "@/app/page";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import CollabsList from "./collabs-list";

type Props = {
  currentVisibility: Visibility;
  listId: Id<"lists">;
};

export default function ManageListButton({ currentVisibility, listId }: Props) {
  const [visibility, setVisibility] = useState<Visibility>(
    currentVisibility as Visibility
  );

  const updateVisibility = useMutation(api.lists.updateListVisibility);

  // const updateVisibilityHandler = async () => {
  //   try {
  //     await updateVisibility({
  //       visibility: visibility as Visibility,
  //       listId: listId,
  //     });
  //   } catch (err) {
  //     console.error("error updating visiblitiy: ", err);
  //   }
  // };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <MoreHorizontal className="size-5.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">list settings</h4>
          </div>
          <div className="grid gap-2 w-full">
            {/* <p className="text-muted-foreground text-sm">
              select list visibility
            </p> */}
            <Select
              value={visibility}
              onValueChange={(value) => {
                const newVisibility = value as Visibility;
                setVisibility(newVisibility);
                updateVisibility({
                  visibility: newVisibility,
                  listId,
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue defaultValue={visibility} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>select list visibility</SelectLabel>
                  <SelectItem value="private">private</SelectItem>
                  <SelectItem value="public-read">public read-only</SelectItem>
                  <SelectItem value="public-edit">public edit</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="border-b-1 my-1" />
          <div className="space-y-2">
            <h4 className="leading-none font-medium">collaborators</h4>
          </div>
          <CollabsList listId={listId} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
