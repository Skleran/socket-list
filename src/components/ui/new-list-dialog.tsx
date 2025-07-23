"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ListType, Visibility } from "@/app/page";
import { useLayoutContext } from "./layout-context";

export default function NewListDialog() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ListType | "">("");
  const [visibility, setVisibility] = useState<Visibility | "">("");
  const [open, setOpen] = useState(false);
  const createList = useMutation(api.lists.createList);

  const selectTriggerRef = useRef<HTMLButtonElement>(null);

  const { layoutMode } = useLayoutContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !type) {
      return;
    }

    try {
      await createList({
        title: title.trim(),
        type: type as ListType,
        visibility: visibility as Visibility,
      });
      console.log(title + type + visibility);
      setTitle("");
      setType("");
      setVisibility("");
      setOpen(false);
    } catch (err) {
      console.log(title + type + visibility);
      console.error("Error creating list:", err);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="rounded-xl w-full">
          {layoutMode === "grid" ? (
            <Card className="aspect-square grid grid-rows-3 gap-0 hover:cursor-pointer">
              <div></div>
              <Plus className="m-auto size-10" />
              <p className="mx-auto text-sm">create new list</p>
            </Card>
          ) : (
            <Card className="grid grid-cols-[auto_auto_auto] justify-center items-center gap-4 hover:cursor-pointer h-21">
              <Plus className="size-6" />
              <p className="text-base">create new list</p>
              <div></div>
            </Card>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>create list</DialogTitle>
              <DialogDescription>-------</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="title">title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Title of the list"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      selectTriggerRef.current?.focus();
                    }
                  }}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="type">type</Label>
                <Select
                  value={type}
                  onValueChange={(value) => setType(value as ListType)}
                  required
                >
                  <SelectTrigger ref={selectTriggerRef} className="w-fit">
                    <SelectValue placeholder="Select list type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>types</SelectLabel>
                      <SelectItem value="DEFAULT">standard list</SelectItem>
                      <SelectItem value="CHECK">check list</SelectItem>
                      <SelectItem value="SHOPPING">shopping list</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="visibility">visibility</Label>
                <Select
                  value={visibility}
                  onValueChange={(value) => setVisibility(value as Visibility)}
                  required
                >
                  <SelectTrigger ref={selectTriggerRef} className="w-fit">
                    <SelectValue placeholder="Select list visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>visibility</SelectLabel>
                      <SelectItem value="private">private</SelectItem>
                      <SelectItem value="public-read">
                        public read-only
                      </SelectItem>
                      <SelectItem value="public-edit">public edit</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">cancel</Button>
              </DialogClose>
              <Button type="submit">create list</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
