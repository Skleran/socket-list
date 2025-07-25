import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Check, Copy, MoreHorizontal, QrCode } from "lucide-react";
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
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import QRCode from "react-qr-code";

type Props = {
  currentVisibility: Visibility;
  listId: Id<"lists">;
};

export default function ManageListButton({ currentVisibility, listId }: Props) {
  const [visibility, setVisibility] = useState<Visibility>(
    currentVisibility as Visibility
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/${listId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

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
          <div className="space-y-2 flex items-center justify-between">
            <h4 className="leading-none font-medium">List Settings</h4>
            <div className="grid grid-cols-2 gap-1">
              <Button
                onClick={handleCopy}
                className={`transition-all ${copied ? "bg-green-400 hover:bg-green-400 dark:bg-green-500 hover:dark:bg-green-500" : ""}`}
                variant={"ghost"}
                size={"icon"}
              >
                {copied ? (
                  <Check />
                ) : (
                  <>
                    <Copy />
                  </>
                )}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"ghost"} size={"icon"}>
                    <QrCode />
                  </Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center justify-center gap-4 w-fit">
                  <DialogTitle className="text-lg font-medium">
                    Scan to Open List
                  </DialogTitle>
                  <QRCode
                    value={`${window.location.origin}/${listId}`}
                    size={180}
                    bgColor="transparent"
                    className="rounded-md dark:bg-accent-foreground p-4"
                  />
                </DialogContent>
              </Dialog>
            </div>
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
                  <SelectLabel>Select List Visibility</SelectLabel>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="public-read">Public Read-only</SelectItem>
                  <SelectItem value="public-edit">Public Edit</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="border-b-1 my-1" />
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Collaborators</h4>
          </div>
          <CollabsList listId={listId} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
