import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import type { MDXFrontmatter } from "@/util/baseSerialize";
import { baseSerialize } from "@/util/baseSerialize";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/util/blogUtils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPostSlugs = await getBlogPostSlugs();
  const blogPosts = (
    await Promise.all(
      blogPostSlugs.map(
        async (
          slug,
        ): Promise<{ slug: string; frontmatter: MDXFrontmatter } | null> => {
          const frontmatter = (await getBlogPostBySlug(
            slug,
            true,
          )) as MDXFrontmatter;
          if (!frontmatter) return null;
          return { slug, frontmatter };
        },
      ),
    )
  )
    .filter(
      (post): post is { slug: string; frontmatter: MDXFrontmatter } =>
        post !== null,
    )
    .map((post): MetadataRoute.Sitemap[number] => {
      return {
        url: `https://www.www.ionicargon.ca/blog/${post.slug}`,
        lastModified: new Date(
          post.frontmatter.lastUpdatedAt ?? post.frontmatter.publishedAt,
        ).toISOString(),
        changeFrequency: "monthly",
        priority: 0.5,
      };
    });

  const otherPages = ["", "about", "blog"];
  const otherPageEntries: MetadataRoute.Sitemap = await Promise.all(
    otherPages.map(async (page): Promise<MetadataRoute.Sitemap[number]> => {
      const filePath = path.join(
        process.cwd(),
        "src",
        "content",
        `${page || "home"}.mdx`,
      );
      const fileContent = await fs.promises.readFile(filePath, "utf-8");
      const mdxContent = await baseSerialize(fileContent);
      const frontmatter = mdxContent.frontmatter as MDXFrontmatter;
      const url = `https://www.www.ionicargon.ca/${page}`;
      const isHome = page === "";
      return {
        url,
        lastModified: new Date(
          frontmatter.lastUpdatedAt ?? frontmatter.publishedAt,
        ).toISOString(),
        changeFrequency: isHome ? "daily" : "weekly",
        priority: isHome ? 1 : 0.8,
      };
    }),
  );

  return [...otherPageEntries, ...blogPosts];
}
