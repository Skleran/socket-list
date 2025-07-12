"use client";

import { useMutation } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { Button } from "./button";
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
import { useState } from "react";

type Props = {
  listId: Id<"lists">;
};

export default function ShoppingListDialog({ listId }: Props) {
  const createItem = useMutation(api.listItems.createShoppingListItem);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [shopName, setShopName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (quantity === 0) {
      setContent("very");
      setShopName("funny :|");
      return;
    }

    if (!content.trim() || !quantity || quantity < 0 || !shopName.trim()) {
      return;
    }

    try {
      await createItem({
        listId: listId,
        content: content.trim(),
        quantity: quantity,
        shopName: shopName.trim(),
      });

      setContent("");
      setQuantity("");
      setShopName("");
      setOpen(false);
    } catch (err) {
      console.error("Error creating item: ", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">+ add new item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>new item</DialogTitle>
            <DialogDescription>-------</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="content">item</Label>
              <Input
                id="content"
                name="item-content"
                value={content}
                placeholder="item name"
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="shopName">shop</Label>
              <Input
                id="shopName"
                name="item-shopName"
                value={shopName}
                placeholder="shop name"
                onChange={(e) => setShopName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="quantity">quantity</Label>
              <Input
                id="quantity"
                name="item-quantity"
                value={quantity}
                type="number"
                placeholder="pcs/kg"
                onChange={(e) => setQuantity(e.target.valueAsNumber)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">cancel</Button>
            </DialogClose>
            <Button type="submit">add item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
