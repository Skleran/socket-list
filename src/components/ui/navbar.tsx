import Link from "next/link";
import { Button } from "./button";
import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import ChangeThemeTabs from "./theme-selector";
import UserBox from "./animated-user-box";
import LoginPopover from "./login-popover";

export default async function Navbar() {
  return (
    <nav className="w-full flex justify-center mb-4 border-b-1 ">
      <div className="w-full mt-2 h-12 flex items-center justify-between">
        <Button variant={"link"} className="p-0 py-1 m-0" asChild>
          <Link href={"/"} className="h-fit">
            skleran list
          </Link>
        </Button>
        {(await isAuthenticatedNextjs()) ? (
          <UserBox />
        ) : (
          <div className="flex items-center gap-2">
            <ChangeThemeTabs animationKey="theme" key={"theme"} />
            <LoginPopover />
          </div>
        )}
      </div>
    </nav>
  );
}
