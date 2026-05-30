import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import SupportWidget from "@/components/SmartsuppChat";
import GTranslateWidget from "@/components/GTranslateWidget";
import TradeNotificationsWrapper from "@/components/ui/TradeNotificationsWrapper";
import dbConnect from "@/lib/mongodb";
import SupportSettings from "@/models/SupportSettings";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    siteConfig.name,
    "invest",
    siteConfig.brandPrimary,
    "SpaceX",
    "Neuralink",
    "xAI",
    "The Boring Company",
    "digital assets",
    "investment platform",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/og-image.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let supportMode: "smartsupp" | "telegram" = "smartsupp";
  let telegramUsername = "";
  try {
    await dbConnect();
    const settings = await SupportSettings.findOne().lean() as any;
    if (settings) {
      supportMode = settings.mode ?? "smartsupp";
      telegramUsername = settings.telegramUsername ?? "";
    }
  } catch {
    // fall through to defaults
  }

  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${montserrat.variable} ${inter.className} antialiased bg-black text-white w-full max-w-[100vw] overflow-x-hidden`}
      >
        <AuthProvider>
          <div className="relative w-full max-w-[100vw] overflow-x-hidden flex flex-col min-h-screen">
            {children}
          </div>
          <SupportWidget mode={supportMode} telegramUsername={telegramUsername} />
          <TradeNotificationsWrapper />
          <GTranslateWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
