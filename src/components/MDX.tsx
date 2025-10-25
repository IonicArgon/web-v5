"use client";

import {
  Link as AnchorLinkIcon,
  SquareArrowOutUpRight as ExternalLinkIcon,
} from "lucide-react";
import Link from "next/link";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { Render88x31Buttons } from "./88x31Buttons";
import React from "react";

function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  let href = props.href;

  if (href?.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href?.startsWith("#")) {
    return (
      <a {...props}>
        <span className="inline-flex items-center gap-1">
          {props.children}
          <AnchorLinkIcon className="inline w-4 h-4" />
        </span>
      </a>
    );
  }

  // fallback, assume it's an external link
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      <span className="inline-flex items-center gap-1">
        {props.children}
        <ExternalLinkIcon className="inline w-4 h-4" />
      </span>
    </a>
  );
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level: number) {
  const Heading = ({ children }: { children: string }) => {
    let slug = slugify(children);
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

let components = {
  a: CustomLink,
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  Render88x31Buttons: Render88x31Buttons,
};

export function MDX({ mdxSource }: { mdxSource: MDXRemoteSerializeResult }) {
  return <MDXRemote {...mdxSource} components={components} />;
}
