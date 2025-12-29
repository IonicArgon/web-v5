"use client";

import {
  Link as AnchorLinkIcon,
  SquareArrowOutUpRight as ExternalLinkIcon,
} from "lucide-react";
import Link from "next/link";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import React from "react";
import Render88x31Buttons from "./88x31Buttons";
import BlogList from "./BlogList";
import BlueskyIcon from "./icons/Bluesky";
import GitHubIcon from "./icons/GitHub";
import LinkedInIcon from "./icons/LinkedIn";

function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href;

  // all internal links
  if (href?.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  // anchor links not including footnote links
  if (href?.startsWith("#") && !href.startsWith("#user-content-fn")) {
    return (
      <a {...props}>
        <span className="inline-flex items-center gap-1">
          {props.children}
          <AnchorLinkIcon className="inline w-4 h-4" />
        </span>
      </a>
    );
  }

  // special link cases
  if (href?.startsWith("https://bsky.app/")) {
    return (
      <a {...props} target="_blank" rel="noopener noreferrer">
        <span className="inline-flex items-center gap-1">
          <BlueskyIcon className="inline w-4 h-4" />
          {props.children}
        </span>
      </a>
    );
  }

  if (href?.startsWith("https://github.com/")) {
    return (
      <a {...props} target="_blank" rel="noopener noreferrer">
        <span className="inline-flex items-center gap-1">
          <GitHubIcon className="inline w-4 h-4" />
          {props.children}
        </span>
      </a>
    );
  }

  if (href?.startsWith("https://www.linkedin.com/")) {
    return (
      <a {...props} target="_blank" rel="noopener noreferrer">
        <span className="inline-flex items-center gap-1">
          <LinkedInIcon className="inline w-4 h-4" />
          {props.children}
        </span>
      </a>
    );
  }

  // external links in general that aren't covered above
  if (href?.startsWith("http://") || href?.startsWith("https://")) {
    return (
      <a {...props} target="_blank" rel="noopener noreferrer">
        <span className="inline-flex items-center gap-1">
          {props.children}
          <ExternalLinkIcon className="inline w-4 h-4" />
        </span>
      </a>
    );
  }

  // fallback for other links (e.g., mailto:, tel:, etc.)
  return <a {...props}>{props.children}</a>;
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
}

function createHeading(level: number) {
  const Heading = ({ children }: { children: string }) => {
    const slug = slugify(children);
    return React.createElement(
      `h${level}`,
      { id: slug },
      React.createElement(
        "a",
        {
          href: `#${slug}`,
          key: `link-${slug}`,
        },
        children,
      ),
    );
  };

  return Heading;
}

const components = {
  a: CustomLink,
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  Render88x31Buttons: Render88x31Buttons,
  BlogList: BlogList,
};

export function MDX({ mdxSource }: { mdxSource: MDXRemoteSerializeResult }) {
  return <MDXRemote {...mdxSource} components={components} />;
}
