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
};

export default function EditableListTitle({ value, onSave }: Props) {
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

    if (editing) {
      if (e.key === "Enter") {
        e.preventDefault();
        await handleSave();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelEdit();
      }
    }
  };

  const handleInput = (e: FormEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.textContent || "";
    setCurrent(newValue);
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
    <h2
      ref={divRef}
      contentEditable={editing}
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onBlur={cancelEdit}
      onClick={() => setEditing(true)}
      // onPaste={handlePaste}
      role="textbox"
      tabIndex={0}
      inputMode={"text"}
      className={`w-full hover:bg-accent transition-all rounded-sm outline-none text-xl tracking-tight font-semibold ${
        editing
          ? "focus-visible:border-ring focus-visible:ring-accent-foreground/75 focus-visible:ring-[2px]"
          : "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
      }`}
    >
      {value}
    </h2>
  );
}
