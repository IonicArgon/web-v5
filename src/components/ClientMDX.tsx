"use client";

import dynamic from "next/dynamic";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Suspense } from "react";
import type { MDXFrontmatter } from "@/util/baseSerialize";

const MDX = dynamic(() => import("./MDX").then((m) => ({ default: m.MDX })), {
  ssr: false,
});

const RelativeDates = dynamic(
  () => import("./RelativeDates").then((m) => ({ default: m.RelativeDates })),
  {
    ssr: false,
  },
);

export function ClientMDX({
  mdxSource,
}: {
  mdxSource: MDXRemoteSerializeResult;
}) {
  const frontmatter = mdxSource.frontmatter as MDXFrontmatter;

  return (
    <div>
      <MDX mdxSource={mdxSource} />
      <Suspense fallback={<div>Loading...</div>}>
        <RelativeDates
          publishedAt={frontmatter.publishedAt}
          lastUpdatedAt={frontmatter.lastUpdatedAt}
        />
      </Suspense>
    </div>
  );
}
