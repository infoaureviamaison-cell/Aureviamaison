import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "@esmate/shadcn/pkgs/lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-[#efccd5] bg-[#fff1f4]">
      <div className="w-full px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-4">
          {/* Brand / Logo */}
          <div className="space-y-3 sm:space-y-4">
            <Link href="/" className="-m-1.5 p-1.5 block">
              <span className="sr-only">Auerviamaison</span>
              <Image
                src="/logo/auerviamaison.png"
                alt="Auerviamaison"
                width={150}
                height={150}
                className="max-w-[120px] h-auto sm:max-w-[150px]"
              />
            </Link>

            <p className="text-xs text-gray-600 leading-relaxed max-w-xs sm:text-sm">
              Auerviamaison brings together premium beauty, skincare, fragrance, accessories, and everyday styling essentials crafted for confident living.
            </p>

            <div className="flex space-x-3 sm:space-x-4">
              <Link href="#" className="text-[#f97316] hover:text-black transition-colors">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link href="#" className="text-[#f97316] hover:text-black transition-colors">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link href="#" className="text-[#f97316] hover:text-black transition-colors">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900">Shop</h3>
            <ul role="list" className="mt-3 space-y-2 sm:mt-4">
              <li>
                <Link href="/collections" className="text-xs text-gray-600 hover:text-gray-900 transition-colors sm:text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-xs text-gray-600 hover:text-gray-900 transition-colors sm:text-sm">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/category/skincare" className="text-xs text-gray-600 hover:text-gray-900 transition-colors sm:text-sm">
                  Skincare
                </Link>
              </li>
              <li>
                <Link href="/category/makeup" className="text-xs text-gray-600 hover:text-gray-900 transition-colors sm:text-sm">
                  Makeup
                </Link>
              </li>
              <li>
                <Link href="/category/fragrances" className="text-xs text-gray-600 hover:text-gray-900 transition-colors sm:text-sm">
                  Fragrances
                </Link>
              </li>
              <li>
                <Link href="/collections/hot-deals" className="text-xs text-gray-600 hover:text-gray-900 transition-colors sm:text-sm">
                  Hot Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900">Customer Care</h3>
            <ul role="list" className="mt-3 space-y-2 sm:mt-4">
              <li>
                <Link href="/admin/login" className="text-xs text-gray-600 hover:text-gray-900 transition-colors sm:text-sm">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs text-gray-600 hover:text-gray-900 transition-colors sm:text-sm">
                  Contact Us
                </Link>
              </li>

              <li>
                <Link href="/about-us" className="text-xs text-gray-600 hover:text-gray-900 transition-colors sm:text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-xs text-gray-600 hover:text-gray-900 transition-colors sm:text-sm">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-xs text-gray-600 hover:text-gray-900 transition-colors sm:text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-xs text-gray-600 hover:text-gray-900 transition-colors sm:text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-xs text-gray-600 hover:text-gray-900 transition-colors sm:text-sm">
                  Refund & Return Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-xs text-gray-600 hover:text-gray-900 transition-colors sm:text-sm">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-xs text-gray-600 hover:text-gray-900 transition-colors sm:text-sm">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900 mb-3 sm:mb-4">Contact Us</h3>
            <div className="space-y-3 text-xs text-gray-600 sm:space-y-4 sm:text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#EA580C] shrink-0 sm:h-5 sm:w-5" />
                <span>Lahore, Pakistan | Nationwide delivery available</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#EA580C] shrink-0 sm:h-5 sm:w-5" />
                <span>+92 317 9517939</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#EA580C] shrink-0 sm:h-5 sm:w-5" />
                <span>hello@auerviamaison.com</span>
              </div>
              <div className="pt-2">
                <span className="text-[10px] text-gray-500 sm:text-xs">Curated for modern beauty routines</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[#C6A24A]/30 pt-6 sm:mt-12 sm:pt-8">
          <p className="text-center text-[10px] leading-5 text-gray-600 sm:text-xs">
            &copy; {new Date().getFullYear()} Auerviamaison. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
