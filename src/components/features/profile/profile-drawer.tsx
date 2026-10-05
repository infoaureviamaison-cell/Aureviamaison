"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@esmate/shadcn/components/ui/button";
import { Separator } from "@esmate/shadcn/components/ui/separator";
import { Badge } from "@esmate/shadcn/components/ui/badge";
import { X, UserRound, Mail, Phone, MapPin, ArrowRight, CheckCircle } from "@esmate/shadcn/pkgs/lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CustomerData {
  name: string | null;
  email: string | null;
  phone: string | null;
  address?: {
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    country: string | null;
  } | null;
  stats?: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalSpent: number;
  } | null;
}

interface ProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDrawer({ open, onOpenChange }: ProfileDrawerProps) {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    async function loadCustomer() {
      try {
        const data = await fetch("/api/customer/profile", { cache: "no-store" }).then((r) => r.json());
        setCustomer(data.customer);
      } catch (error) {
        console.error("Failed to load customer profile:", error);
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    const timer = setTimeout(loadCustomer, 0);
    return () => clearTimeout(timer);
  }, [open]);

  const hasProfile = customer && (customer.name || customer.email || customer.phone);

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
                   <UserRound className="h-4 w-4 text-[#f6a45d] sm:h-5 sm:w-5" />
                 </div>
                 <h2 className="text-lg font-semibold text-[#0a0a0a] sm:text-xl">Profile</h2>
               </div>
               <button
                 onClick={() => onOpenChange(false)}
                 className="rounded-full p-1.5 text-[#5A5E55] transition-all hover:bg-[#C6A24A]/10 hover:text-[#0a0a0a] hover:scale-110 active:scale-95 sm:p-2"
               >
                 <X className="h-4 w-4 sm:h-5 sm:w-5" />
               </button>
             </div>

             <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-5">
              {loading ? (
                 <div className="flex flex-col items-center justify-center h-full text-center px-4">
                   <div className="rounded-full bg-[#fcf5e8] p-4 mb-4">
                     <UserRound className="h-12 w-12 text-[#C6A24A]/40 sm:h-16 sm:w-16" />
                   </div>
                   <p className="text-base font-medium text-[#0a0a0a] sm:text-lg">Loading profile...</p>
                 </div>
               ) : !hasProfile ? (
                 <div className="flex flex-col items-center justify-center h-full text-center px-4">
                   <div className="rounded-full bg-[#fcf5e8] p-4 mb-4">
                     <UserRound className="h-12 w-12 text-[#C6A24A]/40 sm:h-16 sm:w-16" />
                   </div>
                   <p className="text-base font-medium text-[#0a0a0a] sm:text-lg">No profile yet</p>
                   <p className="text-xs text-[#5A5E55] mt-1 sm:text-sm">Create your profile to save your details</p>
                   <Button
                     asChild
                     className="mt-4 rounded-full bg-gradient-to-r from-[#f6a45d] to-[#d8861f] px-6 py-2 text-[#fcf5e8] shadow-md transition-all hover:shadow-lg hover:scale-105 active:scale-95 sm:mt-6 sm:px-8"
                     onClick={() => onOpenChange(false)}
                   >
                     <Link href="/profile">Create Profile</Link>
                   </Button>
                 </div>
               ) : (
                 <div className="space-y-4 sm:space-y-6">
                   <div className="flex items-center gap-2">
                     <CheckCircle className="h-5 w-5 text-green-600" />
                     <Badge className="rounded-full bg-green-100 text-green-700 px-2.5 py-0.5 text-[10px] font-medium sm:px-3 sm:py-1 sm:text-xs">
                       Profile active
                     </Badge>
                   </div>

                   <div className="space-y-3 sm:space-y-4">
                     {customer?.name && (
                       <div className="flex items-start gap-3">
                         <UserRound className="h-5 w-5 text-[#C6A24A] shrink-0 mt-0.5" />
                         <div className="min-w-0 flex-1">
                           <p className="text-xs font-semibold text-[#5A5E55] uppercase tracking-wider">Name</p>
                           <p className="text-sm font-medium text-[#0a0a0a] break-words">{customer.name}</p>
                         </div>
                       </div>
                     )}

                     {customer?.email && (
                       <div className="flex items-start gap-3">
                         <Mail className="h-5 w-5 text-[#C6A24A] shrink-0 mt-0.5" />
                         <div className="min-w-0 flex-1">
                           <p className="text-xs font-semibold text-[#5A5E55] uppercase tracking-wider">Email</p>
                           <p className="text-sm font-medium text-[#0a0a0a] break-words">{customer.email}</p>
                         </div>
                       </div>
                     )}

                     {customer?.phone && (
                       <div className="flex items-start gap-3">
                         <Phone className="h-5 w-5 text-[#C6A24A] shrink-0 mt-0.5" />
                         <div className="min-w-0 flex-1">
                           <p className="text-xs font-semibold text-[#5A5E55] uppercase tracking-wider">Phone</p>
                           <p className="text-sm font-medium text-[#0a0a0a] break-words">{customer.phone}</p>
                         </div>
                       </div>
                     )}

                     {customer?.address?.line1 && (
                       <div className="flex items-start gap-3">
                         <MapPin className="h-5 w-5 text-[#C6A24A] shrink-0 mt-0.5" />
                         <div className="min-w-0 flex-1">
                           <p className="text-xs font-semibold text-[#5A5E55] uppercase tracking-wider">Address</p>
                           <p className="text-sm font-medium text-[#0a0a0a] break-words">
                             {customer.address.line1}
                             {customer.address.line2 && `, ${customer.address.line2}`}
                             {customer.address.city && `, ${customer.address.city}`}
                             {customer.address.state && `, ${customer.address.state}`}
                             {customer.address.pincode && ` ${customer.address.pincode}`}
                           </p>
                         </div>
                       </div>
                     )}
                   </div>

                   {customer?.stats && (
                     <>
                       <Separator className="bg-gradient-to-r from-[#C6A24A]/15 via-[#C6A24A]/5 to-transparent" />
                       <div className="grid grid-cols-2 gap-3">
                         <div className="rounded-xl border border-[#C6A24A]/20 bg-[#fcf5e8] p-3">
                           <p className="text-[10px] uppercase text-[#5A5E55]">Orders</p>
                           <p className="mt-1 text-lg font-bold text-[#0a0a0a]">{customer.stats.totalOrders}</p>
                         </div>
                         <div className="rounded-xl border border-[#C6A24A]/20 bg-[#fcf5e8] p-3">
                           <p className="text-[10px] uppercase text-[#5A5E55]">Spent</p>
                           <p className="mt-1 text-lg font-bold text-[#0a0a0a]">Rs. {customer.stats.totalSpent.toLocaleString("en-PK")}</p>
                         </div>
                       </div>
                     </>
                   )}
                 </div>
              )}
            </div>

            {hasProfile && (
              <div className="border-t border-[#C6A24A]/15 bg-gradient-to-b from-white to-[#fcf5e8]/30 px-3 pb-20 pt-5 backdrop-blur-sm lg:px-5 lg:pb-5">
                 <div className="flex gap-2 sm:gap-3 pt-1">
                   <Button
                     asChild
                     className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f6a45d] to-[#d8861f] text-sm font-semibold text-[#fcf5e8] shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-98 sm:h-11 sm:text-base"
                     onClick={() => onOpenChange(false)}
                   >
                     <Link href="/profile">
                       View Full Profile
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
