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
import React, { useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";

export type ListType = "DEFAULT" | "CHECK" | "SHOPPING";

export default function Lists() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ListType | "">("");
  const [open, setOpen] = useState(false);
  const createList = useMutation(api.lists.createList);
  const lists = useQuery(api.lists.get);

  const selectTriggerRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !type) {
      return;
    }

    try {
      await createList({
        title: title.trim(),
        type: type as ListType,
      });

      setTitle("");
      setType("");
      setOpen(false);
    } catch (err) {
      console.error("Error creating list:", err);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-auto gap-4">
      {lists?.map(({ _id, title, type }) => (
        <Link href={_id} className="rounded-xl" key={_id}>
          <Card className="aspect-square p-2 text-center">
            <div className="flex flex-col m-auto gap-3">
              <p>title: {title}</p>
              <p>type: {type}</p>
            </div>
          </Card>{" "}
        </Link>
      ))}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Card className="aspect-square grid grid-rows-3 gap-0 hover:cursor-pointer">
            <div></div>
            <Plus className="m-auto size-10" />
            <p className="mx-auto text-sm">create new list</p>
          </Card>
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
                {/* add: after writing title press enter to focus select */}
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
