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
  Download,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "@esmate/shadcn/pkgs/lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CartDrawer } from "@/components/features/cart/cart-drawer";
import { searchProducts } from "@/components/search/actions";
import { search as trackSearch } from "@/lib/pixel";
import { usePWAInstall } from "@/hooks/use-pwa-install";

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

const logoSrc = "/logo/auerviamaison.svg";

async function getShopCategories() {
  const res = await fetch("/api/categories", { next: { revalidate: 60 } });
  const data = await res.json();
  return data.categories || [];
}

export function Header() {
  const pathname = usePathname();
  const { totalQuantity } = useCart();
  const { installApp, isInstalled } = usePWAInstall();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLegalOpen, setMobileLegalOpen] = useState(false);
  const [desktopLegalOpen, setDesktopLegalOpen] = useState(false);
  const desktopLegalRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Awaited<ReturnType<typeof searchProducts>>>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const lastTrackedQuery = useRef("");
  const [cartOpen, setCartOpen] = useState(false);
  const [shopCategories, setShopCategories] = useState<
    { id: string; name: string; slug: string; image: string | null }[]
  >([]);

  useEffect(() => {
    getShopCategories().then(setShopCategories);
  }, []);

  const isActive = (href: string) => pathname.startsWith(href);
  const legalPageActive = legalMenuItems.some((item) => pathname === item.href);

  useEffect(() => {
    function closeLegalMenu(event: MouseEvent) {
      if (!desktopLegalRef.current?.contains(event.target as Node)) {
        setDesktopLegalOpen(false);
      }
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDesktopLegalOpen(false);
        setMobileLegalOpen(false);
      }
    }
    document.addEventListener("mousedown", closeLegalMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeLegalMenu);
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
      <nav className="flex h-16 w-full items-center gap-4 px-3 sm:px-4 lg:h-20 lg:gap-6 lg:px-6">
        <div className="lg:hidden">
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
                        alt="Auerviamaison"
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
        <Link href="/" className="flex shrink-0 items-center">
          <div className="relative h-10 w-[120px] lg:h-12 lg:w-[140px]">
            <Image
              src={logoSrc}
              alt="Auerviamaison"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <div className="flex items-center gap-2 lg:hidden ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-black hover:text-[#f97316]"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 text-[#1a1308] hover:text-[#b57910]"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {!!totalQuantity && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full border-2 border-white bg-[#b57910] p-0 text-xs text-white">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </Badge>
            )}
          </Button>
        </div>

        {/* ───────── nav links ───────── */}
        <div className="hidden items-center gap-5 lg:flex">
          <Link
            href="/"
            className={`flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-[#f97316] ${
              pathname === "/" ? "text-[#f97316]" : "text-black"
            }`}
          >
            Home
          </Link>

          <div className="relative">
            <div className="group">
              <div className="flex cursor-pointer items-center gap-1">
                <Link
                  href="/products"
                  className={`text-sm font-semibold transition-colors hover:text-[#f97316] ${
                    isActive("/products") || isActive("/category")
                      ? "text-[#f97316]"
                      : "text-black"
                  }`}
                >
                  All Products
                </Link>
                <ChevronDown className="h-4 w-4 text-black/60 transition-transform duration-200 group-hover:rotate-180" />
              </div>

              <div className="absolute left-1/2 top-full h-4 w-32 -translate-x-1/2" />

              <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-4 w-[560px] -translate-x-1/2 scale-95 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100">
                <div className="overflow-hidden rounded-xl border border-black/10 bg-white p-2 shadow-none">
                  <div className="grid grid-cols-4 gap-0.5 p-0.5">
                    {shopCategories.slice(0, 8).map((item) => (
                      <Link
                        key={item.id}
                        href={`/category/${item.slug}`}
                        className={`group relative m-1 flex flex-col items-center rounded-lg p-3 transition-all hover:bg-[#fff7ed] ${
                          isActive(`/category/${item.slug}`)
                            ? "bg-[#fff7ed]"
                            : ""
                        }`}
                      >
                        <div className="relative mb-2 h-14 w-14 overflow-hidden rounded-lg">
                          <Image
                            src={item.image || logoSrc}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="56px"
                          />
                        </div>

                        <p
                          className={`text-center text-xs font-semibold leading-tight ${
                            isActive(`/category/${item.slug}`)
                              ? "text-[#f97316]"
                              : "text-black"
                          }`}
                        >
                          {item.name}
                        </p>

                        <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-transparent transition-all group-hover:ring-[#f6a45d]/20" />
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 bg-white p-3">
                    <Link
                      href="/products"
                      className="flex items-center justify-center gap-1.5 text-xs font-semibold text-black/70 transition-colors hover:text-[#f97316]"
                    >
                      View all products
                      <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Link
              href="/about-us"
              className={`text-sm font-semibold transition-colors hover:text-[#f97316] ${
                isActive("/about-us") ? "text-[#f97316]" : "text-black"
              }`}
            >
              About
            </Link>
          </div>

          <div
            ref={desktopLegalRef}
            className="relative"
            onMouseEnter={() => setDesktopLegalOpen(true)}
            onMouseLeave={() => setDesktopLegalOpen(false)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setDesktopLegalOpen(false);
            }}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={desktopLegalOpen}
              aria-controls="desktop-legal-menu"
              onClick={() => setDesktopLegalOpen((open) => !open)}
              className={`flex items-center gap-1 text-sm font-semibold transition-colors hover:text-[#f97316] ${
                legalPageActive ? "text-[#f97316]" : "text-black"
              }`}
            >
              Legal Pages
              <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${desktopLegalOpen ? "rotate-180" : ""}`} />
            </button>
            {desktopLegalOpen ? (
              <div className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3">
                <div id="desktop-legal-menu" role="menu" className="rounded-xl border border-black/10 bg-white p-2 shadow-none">
                  {legalMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      aria-current={pathname === item.href ? "page" : undefined}
                      onClick={() => setDesktopLegalOpen(false)}
                      className={`block rounded-lg px-4 py-2.5 text-sm transition-colors ${
                        pathname === item.href ? "bg-[#fff7ed] font-semibold text-[#f97316]" : "text-black hover:bg-black/5 hover:text-[#f97316]"
                      }`}
                    >
                      {item.text}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative">
            <Link
              href="/wholesale"
              className={`text-sm font-semibold transition-colors hover:text-[#f97316] ${
                isActive("/wholesale") ? "text-[#f97316]" : "text-black"
              }`}
            >
              Wholesale
            </Link>
          </div>

          <div className="relative">
            <Link
              href="/contact"
              className={`text-sm font-semibold transition-colors hover:text-[#f97316] ${
                isActive("/contact") ? "text-[#f97316]" : "text-black"
              }`}
            >
              Contact
            </Link>
          </div>

          <div className="relative">
            <Link
              href="/videos"
              className={`text-sm font-semibold transition-colors hover:text-[#f97316] ${
                isActive("/videos") ? "text-[#f97316]" : "text-black"
              }`}
            >
              Videos
            </Link>
          </div>

          {!isInstalled ? (
            <button
              type="button"
              onClick={() => void installApp()}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#f97316] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
              Install App
            </button>
          ) : null}
        </div>

        {/* ───────── search + icons ───────── */}
        <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
          <div className="relative w-full max-w-xs">
            <div className="flex items-center overflow-hidden rounded-full border border-black/10 bg-white">
              <Search className="ml-4 h-4 w-4 shrink-0 text-black/60" />
              <input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                className="flex-1 bg-transparent px-3 py-2.5 text-sm text-black outline-none placeholder:text-black/50"
              />
              <button
                onClick={() => setSearchOpen(true)}
                className="m-1 shrink-0 rounded-full bg-[#f97316] px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
              >
                Search
              </button>
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
            className="relative h-10 w-10 text-[#1a1308] hover:text-[#b57910]"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
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
    </header>
  );
}
