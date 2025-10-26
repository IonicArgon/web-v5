"use client";

import { X as CloseIcon, Menu as MenuIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// this is lwk ridiculous but we have to do it like this w/ new react caching
// lest we want to make a server component just for this
function CopyrightWithYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    const currYear = new Date().getFullYear();
    setYear(currYear);
  }, []);

  if (year === null) {
    return null;
  }

  return <span className="text-sm text-primary">© {year} Marco Tan</span>;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleNavClick = () => setOpen(false);

  return (
    <>
      {/* mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 h-12 z-40 bg-white/80 backdrop-blur border-b border-secondary/50 flex items-center justify-between px-4">
        <div className="flex items-baseline text-2xl select-none">
          <span className="text-secondary">Ionic</span>
          <span className="font-bold text-primary">Argon</span>
        </div>
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-controls="site-nav"
          aria-expanded={open}
          className="inline-flex items-center justify-center rounded-md p-2 text-dark hover:bg-secondary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={() => setOpen(true)}
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      {/* overlay when menu open on mobile */}
      {open ? (
        <button
          type="button"
          aria-hidden
          className="md:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      ) : null}

      {/* sidebar nav */}
      <nav
        id="site-nav"
        className={`fixed md:fixed top-0 left-0 z-50 h-screen w-64 flex flex-col items-end p-6 bg-white md:bg-transparent transition-transform duration-200 ease-out before:content-[''] before:absolute before:right-1 before:top-6 before:bottom-6 before:w-0.5 before:bg-secondary before:pointer-events-none ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* close button for mobile */}
        <div className="md:hidden w-full flex items-center justify-between mb-4">
          <div className="flex text-3xl">
            <h1 className="text-secondary">Ionic</h1>
            <h2 className="font-bold text-primary">Argon</h2>
          </div>
          <button
            type="button"
            aria-label="Close navigation menu"
            className="inline-flex items-center justify-center rounded-md p-2 text-dark hover:bg-secondary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setOpen(false)}
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        {/* brand (desktop) */}
        <div className="hidden md:flex text-4xl mb-4">
          <h1 className="text-secondary">Ionic</h1>
          <h2 className="font-bold text-primary">Argon</h2>
        </div>

        <ul className="flex flex-col gap-2 text-xl w-full md:w-auto items-end">
          <li>
            <Link
              href="/"
              className="hover:text-primary transition-colors"
              onClick={handleNavClick}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="hover:text-primary transition-colors"
              onClick={handleNavClick}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="hover:text-primary transition-colors"
              onClick={handleNavClick}
            >
              Blog
            </Link>
          </li>
        </ul>

        <div className="mt-auto mb-2 flex flex-col gap-1 items-end">
          <Link
            href="/rss"
            className="text-sm hover:text-primary transition-colors"
          >
            RSS Feed
          </Link>
          <Link
            href="https://github.com/IonicArgon/web-v5"
            className="text-sm hover:text-primary transition-colors"
          >
            Source Code
          </Link>
          <CopyrightWithYear />
        </div>
      </nav>
    </>
  );
}
