import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const buttonsDir = path.join(process.cwd(), "public", "88x31");
    const files = await fs.readdir(buttonsDir);
    const data = files
      .filter(
        (file) =>
          file.endsWith(".png") ||
          file.endsWith(".gif") ||
          file.endsWith(".jpg"),
      )
      .map((file) => ({
        src: `/88x31/${file}`,
        alt: file.replace(/\.(png|gif|jpg)$/i, "").replace(/-/g, " "),
      }));

    return NextResponse.json(data, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e as Error)?.message ?? "Failed to read buttons" },
      { status: 500 },
    );
  }
}
