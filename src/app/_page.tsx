"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Home() {
  // const tasks = useQuery(api.tasks.get);
  const [text, setText] = useState("");
  const createTodo = useMutation(api.todos.createTodo);
  const todos = useQuery(api.todos.get);

  const deleteTodo = useMutation(api.todos.deleteTodo);

  return (
    <div className="flex flex-col items-center justify-between font-mono py-24">
      {/* {tasks?.map(({ _id, text }) => (
        <div key={_id}>
          {text} {_id}
        </div>
      ))} */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTodo({ text });
          setText("");
        }}
        className="w-full"
      >
        <div className="w-full flex flex-row gap-4">
          <Input
            type="text"
            value={text}
            required
            onChange={(e) => setText(e.target.value)}
            placeholder="write your list item"
          />
          <Button type="submit">create</Button>
        </div>

        <ul className="gap-4 flex flex-col my-8">
          {todos?.map(({ _id, text }) => (
            <li
              key={_id}
              className="flex flex-row justify-between border-1 p-1 pl-3 items-center rounded-lg"
            >
              <p>{text}</p>
              <Button
                variant={"destructive"}
                size="icon"
                type="button"
                onClick={() => deleteTodo({ id: _id })}
              >
                <X />
              </Button>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}
