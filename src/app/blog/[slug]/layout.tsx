import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BlogPostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <Link
        href="/blog"
        className="inline-flex items-center justify-center gap-1 text-sm mb-4"
      >
        <ArrowLeft className="h-5 w-5 shrink-0" />
        <span className="leading-5 -translate-y-0.5">Back to Blog</span>
      </Link>
      {children}
    </div>
  );
}
