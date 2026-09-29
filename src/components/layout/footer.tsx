import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "@esmate/shadcn/pkgs/lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="w-full px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand / Logo */}
          <div className="space-y-4">
            <Link href="/" className="-m-1.5 p-1.5 block">
              <span className="sr-only">Auerviamaison</span>
              <Image
                src="/logo/auerviamaison.svg"
                alt="Auerviamaison"
                width={150}
                height={150}
                className="max-w-[150px] h-auto"
              />
            </Link>

            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              Auerviamaison brings together premium beauty, skincare, fragrance, accessories, and everyday styling essentials crafted for confident living.
            </p>

            <div className="flex space-x-4">
              <Link href="#" className="text-[#f97316] hover:text-black transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-[#f97316] hover:text-black transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-[#f97316] hover:text-black transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900">Shop</h3>
            <ul role="list" className="mt-4 space-y-2">
              <li>
                <Link href="/collections" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/category/skincare" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Skincare
                </Link>
              </li>
              <li>
                <Link href="/category/makeup" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Makeup
                </Link>
              </li>
              <li>
                <Link href="/category/fragrances" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Fragrances
                </Link>
              </li>
              <li>
                <Link href="/collections/hot-deals" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Hot Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900">Customer Care</h3>
            <ul role="list" className="mt-4 space-y-2">
              <li>
                <Link href="/admin/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Contact Us
                </Link>
              </li>
              
              <li>
                <Link href="/about-us" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Refund & Return Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900 mb-4">Contact Us</h3>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#EA580C] shrink-0" />
                <span>Lahore, Pakistan | Nationwide delivery available</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#EA580C] shrink-0" />
                <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#EA580C] shrink-0" />
                <span>hello@auerviamaison.com</span>
              </div>
              <div className="pt-2">
                <span className="text-xs text-gray-500">Curated for modern beauty routines</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#C6A24A]/30 pt-8">
          <p className="text-center text-xs leading-5 text-gray-600">
            &copy; {new Date().getFullYear()} Auerviamaison. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
