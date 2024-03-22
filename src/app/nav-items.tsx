"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItems() {
  const pathname = usePathname();
  return (
    <>
      <Link
        className="font-semibold ml-10 mr-2 text-sm underline-offset-4 hover:underline"
        href={"/dashboard"}
      >
        {pathname === "/dashboard" ? (
          <span className="underline underline-offset-4">Dashboard</span>
        ) : (
          <span className="text-gray-500">Dashboard</span>
        )}
      </Link>
      <Link
        className="font-semibold text-sm underline-offset-4 hover:underline"
        href={"/roadmap"}
      >
        {pathname.includes("/roadmap") ? (
          <span className="underline underline-offset-4">Roadmap</span>
        ) : (
          <span className="text-gray-500">Roadmap</span>
        )}
      </Link>
    </>
  );
}