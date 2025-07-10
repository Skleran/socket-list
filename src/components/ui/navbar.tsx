import Link from "next/link";
import { Button } from "./button";
import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import UserDetails from "./user-details";

export default async function Navbar() {
  return (
    <nav className="w-full flex justify-center">
      <div className="w-full mt-2 h-12 flex items-center justify-between">
        <Button variant={"link"} className="p-0 m-0" asChild>
          <Link href={"/"}>skleran list</Link>
        </Button>
        {(await isAuthenticatedNextjs()) && <UserDetails />}
      </div>
    </nav>
  );
}
