import { createFileRoute } from "@tanstack/react-router";
// import { SignIn } from "~/components/SignIn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";

export const Route = createFileRoute("/another")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(convexQuery(api.tasks.get, {}));

  return (
    <div>
      <p>Hello "/another"!</p>
      {/* <SignIn /> */}
      {data.map(({ _id, text }) => (
        <div key={_id}>{text}</div>
      ))}
    </div>
  );
}
