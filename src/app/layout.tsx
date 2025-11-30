import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#588157",
};

export const metadata: Metadata = {
  title: {
    template: "%s | IonicArgon",
    default: "IonicArgon",
  },
  description: "Personal website and blog of Marco Tan.",
  metadataBase: new URL("https://www.ionicargon.ca"),
  openGraph: {
    type: "website",
    siteName: "IonicArgon",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  authors: [{ name: "Marco Tan", url: "https://www.ionicargon.ca" }],
  creator: "Marco Tan",
  keywords: ["IonicArgon", "Marco Tan", "blog", "software"],
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.className} antialiased min-h-screen`}>
        <Navbar />
        <main className="w-full max-w-1/2 mx-auto px-4 sm:px-6 md:px-8 pt-14 md:pt-6 md:ml-64 min-h-screen">
          <div className="mdx">{children}</div>
        </main>
      </body>
    </html>
  );
}
