import { NextResponse } from "next/server";
import type { MDXFrontmatter } from "@/util/baseSerialize";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/util/blogUtils";

export async function GET() {
  try {
    const slugs = getBlogPostSlugs();
    const posts = await Promise.all(
      slugs.map(async (slug) => {
        const frontmatter = (await getBlogPostBySlug(
          slug,
          true,
        )) as MDXFrontmatter;
        if (!frontmatter) throw new Error(`Post not found: ${slug}`);
        return { slug, frontmatter };
      }),
    );

    posts.sort(
      (a, b) =>
        new Date(b.frontmatter.publishedAt).getTime() -
        new Date(a.frontmatter.publishedAt).getTime(),
    );

    return NextResponse.json(posts, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e as Error)?.message ?? "Failed to load blog posts" },
      { status: 500 },
    );
  }
}
