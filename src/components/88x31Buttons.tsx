"use client";

import Image from "next/image";
import React from "react";

type Button = {
  src: string;
  alt: string;
};

export default function Render88x31Buttons() {
  const [buttons, setButtons] = React.useState<Button[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/buttons88x31", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Button[];
        if (isMounted) setButtons(data);
      } catch (e: unknown) {
        if (isMounted)
          setError((e as Error)?.message ?? "Failed to load buttons");
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return <div className="text-red-600">Failed to load buttons: {error}</div>;
  }

  if (!buttons) {
    return (
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: 12 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: this is a placeholder
          <div key={i} className="h-[31px] w-[88px] border border-dark" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {buttons
        .sort((a, b) => a.src.localeCompare(b.src))
        .map((button) => (
          <div key={button.src}>
            <Image src={button.src} alt={button.alt} width={88} height={31} unoptimized />
          </div>
        ))}
    </div>
  );
}
