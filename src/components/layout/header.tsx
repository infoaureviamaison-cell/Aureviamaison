"use client";

import { useCart } from "@/lib/commerce";
import { Badge } from "@esmate/shadcn/components/ui/badge";
import { Button } from "@esmate/shadcn/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@esmate/shadcn/components/ui/sheet";
import {
  ChevronDown,
  ChevronRight,
  Download,
  Menu,
  Phone,
  Search,
  Heart,
  UserRound,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "@esmate/shadcn/pkgs/lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CartDrawer } from "@/components/features/cart/cart-drawer";
import { WishlistDrawer } from "@/components/features/wishlist/wishlist-drawer";
import { ProfileDrawer } from "@/components/features/profile/profile-drawer";
import { searchProducts } from "@/components/search/actions";
import { search as trackSearch } from "@/lib/pixel";
import { usePWAInstall } from "@/hooks/use-pwa-install";
import { useWishlist } from "@/lib/wishlist";

const mainMenuItems = [
  { text: "Home", href: "/" },
  { text: "Products", href: "/products" },
  { text: "Skincare", href: "/category/skincare" },
  { text: "Fragrance", href: "/category/fragrances" },
  { text: "Deals", href: "/collections/hot-deals" },
  { text: "About", href: "/about-us" },
  { text: "Contact", href: "/contact" },
];

const legalMenuItems = [
  { text: "Certificates", href: "/certificates" },
  { text: "Terms & Conditions", href: "/terms" },
  { text: "Privacy Policy", href: "/privacy" },
  { text: "Disclaimer", href: "/disclaimer" },
  { text: "Refund & Return Policy", href: "/refund-policy" },
  { text: "Shipping Policy", href: "/shipping-policy" },
];

const topBarLeft = [
  { icon: Truck, text: "Free shipping over Rs. 3,000" },
  { icon: ShieldCheck, text: "Secure checkout & easy returns" },
];

const topBarRight = [
  { text: "New In", href: "/collections/new-arrivals" },
  { text: "Reviews", href: "/reviews" },
  { text: "Gift Sets", href: "/collections/hot-deals" },
  { text: "FAQs", href: "/faqs" },
];

const logoSrc = "/logo/icon.png";

async function getShopCategories() {
  const res = await fetch("/api/categories", { next: { revalidate: 60 } });
  const data = await res.json();
  return data.categories || [];
}

export function Header() {
  const pathname = usePathname();
  const { totalQuantity } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { installApp, isInstalled } = usePWAInstall();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLegalOpen, setMobileLegalOpen] = useState(false);
  const [desktopMoreOpen, setDesktopMoreOpen] = useState(false);
  const desktopMoreRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Awaited<ReturnType<typeof searchProducts>>>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const lastTrackedQuery = useRef("");
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [shopCategories, setShopCategories] = useState<
    { id: string; name: string; slug: string; image: string | null }[]
  >([]);

  useEffect(() => {
    getShopCategories().then(setShopCategories);
  }, []);

  useEffect(() => {
    const handleOpenWishlist = () => setWishlistOpen(true);
    const handleOpenProfile = () => setProfileOpen(true);

    window.addEventListener("open-wishlist-drawer", handleOpenWishlist);
    window.addEventListener("open-profile-drawer", handleOpenProfile);

    return () => {
      window.removeEventListener("open-wishlist-drawer", handleOpenWishlist);
      window.removeEventListener("open-profile-drawer", handleOpenProfile);
    };
  }, []);

  const isActive = (href: string) => pathname.startsWith(href);
  const legalPageActive = legalMenuItems.some((item) => pathname === item.href);
  const mainCategories = shopCategories.slice(0, 4);
  useEffect(() => {
    function closeMoreMenu(event: MouseEvent) {
      if (!desktopMoreRef.current?.contains(event.target as Node)) {
        setDesktopMoreOpen(false);
      }
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDesktopMoreOpen(false);
        setMobileLegalOpen(false);
      }
    }
    document.addEventListener("mousedown", closeMoreMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeMoreMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    async function performSearch() {
      const validQuery = searchQuery.trim();
      if (validQuery.length < 3) {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      try {
        const products = await searchProducts(validQuery);
        setSearchResults(products);
        if (lastTrackedQuery.current !== validQuery) {
          trackSearch(validQuery);
          lastTrackedQuery.current = validQuery;
        }
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }

    const timeout = setTimeout(performSearch, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white">
      {/* ───────── top announcement bar ───────── */}
      <div className="hidden bg-black text-white lg:block">
        <div className="flex h-10 w-full items-center justify-between px-4 text-xs sm:px-6">
          <div className="flex items-center gap-6">
            {topBarLeft.map((item) => (
              <span key={item.text} className="flex items-center gap-2 font-medium">
                <item.icon className="h-3.5 w-3.5 text-[#f97316]" />
                {item.text}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6">
            {topBarRight.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-medium text-white/85 transition-colors hover:text-[#f97316]"
              >
                {item.text}
              </Link>
            ))}
            <Link
              href="/contact"
              className="flex items-center gap-1.5 font-medium text-white/85 transition-colors hover:text-[#f97316]"
            >
              <Phone className="h-3.5 w-3.5" />
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* ───────── main nav ───────── */}
      <nav className="flex min-h-14 w-full items-center gap-2 px-2 sm:min-h-16 sm:px-4 lg:min-h-20 lg:gap-3 lg:px-5 xl:gap-4 xl:px-6">
        <div className="xl:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-black hover:text-[#f97316]"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[320px] border-r border-black/10 bg-white p-0"
            >
              <SheetTitle className="sr-only">Mobile menu</SheetTitle>
              <div className="flex h-full flex-col">
                <div className="p-6">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <div className="relative h-14 w-[130px]">
                      <Image
                        src={logoSrc}
                        alt="Aurevia Maison"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </Link>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-1">
                    <Link
                      href="/"
                      className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        pathname === "/"
                          ? "bg-[#fff7ed] text-[#f97316]"
                          : "text-black hover:bg-black/5"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </Link>

                    <div className="mt-4">
                      <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-black/70">
                        Shop Categories
                      </div>

                      <div className="space-y-1">
                        {shopCategories.map((item) => (
                          <Link
                            key={item.id}
                            href={`/category/${item.slug}`}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                              isActive(`/category/${item.slug}`)
                                ? "bg-[#fff7ed] text-[#f97316]"
                                : "text-black hover:bg-black/5"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <div className="relative h-8 w-8 overflow-hidden rounded border border-black/10">
                              <Image
                                src={item.image || logoSrc}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 border-t border-black/10 pt-4">
                      {mainMenuItems
                        .filter((i) => i.text !== "Home")
                        .map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                              isActive(item.href)
                                ? "bg-[#fff7ed] text-[#f97316]"
                                : "text-black hover:bg-black/5"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.text}
                          </Link>
                        ))}
                      <div className="mt-2">
                        <button
                          type="button"
                          aria-expanded={mobileLegalOpen}
                          aria-controls="mobile-legal-menu"
                          onClick={() => setMobileLegalOpen((open) => !open)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                            legalPageActive ? "bg-[#fff7ed] text-[#f97316]" : "text-black hover:bg-black/5"
                          }`}
                        >
                          Legal Pages
                          <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${mobileLegalOpen ? "rotate-180" : ""}`} />
                        </button>
                        {mobileLegalOpen ? (
                          <div id="mobile-legal-menu" className="ml-3 mt-1 space-y-1 border-l border-black/10 pl-3">
                            {legalMenuItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                aria-current={pathname === item.href ? "page" : undefined}
                                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                                  pathname === item.href ? "bg-[#fff7ed] font-semibold text-[#f97316]" : "text-black hover:bg-black/5"
                                }`}
                                onClick={() => {
                                  setMobileLegalOpen(false);
                                  setMobileMenuOpen(false);
                                }}
                              >
                                {item.text}
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      {!isInstalled ? (
                        <button
                          type="button"
                          onClick={() => {
                            void installApp();
                            setMobileMenuOpen(false);
                          }}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#f97316] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-[#ea580c]"
                        >
                          <Download aria-hidden="true" className="h-4 w-4" />
                          Install App
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#C6A24A]/25 p-6">
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-black hover:text-[#f97316]"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setSearchOpen(true);
                      }}
                    >
                      <Search className="h-5 w-5" />
                    </Button>

                    <button
                      className="relative text-black transition-colors hover:text-[#f97316]"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setCartOpen(true);
                      }}
                    >
                      <ShoppingCart className="h-6 w-6" />
                      {!!totalQuantity && (
                        <Badge className="absolute -right-2 -top-2 h-5 min-w-5 rounded-full bg-[#f97316] p-0 text-xs text-white">
                          {totalQuantity}
                        </Badge>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* ───────── logo — kept tight to the left edge ───────── */}
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-1.5 sm:gap-2">
          <div className="relative h-8 w-8 sm:h-10 sm:w-10 lg:h-14 lg:w-14">
            <Image
              src="/logo/icon.png"
              alt=""
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="relative h-6 w-[80px] min-[400px]:w-[90px] sm:h-8 sm:w-[102px] min-[400px]:sm:w-[118px] sm:h-10 sm:w-[140px] lg:h-12 lg:w-[156px]">
            <Image
              src="/logo/logotext.png"
              alt="Auerviamaison"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 xl:hidden">
          <button
            aria-label="Wishlist"
            className="relative flex h-9 w-9 items-center justify-center text-black hover:text-[#f97316] sm:h-10 sm:w-10"
            onClick={() => setWishlistOpen(true)}
          >
            <Heart className="h-4 w-4 sm:h-5 sm:w-5"/>
            {wishlistCount ? <Badge className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-[#f97316] p-0 text-[10px] text-white sm:h-5 sm:min-w-5 sm:text-xs">{wishlistCount > 99 ? "99+" : wishlistCount}</Badge> : null}
          </button>
          <button
            aria-label="Profile"
            className="flex h-9 w-9 items-center justify-center text-black hover:text-[#f97316] sm:h-10 sm:w-10"
            onClick={() => setProfileOpen(true)}
          >
            <UserRound className="h-4 w-4 sm:h-5 sm:w-5"/>
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-black hover:text-[#f97316] sm:h-10 sm:w-10"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 text-[#1a1308] hover:text-[#b57910] sm:h-10 sm:w-10"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            {!!totalQuantity && (
              <Badge className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full border-2 border-white bg-[#b57910] p-0 text-[10px] text-white sm:h-5 sm:min-w-5 sm:text-xs">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </Badge>
            )}
          </Button>
        </div>

        {/* ───────── nav links ───────── */}
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-3 xl:flex 2xl:gap-5">
          <Link
            href="/"
            className={`shrink-0 text-[15px] font-semibold transition-colors hover:text-[#f97316] ${pathname === "/" ? "text-[#f97316]" : "text-black"}`}
          >
            Home
          </Link>

          <div className="group/shop relative shrink-0">
            <Link
              href="/products"
              className={`flex items-center gap-1.5 text-[15px] font-semibold transition-colors hover:text-[#f97316] ${isActive("/products") || isActive("/category") ? "text-[#f97316]" : "text-black"}`}
            >
              Shop
              <ChevronDown aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover/shop:rotate-180 group-focus-within/shop:rotate-180" />
            </Link>

            <div className="pointer-events-none absolute left-1/2 top-full z-50 w-[440px] -translate-x-1/2 pt-4 opacity-0 transition-all duration-300 group-hover/shop:pointer-events-auto group-hover/shop:opacity-100 group-focus-within/shop:pointer-events-auto group-focus-within/shop:opacity-100">
              <div className="rounded-2xl border border-black/10 bg-white p-3 shadow-[0_16px_40px_rgba(0,0,0,0.14)]">
                <div className="mb-2 flex items-center justify-between px-2 pt-1">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-black/55">Shop categories</span>
                  <Link href="/products" className="text-xs font-bold text-[#f97316] hover:text-[#ea580c]">
                    View all products
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {shopCategories.slice(0, 8).map((item) => (
                    <Link
                      key={item.id}
                      href={`/category/${item.slug}`}
                      className={`flex min-w-0 items-center gap-3 rounded-xl px-2 py-2.5 text-sm font-semibold transition-colors hover:bg-[#fff7ed] hover:text-[#f97316] ${isActive(`/category/${item.slug}`) ? "bg-[#fff7ed] text-[#f97316]" : "text-black"}`}
                    >
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-[#fffdf8]">
                        <Image src={item.image || logoSrc} alt="" fill sizes="40px" className="object-cover" />
                      </span>
                      <span className="truncate">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {mainCategories.map((item) => (
            <Link
              key={item.id}
              href={`/category/${item.slug}`}
              title={item.name}
              className={`max-w-[82px] truncate text-sm font-semibold transition-colors hover:text-[#f97316] 2xl:max-w-[110px] 2xl:text-[15px] ${isActive(`/category/${item.slug}`) ? "text-[#f97316]" : "text-black"}`}
            >
              {item.name}
            </Link>
          ))}

          <div ref={desktopMoreRef} className="relative shrink-0" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDesktopMoreOpen(false); }}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={desktopMoreOpen}
              aria-controls="desktop-more-menu"
              onClick={() => setDesktopMoreOpen((open) => !open)}
              onMouseEnter={() => setDesktopMoreOpen(true)}
              className={`flex items-center gap-1.5 text-[15px] font-semibold transition-colors hover:text-[#f97316] ${desktopMoreOpen ? "text-[#f97316]" : "text-black"}`}
            >
              More <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 transition-transform ${desktopMoreOpen ? "rotate-180" : ""}`} />
            </button>
            {desktopMoreOpen ? (
              <div className="absolute right-0 top-full z-50 w-52 pt-3" onMouseLeave={() => setDesktopMoreOpen(false)}>
                <div id="desktop-more-menu" role="menu" className="rounded-lg border border-black/10 bg-white p-2">
                  {[
                    ...mainMenuItems.filter((item) => !["Home", "Products", "Skincare", "Fragrance"].includes(item.text)),
                    { text: "Wholesale", href: "/wholesale" },
                    { text: "Videos", href: "/videos" },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} role="menuitem" onClick={() => setDesktopMoreOpen(false)} className={`block rounded-md px-3 py-2 text-sm transition-colors hover:bg-black/5 hover:text-[#f97316] ${isActive(item.href) ? "font-semibold text-[#f97316]" : "text-black"}`}>
                      {item.text}
                    </Link>
                  ))}
                  <div className="group/legal relative">
                    <button
                      type="button"
                      role="menuitem"
                      aria-haspopup="menu"
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-black/5 hover:text-[#f97316] ${legalPageActive ? "font-semibold text-[#f97316]" : "text-black"}`}
                    >
                      Legal Pages
                      <ChevronRight aria-hidden="true" className="h-4 w-4" />
                    </button>
                    <div className="pointer-events-none absolute right-full top-0 z-50 w-56 pr-2 opacity-0 transition-opacity duration-200 group-hover/legal:pointer-events-auto group-hover/legal:opacity-100 group-focus-within/legal:pointer-events-auto group-focus-within/legal:opacity-100">
                      <div role="menu" className="rounded-lg border border-black/10 bg-white p-2 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
                        {legalMenuItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            role="menuitem"
                            onClick={() => setDesktopMoreOpen(false)}
                            className={`block rounded-md px-3 py-2 text-sm transition-colors hover:bg-black/5 hover:text-[#f97316] ${pathname === item.href ? "font-semibold text-[#f97316]" : "text-black"}`}
                          >
                            {item.text}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  {!isInstalled ? <button type="button" onClick={() => { void installApp(); setDesktopMoreOpen(false); }} className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-black hover:bg-black/5"><Download className="h-3.5 w-3.5" />Install App</button> : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* ───────── search + icons ───────── */}
        <div className="hidden shrink-0 items-center justify-end gap-1 xl:flex 2xl:gap-2">
          <div className="relative w-[128px] 2xl:w-[160px]">
            <div className="flex h-9 items-center overflow-hidden rounded-full border border-black/15 bg-white">
              <Search className="ml-3 h-4 w-4 shrink-0 text-black/70" />
              <input
                type="search"
                placeholder="Search products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-xs text-black outline-none placeholder:text-black/50"
              />
            </div>

            {searchOpen && searchQuery && (
              <div className="absolute right-0 top-full z-50 mt-2 max-h-80 w-80 overflow-hidden overflow-y-auto rounded-lg border border-black/10 bg-white shadow-none">
                {searchLoading ? (
                  <div className="flex items-center justify-center py-8 text-sm text-black/70">
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product.handle}
                      href={`/products/${product.handle}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="flex items-center gap-3 border-b border-black/5 p-3 last:border-b-0 hover:bg-black/5"
                    >
                      <div className="relative h-10 w-10 overflow-hidden rounded-md border border-black/10">
                        {product.featuredImage && (
                          <Image
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || ""}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-black">
                          {product.title}
                        </p>
                        <p className="text-xs text-black/70">
                          {product.priceRange.minVariantPrice.amount}{" "}
                          {product.priceRange.minVariantPrice.currencyCode}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-8 text-sm text-black/70">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Wishlist"
            className="relative h-8 w-8 text-black hover:text-[#f97316] 2xl:h-9 2xl:w-9"
            onClick={() => setWishlistOpen(true)}
          >
            <Heart className="h-[18px] w-[18px]" />
            {wishlistCount ? <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full bg-[#f97316] p-0 text-xs text-white">{wishlistCount > 99 ? "99+" : wishlistCount}</Badge> : null}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Profile"
            className="h-8 w-8 text-black hover:text-[#f97316] 2xl:h-9 2xl:w-9"
            onClick={() => setProfileOpen(true)}
          >
            <UserRound className="h-[18px] w-[18px]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 text-[#1a1308] hover:text-[#b57910] 2xl:h-9 2xl:w-9"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-[18px] w-[18px]" />
            {!!totalQuantity && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full border-2 border-white bg-[#b57910] p-0 text-xs text-white">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </Badge>
            )}
          </Button>


        </div>
      </nav>

      {searchOpen && (
        <div className="absolute left-0 right-0 top-16 z-30 border-b border-black/10 bg-white lg:hidden">
          <div className="px-4 py-3">
            <div className="flex items-center overflow-hidden rounded-lg border-2 border-black/10 bg-white">
              <Search className="ml-3 h-4 w-4 shrink-0 text-black/60" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => {
                  setTimeout(() => setSearchOpen(false), 150);
                }}
                onFocus={() => setSearchOpen(true)}
                className="flex-1 bg-transparent px-3 py-2.5 text-sm text-black outline-none placeholder:text-black/50"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="shrink-0 px-2 text-black/70 hover:text-[#f97316]"
                >
                  <Search className="h-4 w-4 rotate-90" />
                </button>
              )}
              <button
                onClick={() => setSearchOpen(false)}
                className="border-l border-black/10 px-3 text-black/70 hover:text-[#f97316]"
              >
                Cancel
              </button>
            </div>

            {searchQuery && (
              <div className="mt-2 max-h-80 overflow-hidden overflow-y-auto rounded-lg border border-black/10 bg-white shadow-none">
                {searchLoading ? (
                  <div className="flex items-center justify-center py-6 text-sm text-black/70">
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product.handle}
                      href={`/products/${product.handle}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="flex items-center gap-3 border-b border-black/5 p-3 last:border-b-0 hover:bg-black/5"
                    >
                      <div className="relative h-10 w-10 overflow-hidden rounded-md border border-black/10">
                        {product.featuredImage && (
                          <Image
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || ""}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-black">
                          {product.title}
                        </p>
                        <p className="text-xs text-black/70">
                          {product.priceRange.minVariantPrice.amount}{" "}
                          {product.priceRange.minVariantPrice.currencyCode}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-6 text-sm text-black/70">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <WishlistDrawer open={wishlistOpen} onOpenChange={setWishlistOpen} />
      <ProfileDrawer open={profileOpen} onOpenChange={setProfileOpen} />
    </header>
  );
}
