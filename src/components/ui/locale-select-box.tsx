"use client";

import React from "react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { setLocaleClient } from "@/utils/set-locale-client";

export default function LocaleSelectBox() {
  const t = useTranslations();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{t("LocaleSwitcher.label")}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 grid grid-cols-2 gap-2">
        <Button onClick={() => setLocaleClient("tr")}>Türkçe</Button>
        <Button onClick={() => setLocaleClient("en")}>English</Button>
      </PopoverContent>
    </Popover>
  );
}
