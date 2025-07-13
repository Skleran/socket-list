import React, {
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  FormEvent,
} from "react";

type Props = {
  value: string;
  onSave: (val: string) => void;
  numeric?: boolean;
};

export default function EditableListBase({ value, onSave, numeric }: Props) {
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
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
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
    setCurrent(e.currentTarget.textContent || "");
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (numeric) {
      const text = e.clipboardData.getData("text");
      if (!/^\d+$/.test(text)) {
        e.preventDefault();
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
      className={`w-full h-fit hover:bg-accent focus:bg-accent px-1 py-0.5 transition-colors rounded-sm outline-none ${
        editing
          ? "focus:ring focus:ring-accent-foreground"
          : "focus:ring focus:ring-accent-foreground/40"
      }`}
    >
      {value}
    </div>
  );
}
