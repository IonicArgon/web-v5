import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { ClientMDX } from "@/components/ClientMDX";
import { baseSerialize, type MDXFrontmatter } from "@/util/baseSerialize";

async function getHomeContent() {
  // 'use cache';
  const filePath = path.join(process.cwd(), "src", "content", "home.mdx");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const mdxSource = await baseSerialize(fileContent);
  return mdxSource;
}

export async function generateMetadata() {
  const mdxSource = await getHomeContent();
  const frontmatter = mdxSource.frontmatter as MDXFrontmatter;

  return {
    title: frontmatter.title,
    description: frontmatter.summary,
    alternates: {
      canonical: "https://ionicargon.ca/",
    },
    openGraph: {
      type: "website",
      url: "https://ionicargon.ca/",
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

export default async function Home() {
  const mdxSource = await getHomeContent();

  return <ClientMDX mdxSource={mdxSource} />;
}
