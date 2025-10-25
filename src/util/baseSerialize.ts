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

export async function baseSerialize(
  mdxContent: string,
): Promise<MDXRemoteSerializeResult> {
  const serialized = await serialize(mdxContent, {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [rehypeHighlight, rehypeKatex],
      format: "mdx",
    },
    parseFrontmatter: true,
  });
  return serialized;
}
