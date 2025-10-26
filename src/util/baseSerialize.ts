import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export type MDXFrontmatter = {
  title: string;
  summary: string;
  publishedAt: string;
  lastUpdatedAt?: string;
  tags?: string[];
};

function validateFrontmatter(
  frontmatter: unknown,
  source?: string,
): MDXFrontmatter {
  const fm = frontmatter as Partial<MDXFrontmatter> | undefined;
  const sourceInfo = source ? ` in ${source}` : "";

  if (!fm) {
    throw new Error(
      `Missing frontmatter${sourceInfo}. MDX files must include frontmatter with required fields: title, summary, and publishedAt.`,
    );
  }

  if (!fm.title || typeof fm.title !== "string") {
    throw new Error(
      `Missing or invalid 'title' field in frontmatter${sourceInfo}. Expected a non-empty string.`,
    );
  }

  if (!fm.summary || typeof fm.summary !== "string") {
    throw new Error(
      `Missing or invalid 'summary' field in frontmatter${sourceInfo}. Expected a non-empty string.`,
    );
  }

  if (!fm.publishedAt || typeof fm.publishedAt !== "string") {
    throw new Error(
      `Missing or invalid 'publishedAt' field in frontmatter${sourceInfo}. Expected a date string (e.g., "2025-10-25" or "2025-10-25T22:00:00").`,
    );
  }

  // Validate optional fields if present
  if (fm.lastUpdatedAt !== undefined && typeof fm.lastUpdatedAt !== "string") {
    throw new Error(
      `Invalid 'lastUpdatedAt' field in frontmatter${sourceInfo}. Expected a date string.`,
    );
  }

  if (fm.tags !== undefined && !Array.isArray(fm.tags)) {
    throw new Error(
      `Invalid 'tags' field in frontmatter${sourceInfo}. Expected an array of strings.`,
    );
  }

  return {
    title: fm.title,
    summary: fm.summary,
    publishedAt: fm.publishedAt,
    lastUpdatedAt: fm.lastUpdatedAt,
    tags: Array.isArray(fm.tags) ? fm.tags : undefined,
  };
}

export async function baseSerialize(
  mdxContent: string,
  source?: string,
): Promise<MDXRemoteSerializeResult> {
  const serialized = await serialize(mdxContent, {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [rehypeHighlight, rehypeKatex],
      format: "mdx",
    },
    parseFrontmatter: true,
  });

  // Validate frontmatter and provide clear error messages
  try {
    serialized.frontmatter = validateFrontmatter(
      serialized.frontmatter,
      source,
    );
  } catch (error) {
    throw new Error(
      `Frontmatter validation failed: ${(error as Error).message}`,
    );
  }

  return serialized;
}
