"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, Heart, UserRound } from "@esmate/shadcn/pkgs/lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { contact as trackContact } from "@/lib/pixel";
import { useWishlist } from "@/lib/wishlist";

const PHONE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { count: wishlistCount } = useWishlist();
  const [selectedAction, setSelectedAction] = useState<"whatsapp" | null>(null);
  const [whatsappMessage, setWhatsappMessage] = useState("");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const toggleAction = (action: "whatsapp") => {
    setSelectedAction((current) => current === action ? null : action);
  };

  const sendWhatsappMessage = () => {
    const message = whatsappMessage.trim();
    const url = `https://wa.me/${PHONE_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
    trackContact("WhatsApp mobile navigation");
    window.open(url, "_blank", "noopener,noreferrer");
    setSelectedAction(null);
  };

  const openWishlistDrawer = () => {
    window.dispatchEvent(new CustomEvent("open-wishlist-drawer"));
  };

  const openProfileDrawer = () => {
    window.dispatchEvent(new CustomEvent("open-profile-drawer"));
  };

  const homeActive = selectedAction === null && isActive("/");
  const productsActive = selectedAction === null &&
    (isActive("/products") || isActive("/category") || isActive("/collections"));

  const navItemClass =
    "relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300";
  const activeItemClass =
    "-translate-y-3.5 bg-[#f97316] text-white ring-[6px] ring-black shadow-none";
  const inactiveItemClass = "text-white/70 hover:text-[#f97316]";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-1 md:hidden safe-area-bottom">
      {selectedAction === "whatsapp" && (
        <div className="absolute bottom-[4.25rem] left-1/2 w-[min(22rem,calc(100vw-1.5rem))] -translate-x-1/2 rounded-2xl border border-[#EA580C]/20 bg-white p-4 shadow-2xl">
          <label htmlFor="mobile-whatsapp-message" className="text-sm font-semibold text-gray-950">
            Message Auerviamaison on WhatsApp
          </label>
          <textarea
            id="mobile-whatsapp-message"
            value={whatsappMessage}
            onChange={(event) => setWhatsappMessage(event.target.value)}
            placeholder="Type your message..."
            rows={3}
            autoFocus
            className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20"
          />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setSelectedAction(null)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
              Cancel
            </button>
            <button type="button" onClick={sendWhatsappMessage} className="rounded-xl bg-[#25D366] px-4 py-2 text-sm font-bold text-white">
              Send
            </button>
          </div>
        </div>
      )}

      <div className="rounded-t-[1.5rem] border border-b-0 border-white/10 bg-[#1a1308] shadow-[0_-8px_24px_rgba(0,0,0,0.18)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex h-14 items-center justify-between px-0.5 pt-0.5">
          {/* Home */}
          <Link
            href="/"
            aria-label="Home"
            aria-current={homeActive ? "page" : undefined}
            onClick={() => setSelectedAction(null)}
            className={`${navItemClass} ${
              homeActive ? activeItemClass : inactiveItemClass
            }`}
          >
            <Home className="h-5 w-5" />
          </Link>

          {/* Products */}
          <Link
            href="/products"
            aria-label="Products"
            aria-current={productsActive ? "page" : undefined}
            onClick={() => setSelectedAction(null)}
            className={`${navItemClass} ${
              productsActive ? activeItemClass : inactiveItemClass
            }`}
          >
            <Grid3X3 className="h-5 w-5" />
          </Link>

          {/* Wishlist */}
          <button
            aria-label="Wishlist"
            onClick={openWishlistDrawer}
            className={`${navItemClass} ${inactiveItemClass}`}
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#f97316] text-[10px] font-bold text-white">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            aria-label="Profile"
            onClick={openProfileDrawer}
            className={`${navItemClass} ${inactiveItemClass}`}
          >
            <UserRound className="h-5 w-5" />
          </button>

          {/* WhatsApp */}
          <button
            type="button"
            aria-label="WhatsApp"
            aria-pressed={selectedAction === "whatsapp"}
            onClick={() => toggleAction("whatsapp")}
            className={`${navItemClass} ${selectedAction === "whatsapp" ? activeItemClass : inactiveItemClass}`}
          >
            <FaWhatsapp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
