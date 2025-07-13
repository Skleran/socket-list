import React, { useEffect, useRef, useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

type Props = {
  listItemId: Id<"listItems">;
  content: string;
};

export default function EditableListItem({ listItemId, content }: Props) {
  const [updatedContent, setUpdatedContent] = useState(content);
  const [editing, setEditing] = useState(false);
  const updateContent = useMutation(api.listItems.updateDefaultItem);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing) {
      const el = divRef.current;
      if (el) {
        el.focus();

        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }, [editing]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!editing && e.key === "Enter") {
      e.preventDefault();
      setEditing(true);

      setTimeout(() => {
        divRef.current?.focus();
      }, 0);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      await handleUpdate();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setUpdatedContent(e.currentTarget.textContent || "");
  };

  const handleUpdate = async () => {
    if (!updatedContent.trim() || updatedContent === content) {
      setUpdatedContent(content);
      setEditing(false);
      return;
    }

    try {
      await updateContent({
        listItemId,
        content: updatedContent.trim(),
      });
    } catch (err) {
      console.error("Error updating item:", err);
    } finally {
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setUpdatedContent(content);
    if (divRef.current) {
      divRef.current.textContent = content;
    }
    setEditing(false);
  };

  const handleBlur = () => {
    handleCancel();
  };

  useEffect(() => {
    setUpdatedContent(content);
  }, [content]);

  return (
    <div
      ref={divRef}
      contentEditable={editing}
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onClick={() => {
        setEditing(true);
        setTimeout(() => {
          divRef.current?.focus();
        }, 0);
      }}
      className={`hover:bg-accent focus:bg-accent px-1 py-0.5 transition-colors rounded-sm outline-none ${
        editing
          ? "focus:ring focus:ring-accent-foreground"
          : "focus:ring focus:ring-accent-foreground/40"
      }`}
      role="textbox"
      tabIndex={0}
    >
      {content}
    </div>
  );
}
