import { NextRequest, NextResponse } from "next/server";
import { toggleBookmark } from "@/lib/db";

export async function POST(request: NextRequest) {
  const { id } = await request.json();

  if (!id || typeof id !== "number") {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const success = toggleBookmark(id);
  return NextResponse.json({ success });
}
