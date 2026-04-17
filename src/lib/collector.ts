import { collectRssFeeds, collectGoogleNewsBanks, collectPaywalledNews } from "./rss";
import { collectTwitter } from "./twitter";
import { collectMegaBankPress, collectPrTimes, collectBankAssociations } from "./scraper";
import { sendDiscordNotification } from "./discord";
import { getDb, Article } from "./db";

export interface CollectionResult {
  total: number;
  bySource: Record<string, number>;
  byCategory: Record<string, number>;
  duration: number;
}

export async function runCollection(): Promise<CollectionResult> {
  const start = Date.now();
  console.log("=== 情報収集開始 ===", new Date().toLocaleString("ja-JP"));

  const results: Record<string, number> = {};

  // Phase 1: RSSフィード（高速・安定）
  console.log("[1/5] RSSフィード収集中...");
  results.rss = await collectRssFeeds();
  console.log(`  → ${results.rss}件`);

  // Phase 2: X API
  console.log("[2/5] X API収集中...");
  results.twitter = await collectTwitter();
  console.log(`  → ${results.twitter}件`);

  // Phase 3: メガバンク プレスリリース
  console.log("[3/5] メガバンク プレスリリース収集中...");
  results.megabank = await collectMegaBankPress();
  console.log(`  → ${results.megabank}件`);

  // Phase 4: PR TIMES + 銀行協会
  console.log("[4/5] PR TIMES・銀行協会 収集中...");
  const [prTimes, bankAssoc] = await Promise.allSettled([
    collectPrTimes(),
    collectBankAssociations(),
  ]);
  results.prtimes = prTimes.status === "fulfilled" ? prTimes.value : 0;
  results.bank_assoc = bankAssoc.status === "fulfilled" ? bankAssoc.value : 0;
  console.log(`  → PR TIMES: ${results.prtimes}件, 銀行協会: ${results.bank_assoc}件`);

  // Phase 5: Google News（地方銀行）— 最も時間がかかる
  console.log("[5/6] Google News（地方銀行）収集中...");
  results.google_news = await collectGoogleNewsBanks();
  console.log(`  → ${results.google_news}件`);

  // Phase 6: 日経新聞・ニッキン（有料メディア）
  console.log("[6/6] 日経新聞・ニッキン収集中...");
  results.paywalled = await collectPaywalledNews();
  console.log(`  → ${results.paywalled}件`);

  const total = Object.values(results).reduce((a, b) => a + b, 0);
  const duration = Date.now() - start;

  // カテゴリ別集計
  const db = getDb();
  const today = new Date().toISOString().split("T")[0];
  const categoryRows = db
    .prepare(
      `SELECT category, COUNT(*) as count FROM articles
       WHERE date(collected_at) = @today
       GROUP BY category`
    )
    .all({ today }) as { category: string; count: number }[];

  const byCategory: Record<string, number> = {};
  for (const row of categoryRows) {
    byCategory[row.category] = row.count;
  }

  // 注目記事（本日収集分のトップ）
  const topArticles = db
    .prepare(
      `SELECT * FROM articles
       WHERE date(collected_at) = @today
       ORDER BY published_at DESC
       LIMIT 8`
    )
    .all({ today }) as Article[];

  // Discord通知
  await sendDiscordNotification({ total, byCategory, topArticles });

  console.log(`=== 情報収集完了: ${total}件 (${(duration / 1000).toFixed(1)}秒) ===`);

  return { total, bySource: results, byCategory, duration };
}
