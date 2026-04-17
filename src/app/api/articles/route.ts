import { NextRequest, NextResponse } from "next/server";
import { getArticles, getBankNames } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const category = searchParams.get("category") || undefined;
  const bank_name = searchParams.get("bank_name") || undefined;
  const search = searchParams.get("search") || undefined;
  const bookmarked = searchParams.get("bookmarked") === "1";
  const date_from = searchParams.get("date_from") || undefined;
  const date_to = searchParams.get("date_to") || undefined;
  const limit = parseInt(searchParams.get("limit") || "30", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  const { articles, total } = getArticles({
    category,
    bank_name,
    search,
    bookmarked,
    date_from,
    date_to,
    limit,
    offset,
  });

  const bankNames = getBankNames();

  return NextResponse.json({ articles, total, bankNames });
}
