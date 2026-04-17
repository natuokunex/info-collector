import { NextResponse } from "next/server";
import { runCollection } from "@/lib/collector";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5分タイムアウト

export async function POST() {
  try {
    const result = await runCollection();
    return NextResponse.json(result);
  } catch (e) {
    console.error("収集エラー:", e);
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
