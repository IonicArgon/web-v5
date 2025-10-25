import type { MDXFrontmatter } from "@/util/baseSerialize";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/util/blogUtils";

export async function GET(_request: Request) {
  const slugs = await getBlogPostSlugs();
  const blogPosts = (
    await Promise.all(
      slugs.map(async (slug) => {
        const frontmatter = (await getBlogPostBySlug(
          slug,
          true,
        )) as MDXFrontmatter;
        if (!frontmatter) return null;
        return { slug, frontmatter: frontmatter };
      }),
    )
  ).filter((post) => post !== null);

  const rssItems = blogPosts
    .map((post) => {
      const publishedDate = new Date(
        post.frontmatter.publishedAt,
      ).toUTCString();
      return `
      <item>
        <title>${post.frontmatter.title}</title>
        <link>https://ionicargon.ca/blog/${post.slug}</link>
        <pubDate>${publishedDate}</pubDate>
        <description>${post.frontmatter.summary}</description>
      </item>
    `;
    })
    .join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>IonicArgon Blog</title>
      <link>https://ionicargon.ca</link>
      <description>Marco Tan's blog posts.</description>
      ${rssItems}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
