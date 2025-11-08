import fs from "node:fs";
import path from "node:path";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { baseSerialize, type MDXFrontmatter } from "@/util/baseSerialize";

function getMDXFiles(dir: string): string[] {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

export function getBlogPostSlugs() {
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  const files = getMDXFiles(blogDir);
  return files.map((file) => path.basename(file, ".mdx"));
}

export async function getBlogPostBySlug(
  slug: string,
  frontmatterOnly = false,
): Promise<MDXRemoteSerializeResult | MDXFrontmatter | null> {
  "use cache";
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  const filePath = path.join(blogDir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    console.error(`Blog post not found: ${filePath}`);
    return null;
  }

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const mdxSource = await baseSerialize(fileContent, `blog/${slug}.mdx`);
    if (frontmatterOnly) {
      return mdxSource.frontmatter as MDXFrontmatter;
    }
    return mdxSource;
  } catch (error) {
    console.error(`Error processing blog post "${slug}":`, error);
    if (error instanceof Error) {
      console.error(`  Details: ${error.message}`);
    }
    return null;
  }
}
