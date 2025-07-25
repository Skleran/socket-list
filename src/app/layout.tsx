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

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skleran List",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${outfit.className} antialiased min-h-[100svh] w-full `}
        >
          <ConvexClientProvider>
            <ConvexQueryCacheProvider>
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
            </ConvexQueryCacheProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
