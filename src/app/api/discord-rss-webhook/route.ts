import { Redis } from "@upstash/redis";
import { type NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";

const redis = Redis.fromEnv();
const parser = new Parser();
const REDIS_KEY = "last_posted_link";

function getSiteUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("Authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const siteUrl = getSiteUrl();

  if (!discordWebhookUrl) {
    return NextResponse.json(
      { error: "Discord webhook URL not configured" },
      { status: 500 },
    );
  }

  const feedUrl = `${siteUrl}/rss`;

  try {
    const feed = await parser.parseURL(feedUrl);
    if (!feed?.items?.length) {
      return NextResponse.json(
        { message: "No items found in RSS feed" },
        { status: 200 },
      );
    }

    const lastPostedLink = await redis.get<string>(REDIS_KEY);
    let lastPostedIndex = -1;
    if (lastPostedLink) {
      lastPostedIndex = feed.items.findIndex(
        (item) => item.link === lastPostedLink,
      );
    }

    const newItems =
      lastPostedIndex === -1
        ? feed.items
        : feed.items.slice(0, lastPostedIndex);

    if (newItems.length === 0) {
      return NextResponse.json(
        { message: "No new items to post" },
        { status: 200 },
      );
    }

    const newestItemLink = newItems[0].link;

    let embeds = [];
    for (const item of newItems.reverse()) {
      const { title, link, contentSnippet, pubDate } = item;
      const description = contentSnippet
        ? contentSnippet.length > 2048
          ? `${contentSnippet.slice(0, 2045)}...`
          : contentSnippet
        : "No description available.";

      embeds.push({
        title: title || "New Blog Post",
        url: link || siteUrl,
        description,
        color: 588157,
        timestamp: new Date(pubDate || "").toISOString(),
        footer: {
          text: "IonicArgon - Marco Tan's Personal Website",
        },
      });
    }
    embeds = embeds.slice(-10); // because discord webhook limit of 10 embeds

    await fetch(discordWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ embeds }),
    });

    if (newestItemLink) {
      await redis.set(REDIS_KEY, newestItemLink);
    }

    return NextResponse.json(
      { message: "New items posted to Discord", postedCount: newItems.length },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing RSS feed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
