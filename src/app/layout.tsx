import { ReactNode, Suspense } from "react";
import Providers from "../components/providers/providers";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import ServiceWorkerRegistration from "@/components/core/service-worker-registration";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { MetaPixel } from "@/components/integrations/meta-pixel";
import { GoogleMarketing } from "@/components/integrations/google-marketing";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Auerviamaison | Beauty, Makeup & Everyday Lifestyle Essentials",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Shop premium beauty, skincare, makeup, fragrances, accessories, watches and modern lifestyle essentials from Auerviamaison Pakistan.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Auerviamaison",
  },
  icons: {
    icon: [
      { url: "/logo/icon.png", type: "image/png" },
    ],
    shortcut: [{ url: "/logo/icon.png", type: "image/png" }],
    apple: [
      { url: "/logo/icon.png", type: "image/png" },
    ],
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } } : {}),
  } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#D34C65",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo/icon.png" />
        <link rel="shortcut icon" type="image/png" href="/logo/icon.png" />
        <link rel="apple-touch-icon" href="/logo/icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Auerviamaison" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body suppressHydrationWarning>
        <Script
          id="performance-measure-guard"
          strategy="beforeInteractive"
          src="/performance-measure-guard.js"
        />
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <GoogleMarketing />
        <Providers>
          {children}
          <SpeedInsights />
          <Analytics />
        </Providers>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
