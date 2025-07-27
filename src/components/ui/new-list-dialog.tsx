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
import { useTranslations } from "next-intl";

export default function NewListDialog() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ListType | "">("");
  const [visibility, setVisibility] = useState<Visibility | "">("");
  const [open, setOpen] = useState(false);
  const createList = useMutation(api.lists.createList);
  const t = useTranslations();

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
              <p className="mx-auto text-sm">
                {t("NewListDialog.btn_trigger")}
              </p>
            </Card>
          ) : (
            <Card className="grid grid-cols-[auto_auto_auto] justify-center items-center gap-4 hover:cursor-pointer h-24">
              <Plus className="size-6" />
              <p className="text-base">{t("NewListDialog.btn_trigger")}</p>
              <div></div>
            </Card>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>{t("NewListDialog.title")}</DialogTitle>
              <DialogDescription>
                {t("NewListDialog.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="title">{t("NewListDialog.lbl_title")}</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder={t("NewListDialog.ph_title")}
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
                <Label htmlFor="type">{t("NewListDialog.lbl_type")}</Label>
                <Select
                  value={type}
                  onValueChange={(value) => setType(value as ListType)}
                  required
                >
                  <SelectTrigger ref={selectTriggerRef} className="w-fit">
                    <SelectValue placeholder={t("NewListDialog.ph_type")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>
                        {t("NewListDialog.lbl_type_select")}
                      </SelectLabel>
                      <SelectItem value="DEFAULT">
                        {t("NewListDialog.type_default")}
                      </SelectItem>
                      <SelectItem value="CHECK">
                        {t("NewListDialog.type_check")}
                      </SelectItem>
                      <SelectItem value="SHOPPING">
                        {t("NewListDialog.type_shopping")}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="visibility">
                  {t("NewListDialog.lbl_visibility")}
                </Label>
                <Select
                  value={visibility}
                  onValueChange={(value) => setVisibility(value as Visibility)}
                  required
                >
                  <SelectTrigger ref={selectTriggerRef} className="w-fit">
                    <SelectValue
                      placeholder={t("NewListDialog.ph_visibility")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>
                        {t("NewListDialog.lbl_visibility_select")}
                      </SelectLabel>
                      <SelectItem value="private">
                        {t("NewListDialog.visibility_private")}
                      </SelectItem>
                      <SelectItem value="public-read">
                        {t("NewListDialog.visibility_public-read")}
                      </SelectItem>
                      <SelectItem value="public-edit">
                        {t("NewListDialog.visibility_public-edit")}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">
                  {t("NewListDialog.btn_cancel")}
                </Button>
              </DialogClose>
              <Button type="submit">{t("NewListDialog.btn_submit")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
