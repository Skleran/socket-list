"use client";

import { useParams } from "next/navigation";

export default function ListPage() {
  const params = useParams<{ listId: string }>();
  return <div>this is the page of list with id: {params.listId}</div>;
}
