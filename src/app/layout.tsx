import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
      <body
        className={`${quicksand.className} antialiased flex justify-center`}
      >
        <div className="flex min-h-screen w-fit">
          <Navbar />
          <main className="shrink-0 px-8 py-6 w-[65ch]">
            <div className="mdx">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
