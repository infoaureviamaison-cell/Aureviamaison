"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiSearch, FiLogOut, FiUser } from "react-icons/fi";

export function AdminTopbar({
  adminName,
}: {
  adminName: string;
}) {
  const pathname = usePathname();

  const title =
    pathname === "/admin/dashboard"
      ? "Dashboard"
      : pathname?.startsWith("/admin/products")
        ? "Products"
        : pathname?.startsWith("/admin/categories")
          ? "Categories"
          : pathname?.startsWith("/admin/collections")
            ? "Collections"
            : pathname?.startsWith("/admin/orders")
              ? "Orders"
              : pathname?.startsWith("/admin/inquiries")
                ? "Inquiries"
                : pathname?.startsWith("/admin/blog")
                  ? "Blog"
                  : pathname?.startsWith("/admin/media")
                    ? "Media"
                    : pathname?.startsWith("/admin/settings")
                      ? "Settings"
                      : pathname?.startsWith("/admin/profile")
                        ? "Profile"
                        : "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-black/10 bg-white px-6">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-black">{title}</h1>
        <p className="truncate text-xs text-black/70">Signed in as {adminName}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-sm text-black/70 md:flex">
          <FiSearch className="h-4 w-4 text-[#f97316]" />
          <span className="select-none">Search (coming soon)</span>
        </div>

        <Link
          href="/admin/profile"
          className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium text-black hover:bg-[#fff7ed]"
        >
          <FiUser className="h-4 w-4 text-[#f97316]" />
          <span className="hidden sm:inline">Profile</span>
        </Link>

        <Link
          href="/api/auth/signout"
          className="inline-flex items-center gap-2 rounded-lg bg-red-500/20 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-500/30"
        >
          <FiLogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Link>
      </div>
    </header>
  );
}

