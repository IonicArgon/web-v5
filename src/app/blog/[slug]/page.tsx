import type { Metadata } from "next";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Suspense } from "react";
import { ClientMDX } from "@/components/ClientMDX";
import type { MDXFrontmatter } from "@/util/baseSerialize";
import { getBlogPostBySlug } from "@/util/blogUtils";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, true);
  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const frontmatter = post as MDXFrontmatter;

  return {
    title: frontmatter.title,
    description: frontmatter.summary,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.summary,
    },
  } as Metadata;
}

async function BlogPostContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = (await getBlogPostBySlug(
    slug,
    false,
  )) as MDXRemoteSerializeResult;
  if (!post) {
    return <div>Post not found.</div>;
  }

  return <ClientMDX mdxSource={post} />;
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <Suspense fallback={<div>Loading post...</div>}>
      <BlogPostContent params={Promise.resolve(params)} />
    </Suspense>
  );
}
