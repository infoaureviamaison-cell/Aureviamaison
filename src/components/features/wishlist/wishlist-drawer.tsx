"use client";

import { useWishlist } from "@/lib/wishlist";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@esmate/shadcn/components/ui/button";
import { Separator } from "@esmate/shadcn/components/ui/separator";
import { Badge } from "@esmate/shadcn/components/ui/badge";
import { Heart, X, Trash2, ShoppingCart, ArrowRight } from "@esmate/shadcn/pkgs/lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/commerce";
import { toast } from "sonner";

interface WishlistDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WishlistDrawer({ open, onOpenChange }: WishlistDrawerProps) {
  const wishlist = useWishlist();
  const cart = useCart();
  const isWishlistEmpty = wishlist.items.length === 0;

  async function moveToCart(item: (typeof wishlist.items)[number]) {
    await cart.linesAdd([{
      merchandiseId: item.productId,
      quantity: 1,
      title: item.title,
      price: { amount: String(item.price), currencyCode: "PKR" },
      imageUrl: item.image || undefined
    }]);
    await wishlist.remove(item.productId);
    toast.success("Moved to cart");
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/15"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[60] flex h-full w-[78vw] min-w-[16.5rem] max-w-[21rem] flex-col border-l border-[#C6A24A]/20 bg-white shadow-[-12px_0_30px_rgba(0,0,0,0.16)] sm:w-full sm:max-w-md"
          >
             <div className="flex items-center justify-between border-b border-[#C6A24A]/15 bg-gradient-to-r from-[#fcf5e8]/80 to-white/80 px-3 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
               <div className="flex items-center gap-2">
                 <div className="rounded-full bg-[#f6a45d]/10 p-1.5">
                   <Heart className="h-4 w-4 text-[#f6a45d] sm:h-5 sm:w-5" />
                 </div>
                 <h2 className="text-lg font-semibold text-[#0a0a0a] sm:text-xl">Your Wishlist</h2>
               </div>
               <Badge className="rounded-full bg-gradient-to-r from-[#f6a45d] to-[#d8861f] px-2.5 py-0.5 text-[10px] font-medium text-[#fcf5e8] shadow-sm sm:px-3 sm:py-1 sm:text-xs">
                 {wishlist.items.length} {wishlist.items.length !== 1 ? "items" : "item"}
               </Badge>
               <button
                 onClick={() => onOpenChange(false)}
                 className="rounded-full p-1.5 text-[#5A5E55] transition-all hover:bg-[#C6A24A]/10 hover:text-[#0a0a0a] hover:scale-110 active:scale-95 sm:p-2"
               >
                 <X className="h-4 w-4 sm:h-5 sm:w-5" />
               </button>
             </div>

             <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-5">
              {isWishlistEmpty ? (
                 <div className="flex flex-col items-center justify-center h-full text-center px-4">
                   <div className="rounded-full bg-[#fcf5e8] p-4 mb-4">
                     <Heart className="h-12 w-12 text-[#C6A24A]/40 sm:h-16 sm:w-16" />
                   </div>
                   <p className="text-base font-medium text-[#0a0a0a] sm:text-lg">Your wishlist is empty</p>
                   <p className="text-xs text-[#5A5E55] mt-1 sm:text-sm">Save items you love here</p>
                   <Button
                     asChild
                     className="mt-4 rounded-full bg-gradient-to-r from-[#f6a45d] to-[#d8861f] px-6 py-2 text-[#fcf5e8] shadow-md transition-all hover:shadow-lg hover:scale-105 active:scale-95 sm:mt-6 sm:px-8"
                     onClick={() => onOpenChange(false)}
                   >
                     <Link href="/products">Browse products</Link>
                   </Button>
                 </div>
               ) : (
                 <div className="space-y-3 sm:space-y-5 pb-2">
                   {wishlist.items.map((item, index) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="space-y-2 sm:space-y-4"
                      key={item.productId}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Link
                          href={`/products/${item.handle}`}
                          onClick={() => onOpenChange(false)}
                          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#fcf5e8] ring-1 ring-[#C6A24A]/20 shadow-sm transition-all hover:shadow-md sm:h-20 sm:w-20 sm:rounded-xl"
                        >
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-contain p-2"
                              sizes="80px"
                            />
                          ) : null}
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                             <Link
                               href={`/products/${item.handle}`}
                               onClick={() => onOpenChange(false)}
                               className="line-clamp-2 text-xs font-semibold leading-4 text-[#0a0a0a] transition hover:text-[#f6a45d] sm:text-sm sm:leading-5"
                             >
                               {item.title}
                             </Link>
                            <button
                              onClick={() => void wishlist.remove(item.productId)}
                              className="shrink-0 rounded-full p-1 text-[#5A5E55] transition-all hover:bg-red-50 hover:text-red-500 hover:scale-110 active:scale-95"
                              aria-label={`Remove ${item.title}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <p className="font-semibold text-[#9a6911] text-xs sm:text-sm">
                            Rs. {item.price.toLocaleString("en-PK")}
                          </p>

                          <div className="flex gap-2">
                            <button
                              onClick={() => void moveToCart(item)}
                              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#f6a45d] px-3 py-2 text-xs font-bold text-white transition-all hover:bg-[#ea580c] active:scale-95 sm:text-sm"
                            >
                              <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              Move to cart
                            </button>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-gradient-to-r from-[#C6A24A]/15 via-[#C6A24A]/5 to-transparent my-1 sm:my-0" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {!isWishlistEmpty && (
              <div className="border-t border-[#C6A24A]/15 bg-gradient-to-b from-white to-[#fcf5e8]/30 px-3 pb-20 pt-5 backdrop-blur-sm lg:px-5 lg:pb-5">
                 <div className="flex gap-2 sm:gap-3 pt-1">
                   <Button
                     asChild
                     className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f6a45d] to-[#d8861f] text-sm font-semibold text-[#fcf5e8] shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-98 sm:h-11 sm:text-base"
                     onClick={() => onOpenChange(false)}
                   >
                     <Link href="/products">
                       Continue Shopping
                       <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                     </Link>
                   </Button>

                   <Button
                     variant="outline"
                     className="flex-1 h-10 rounded-full border-2 border-[#C6A24A]/30 text-sm font-semibold text-[#0a0a0a] transition-all hover:border-[#C6A24A] hover:bg-[#fcf5e8] hover:shadow-md hover:scale-[1.02] active:scale-98 sm:h-11 sm:text-base"
                     onClick={() => onOpenChange(false)}
                   >
                     Close
                   </Button>
                 </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
