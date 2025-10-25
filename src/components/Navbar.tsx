"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

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
  return (
    <nav className="sticky top-0 left-0 h-screen w-64 flex flex-col p-6 items-end before:content-[''] before:absolute before:right-1 before:top-6 before:bottom-6 before:w-0.5 before:bg-secondary before:pointer-events-none">
      <div className="flex text-4xl mb-4">
        <h1 className="text-secondary">Ionic</h1>
        <h2 className="font-bold text-primary">Argon</h2>
      </div>

      <ul className="flex flex-col gap-2 text-xl">
        <li>
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-primary transition-colors">
            About
          </Link>
        </li>
        <li>
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
        </li>
      </ul>

      <div className="mt-auto mb-2">
        <CopyrightWithYear />
      </div>
    </nav>
  );
}
