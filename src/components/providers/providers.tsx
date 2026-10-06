"use client";

import { CartProvider } from "@/lib/commerce";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { WishlistProvider } from "@/lib/wishlist";

interface Props {
  children: ReactNode;
}

export default function Layout(props: Props) {
  return (
    <>
      <CartProvider><WishlistProvider>{props.children}</WishlistProvider></CartProvider>
      <Toaster />
    </>
  );
}
