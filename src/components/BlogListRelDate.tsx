"use client";

import { formatDate } from "@/util/dateFormat";

export function BlogListRelDate({ publishedAt }: { publishedAt: string }) {
  return (
    <div className="text-sm font-medium text-secondary mt-1">
      {formatDate(publishedAt, true)}
    </div>
  );
}
