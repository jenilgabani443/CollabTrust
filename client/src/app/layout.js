import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import InteractiveBackground from "@/components/webgl/InteractiveBackground";
import ThemeScript from "@/components/ThemeScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CollabTrust — Creator & Brand Marketplace",
  description:
    "A premium SaaS marketplace connecting brands with trusted creators. Discover, collaborate, and manage campaigns with cryptographic trust guarantees.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-spatial text-spatial">
        <ThemeScript />
        <InteractiveBackground />
        <Providers>
          <div className="relative z-0 flex min-h-full flex-1 flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
