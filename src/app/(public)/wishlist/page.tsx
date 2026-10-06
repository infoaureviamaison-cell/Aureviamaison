"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "@esmate/shadcn/pkgs/lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/commerce";
import { toast } from "sonner";

export default function WishlistPage() {
  const wishlist = useWishlist();
  const cart = useCart();
  async function moveToCart(item: (typeof wishlist.items)[number]) {
    await cart.linesAdd([{ merchandiseId: item.productId, quantity: 1, title: item.title, price: { amount: String(item.price), currencyCode: "PKR" }, imageUrl: item.image || undefined }]);
    await wishlist.remove(item.productId);
    toast.success("Moved to cart");
  }
  return <main className="min-h-[70vh] bg-[#fcf5e8] px-4 py-10 sm:px-6"><div className="mx-auto max-w-6xl">
    <div className="flex items-center gap-3"><Heart className="h-7 w-7 text-[#c86f2d]"/><div><h1 className="font-serif text-3xl font-bold text-[#1a1308]">Your wishlist</h1><p className="text-sm text-[#5A5E55]">Saved here for later. Complete your profile to sync it to this customer record.</p></div></div>
    {!wishlist.items.length ? <div className="mt-10 rounded-2xl border border-[#C6A24A]/20 bg-white p-10 text-center"><p className="text-[#5A5E55]">Your wishlist is empty.</p><Link href="/products" className="mt-4 inline-flex rounded-full bg-[#f6a45d] px-5 py-2.5 font-bold text-white">Browse products</Link></div> : <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{wishlist.items.map((item) => <article key={item.productId} className="overflow-hidden rounded-2xl border border-[#C6A24A]/20 bg-white shadow-sm"><Link href={`/products/${item.handle}`} className="relative block aspect-square bg-[#fffdf8]">{item.image ? <Image src={item.image} alt={item.title} fill className="object-contain p-4"/> : null}</Link><div className="p-4"><Link href={`/products/${item.handle}`} className="font-serif text-lg font-bold">{item.title}</Link><p className="mt-1 font-semibold text-[#9a6911]">Rs. {item.price.toLocaleString("en-PK")}</p><div className="mt-4 flex gap-2"><button onClick={() => void moveToCart(item)} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#f6a45d] px-3 py-2 text-sm font-bold text-white"><ShoppingCart className="h-4 w-4"/>Move to cart</button><button onClick={() => void wishlist.remove(item.productId)} aria-label={`Remove ${item.title}`} className="rounded-lg border border-red-200 p-2 text-red-600"><Trash2 className="h-5 w-5"/></button></div></div></article>)}</div>}
  </div></main>;
}
