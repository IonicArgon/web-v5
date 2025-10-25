import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | IonicArgon",
    default: "IonicArgon",
  },
  description: "Personal website and blog of Marco Tan.",
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
        <main className="w-full max-w-prose mx-auto px-4 sm:px-6 md:px-8 pt-14 md:pt-6 md:ml-64 min-h-screen">
          <div className="mdx">{children}</div>
        </main>
      </body>
    </html>
  );
}
