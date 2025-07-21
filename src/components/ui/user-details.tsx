import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import SignOut from "../sign-out";
import ChangeThemeTabs from "./theme-selector";
import ListLayoutSelector from "./list-layout-selector";

export default async function UserDetails() {
  const user = await fetchQuery(
    api.users.currentUser,
    {},
    { token: await convexAuthNextjsToken() }
  );

  if (!user) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger className="rounded-full">
        <img
          src={user.image || ""}
          alt="Picture of the user"
          className="size-10 rounded-full"
        />
      </PopoverTrigger>
      <PopoverContent className="w-fit flex flex-col p-2 items-center justify-center gap-3">
        <h4 className="px-2 py-1.5 pt-1 text-sm font-medium data-[inset]:pl-8 border-b">
          {user.name?.toLowerCase()}
        </h4>
        {/* <div className="bg-border -mx-1 my-1 h-px" /> */}

        <ChangeThemeTabs animationKey="change-theme" />

        <ListLayoutSelector />

        <SignOut />
      </PopoverContent>
    </Popover>
  );
}
