"use client";

import { formatDate } from "@/util/dateFormat";

export function RelativeDates({
  publishedAt,
  lastUpdatedAt,
}: {
  publishedAt: string;
  lastUpdatedAt?: string;
}) {
  return (
    <div className="mt-8 mb-4 text-sm font-medium text-secondary flex flex-col">
      <span>Published: {formatDate(publishedAt, true)}</span>
      {lastUpdatedAt && (
        <span>Last Updated: {formatDate(lastUpdatedAt, true)}</span>
      )}
    </div>
  );
}
