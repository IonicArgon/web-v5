import fs from "fs";
import path from "path";
import { baseSerialize } from "@/util/baseSerialize";
import { ClientMDX } from "@/components/ClientMDX";
import { type MDXFrontmatter } from "@/util/baseSerialize";
import { type Metadata } from "next";

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
    description: frontmatter.summary,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.summary,
    },
  } as Metadata;
}

export default async function Home() {
  const mdxSource = await getHomeContent();

  return (
    <div className="">
      <ClientMDX mdxSource={mdxSource} />
    </div>
  );
}
