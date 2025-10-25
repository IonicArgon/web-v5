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
      blogPostSlugs.map(async (slug) => {
        const frontmatter = (await getBlogPostBySlug(
          slug,
          true,
        )) as MDXFrontmatter;
        if (!frontmatter) return null;
        return { slug, frontmatter: frontmatter };
      }),
    )
  )
    .filter((post) => post !== null)
    .map((post) => {
      return {
        url: `https://ionicargon.com/blog/${post.slug}`,
        lastModified: new Date(post.frontmatter.publishedAt).toISOString(),
        priority: 0.5,
      };
    });

  const otherPages = ["", "about", "blog"];
  const otherPageEntries = (
    await Promise.all(
      otherPages.map(async (page) => {
        const filePath = path.join(
          process.cwd(),
          "src",
          "content",
          `${page || "home"}.mdx`,
        );
        const fileContent = await fs.promises.readFile(filePath, "utf-8");
        const mdxContent = await baseSerialize(fileContent);
        const frontmatter = mdxContent.frontmatter as MDXFrontmatter;
        return {
          url: `https://ionicargon.com/${page}`,
          lastModified: new Date(frontmatter.publishedAt).toISOString(),
          priority: page === "" ? 1 : 0.8,
        };
      }),
    )
  ).filter((entry) => entry !== null);

  return [...otherPageEntries, ...blogPosts];
}
