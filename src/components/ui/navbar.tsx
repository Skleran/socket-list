import Link from "next/link";
import { Button } from "./button";
import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import UserDetails from "./user-details";

export default async function Navbar() {
  return (
    <nav className="w-full flex justify-center mb-4">
      <div className="w-full mt-2 h-12 flex items-center justify-between">
        <Button variant={"link"} className="p-0 py-1 m-0" asChild>
          <Link href={"/"} className="h-fit">
            skleran list
          </Link>
        </Button>
        {(await isAuthenticatedNextjs()) && <UserDetails />}
      </div>
    </nav>
  );
}
