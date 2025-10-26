"use client";

import { ListFilter } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { MDXFrontmatter } from "@/util/baseSerialize";
import { BlogListRelDate } from "./BlogListRelDate";

function BlogListItem({
  frontmatter,
  slug,
}: {
  frontmatter: MDXFrontmatter;
  slug: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-primary">
        <Link href={`/blog/${slug}`}>{frontmatter.title}</Link>
      </h2>
      <p className="mt-2">{frontmatter.summary}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {frontmatter.tags?.map((tag) => (
          <span
            key={tag}
            className="inline-block bg-secondary text-white rounded-md px-2 py-1 text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
      <BlogListRelDate publishedAt={frontmatter.publishedAt} />
    </div>
  );
}

type PostSummary = { slug: string; frontmatter: MDXFrontmatter };

export default function BlogList() {
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<PostSummary[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/blog/posts", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
        const data: PostSummary[] = await res.json();
        if (!cancelled) setPosts(data);

        const uniqueTags: Set<string> = new Set();
        data.forEach(({ frontmatter }) => {
          frontmatter.tags?.forEach((tag) => {
            uniqueTags.add(tag);
          });
        });
        if (!cancelled) setAvailableTags(Array.from(uniqueTags));
      } catch (e: unknown) {
        if (!cancelled)
          setError((e as Error)?.message ?? "Failed to load posts");
      }
    }
    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filterPosts = useCallback(() => {
    if (!posts) return;
    if (selectedTags.length === 0) {
      setFilteredPosts(posts);
      return;
    }
    const filtered = posts.filter(({ frontmatter }) =>
      frontmatter.tags?.some((tag) => selectedTags.includes(tag)),
    );
    setFilteredPosts(filtered);
  }, [posts, selectedTags]);

  useEffect(() => {
    filterPosts();
  }, [filterPosts]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  if (!posts) {
    return <div className="text-sm text-secondary">Loading posts…</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-secondary hover:text-primary transition"
        >
          <ListFilter className="w-5 h-5" />
          <span className="font-medium">
            {showFilters ? "Hide filters" : "Show filters"}
            {selectedTags.length > 0 && ` (${selectedTags.length} active)`}
          </span>
        </button>
        {showFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`inline-block rounded-md px-2 py-1 text-xs font-medium transition ${
                  selectedTags.includes(tag)
                    ? "bg-primary text-white"
                    : "bg-secondary text-white hover:bg-primary"
                }`}
              >
                {tag}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedTags([])}
                className="inline-block rounded-md px-2 py-1 text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
      <ul>
        {(filteredPosts || posts).map(({ slug, frontmatter }) => (
          <BlogListItem key={slug} slug={slug} frontmatter={frontmatter} />
        ))}
      </ul>
    </div>
  );
}
