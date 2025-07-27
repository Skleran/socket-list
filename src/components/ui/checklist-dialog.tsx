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
import { useTranslations } from "next-intl";

type Props = {
  listId: Id<"lists">;
};

export default function ChecklistDialog({ listId }: Props) {
  const createItem = useMutation(api.listItems.createChecklistItem);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const t = useTranslations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    try {
      await createItem({
        listId: listId,
        content: content.trim(),
        isCompleted: false,
      });

      setContent("");
      setOpen(false);
    } catch (err) {
      console.error("Error creating item: ", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">{t("ListItems.new_item_trigger")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>{t("ListItems.newItemDialog_title")}</DialogTitle>
            <DialogDescription>
              {t("ListItems.newItemDialog_description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="content">{t("ListItems.lbl_content")}</Label>
              <Input
                id="content"
                name="item-content"
                value={content}
                placeholder={t("ListItems.ph_content")}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("ListItems.btn_cancel")}</Button>
            </DialogClose>
            <Button type="submit">{t("ListItems.btn_submit")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
