"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type WishlistProduct = { productId: string; handle: string; title: string; price: number; image: string | null };
type WishlistApiEntry = { product: { id: string; handle: string; title: string; price: number; featuredImage?: string | null; images?: unknown } };
type WishlistContextValue = { items: WishlistProduct[]; count: number; has: (id: string) => boolean; toggle: (product: WishlistProduct) => Promise<boolean>; remove: (id: string) => Promise<void>; sync: () => Promise<void> };
const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "aurevia-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistProduct[]>([]);
  useEffect(() => { const timer = window.setTimeout(() => { try { setItems(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); } catch { localStorage.removeItem(STORAGE_KEY); } }, 0); return () => window.clearTimeout(timer); }, []);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  const sync = useCallback(async () => {
    const response = await fetch("/api/customer/profile", { cache: "no-store" });
    const data = await response.json();
    if (!data.customer) return;
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as WishlistProduct[];
    await Promise.all(local.map((item) => fetch("/api/customer/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: item.productId }) })));
    const fresh = await fetch("/api/customer/wishlist", { cache: "no-store" }).then((result) => result.json());
    setItems(((fresh.wishlist || []) as WishlistApiEntry[]).map((entry) => ({ productId: entry.product.id, handle: entry.product.handle, title: entry.product.title, price: entry.product.price, image: entry.product.featuredImage || (Array.isArray(entry.product.images) && typeof entry.product.images[0] === "string" ? entry.product.images[0] : null) })));
  }, []);

  useEffect(() => { const timer = window.setTimeout(() => void sync(), 0); window.addEventListener("aurevia-profile-saved", sync); return () => { window.clearTimeout(timer); window.removeEventListener("aurevia-profile-saved", sync); }; }, [sync]);

  const remove = useCallback(async (productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
    await fetch("/api/customer/wishlist", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId }) });
  }, []);
  const toggle = useCallback(async (product: WishlistProduct) => {
    const exists = items.some((item) => item.productId === product.productId);
    if (exists) { await remove(product.productId); return false; }
    setItems((current) => [product, ...current.filter((item) => item.productId !== product.productId)]);
    await fetch("/api/customer/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product.productId }) });
    return true;
  }, [items, remove]);
  const value = useMemo(() => ({ items, count: items.length, has: (id: string) => items.some((item) => item.productId === id), toggle, remove, sync }), [items, toggle, remove, sync]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() { const value = useContext(WishlistContext); if (!value) throw new Error("useWishlist must be used within WishlistProvider"); return value; }
