import { NextRequest, NextResponse } from "next/server";
import { getRelatedArticles } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = parseInt(searchParams.get("id") || "0", 10);

  if (!id) {
    return NextResponse.json({ articles: [] });
  }

  const articles = getRelatedArticles(id, 5);
  return NextResponse.json({ articles });
}
