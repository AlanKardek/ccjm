import type { Metadata } from "next";
import type { Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://josue-montello.vercel.app"),
  title: {
    default: "Montello | Comunidade literária",
    template: "%s | Montello",
  },
  description:
    "Comunidade literária dedicada à vida e às obras de Josué Montello, com catálogo, resenhas, favoritos e status de leitura.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon-192.svg",
  },
  openGraph: {
    title: "Montello | Comunidade literária",
    description: "Descubra, leia, resenhe e favorite obras de Josué Montello.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  themeColor: "#2b2118",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
