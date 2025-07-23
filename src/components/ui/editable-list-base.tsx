import React, {
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  FormEvent,
} from "react";

import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onSave: (val: string) => void;
  numeric?: boolean;
  className?: string;
};

export default function EditableListBase({
  value,
  onSave,
  numeric,
  className,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState(value);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing) {
      const el = divRef.current;
      if (el) {
        el.focus();

        // Select all text inside
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }, [editing]);

  const cancelEdit = () => {
    setCurrent(value);
    if (divRef.current) {
      divRef.current.textContent = value;
    }
    setEditing(false);
  };

  const handleSave = async () => {
    const trimmed = current.trim();
    if (trimmed && trimmed !== value) {
      onSave(trimmed);
    }
    setEditing(false);
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLDivElement>) => {
    if (!editing && e.key === "Enter") {
      e.preventDefault();
      setEditing(true);
      return;
    }

    if (numeric && editing) {
      const allowed =
        e.key === "Backspace" ||
        e.key === "Delete" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "Home" ||
        e.key === "End" ||
        e.key === "Tab" ||
        /^[0-9]$/.test(e.key);

      if (!allowed && e.key !== "Enter" && e.key !== "Escape") {
        e.preventDefault();
        return;
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      await handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  };

  const handleInput = (e: FormEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.textContent || "";

    // Additional validation for numeric input
    if (numeric && editing) {
      const cleanValue = newValue.replace(/[^0-9]/g, "");
      if (cleanValue !== newValue) {
        e.currentTarget.textContent = cleanValue;
        setCurrent(cleanValue);
        return;
      }
    }

    setCurrent(newValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (numeric) {
      const text = e.clipboardData.getData("text");
      const cleanText = text.replace(/[^0-9]/g, "");

      if (cleanText !== text) {
        e.preventDefault();

        // Insert only the numeric characters
        if (cleanText) {
          document.execCommand("insertText", false, cleanText);
        }
      }
    }
  };

  useEffect(() => {
    if (editing) {
      setTimeout(() => {
        divRef.current?.focus();
      }, 0);
    }
  }, [editing]);

  useEffect(() => {
    setCurrent(value);
  }, [value]);

  return (
    <div
      ref={divRef}
      contentEditable={editing}
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onBlur={cancelEdit}
      onClick={() => setEditing(true)}
      onPaste={handlePaste}
      role="textbox"
      tabIndex={0}
      inputMode={numeric ? "numeric" : "text"}
      className={cn(
        `w-full h-fit hover:bg-accent px-1 py-0.5 transition-all rounded-sm outline-none ${
          editing
            ? "focus-visible:border-ring focus-visible:ring-accent-foreground/75 focus-visible:ring-[2px]"
            : "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        }`,
        className
      )}
    >
      {value}
    </div>
  );
}
