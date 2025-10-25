import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

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
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to read buttons" },
      { status: 500 },
    );
  }
}
