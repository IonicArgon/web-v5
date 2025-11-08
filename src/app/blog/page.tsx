import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { ClientMDX } from "@/components/ClientMDX";
import { baseSerialize, type MDXFrontmatter } from "@/util/baseSerialize";

async function getBlogHomeContent() {
  "use cache";
  const filePath = path.join(process.cwd(), "src", "content", "blog.mdx");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const mdxSource = await baseSerialize(fileContent);
  return mdxSource;
}

export async function generateMetadata() {
  const mdxSource = await getBlogHomeContent();
  const frontmatter = mdxSource.frontmatter as MDXFrontmatter;

  return {
    title: frontmatter.title,
    description: frontmatter.summary,
    alternates: {
      canonical: "https://www.ionicargon.ca/blog",
    },
    openGraph: {
      type: "website",
      url: "https://www.ionicargon.ca/blog",
      siteName: "IonicArgon",
      locale: "en_US",
      title: frontmatter.title,
      description: frontmatter.summary,
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.summary,
    },
  } as Metadata;
}

export default async function BlogHome() {
  const mdxSource = await getBlogHomeContent();

  return <ClientMDX mdxSource={mdxSource} />;
}
