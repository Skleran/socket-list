import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import Navbar from "@/components/ui/navbar";
import { LayoutProvider } from "@/components/ui/layout-context";
// import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeFavicon } from "@/components/ui/theme-favicon";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skleran List",
  description:
    "Skleran List helps you create and share collaborative lists effortlessly — perfect for shopping, planning, and more.",
  keywords: "collaborative list, shared list, shopping list app, to-do list",

  manifest: "/manifest.json",
  appleWebApp: {
    title: "Skleran List",
    statusBarStyle: "default",
    capable: true,
  },

  other: {
    "apple-mobile-web-app-title": "Skleran List",
    "application-name": "Skleran List",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <ThemeFavicon />
        <body
          className={`${outfit.className} antialiased min-h-[100svh] w-full `}
        >
          <ConvexClientProvider>
            <ConvexQueryCacheProvider>
              <NextIntlClientProvider messages={messages}>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <LayoutProvider>
                    <main className="max-w-[800px] mx-auto px-6 pb-6">
                      <Navbar />
                      {children}
                    </main>
                    {/* <Toaster /> */}
                  </LayoutProvider>
                </ThemeProvider>
              </NextIntlClientProvider>
            </ConvexQueryCacheProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
