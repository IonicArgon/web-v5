import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { ClientMDX } from "@/components/ClientMDX";
import type { MDXFrontmatter } from "@/util/baseSerialize";
import { baseSerialize } from "@/util/baseSerialize";

async function getAboutContent() {
  "use cache";
  const filePath = path.join(process.cwd(), "src", "content", "about.mdx");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const mdxSource = await baseSerialize(fileContent);
  return mdxSource;
}

export async function generateMetadata() {
  const mdxSource = await getAboutContent();
  const frontmatter = mdxSource.frontmatter as MDXFrontmatter;

  return {
    title: frontmatter.title,
    description: frontmatter.summary,
    alternates: {
      canonical: "https://www.ionicargon.ca/about",
    },
    openGraph: {
      type: "website",
      url: "https://www.ionicargon.ca/about",
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

export default async function About() {
  const mdxSource = await getAboutContent();

  return <ClientMDX mdxSource={mdxSource} />;
}
