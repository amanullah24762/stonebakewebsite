import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
export const metadata: Metadata = {
  title: {
    default: "Stone Bake Pizza | Freshly Baked in Dina, Jhelum",
    template: "%s | Stone Bake Pizza",
  },
  description:
    "Freshly baked pizza, crispy burgers and your fast food favorites. Discover Stone Bake Pizza in Dina, Jhelum, Pakistan. Explore the menu and order on WhatsApp.",
  openGraph: {
    title: "Stone Bake Pizza — Crafted with Passion",
    description: "Stone-baked goodness. Right here in Dina, Jhelum.",
    type: "website",
    locale: "en_PK",
    images: [
      {
        url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${poppins.variable} ${inter.variable}`}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteShell>{children}</SiteShell>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: "Stone Bake Pizza",
              telephone: "+923256120333",
              servesCuisine: ["Pizza", "Fast Food"],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Dina",
                addressRegion: "Jhelum",
                addressCountry: "PK",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
