import RssParser from "rss-parser";
import { insertArticle } from "./db";
import { RSS_FEEDS, BANKS, buildGoogleNewsUrl, isDxAiRelated, isPaywalledUrl, PAYWALLED_NEWS_QUERIES, buildPaywalledNewsUrl } from "./sources";
import crypto from "crypto";

const parser = new RssParser({
  timeout: 15000,
  headers: {
    "User-Agent": "InfoCollector/1.0",
  },
});

function hashId(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex").slice(0, 32);
}

export async function collectRssFeeds(): Promise<number> {
  let inserted = 0;

  for (const feed of RSS_FEEDS) {
    try {
      const result = await parser.parseURL(feed.url);
      for (const item of result.items) {
        const url = item.link || item.guid || "";
        const success = insertArticle({
          source: "rss",
          source_id: hashId(url || item.title || ""),
          title: item.title || "無題",
          url,
          content: item.contentSnippet || item.content || null,
          author: feed.name,
          bank_name: null,
          category: feed.category,
          published_at: item.isoDate || item.pubDate || null,
        });
        if (success) inserted++;
      }
    } catch (e) {
      console.error(`RSS取得失敗 [${feed.name}]:`, (e as Error).message);
    }
  }

  return inserted;
}

export async function collectGoogleNewsBanks(): Promise<number> {
  let inserted = 0;
  const allBanks = BANKS;

  // バッチ処理（レート制限回避のため5行ずつ）
  for (let i = 0; i < allBanks.length; i += 5) {
    const batch = allBanks.slice(i, i + 5);
    const results = await Promise.allSettled(
      batch.map(async (bank) => {
        try {
          const feedUrl = buildGoogleNewsUrl(bank.name);
          const result = await parser.parseURL(feedUrl);
          let bankInserted = 0;
          for (const item of result.items) {
            const title = item.title || "無題";
            const content = item.contentSnippet || item.content || null;

            // DX/AI関連でない記事はスキップ
            if (!isDxAiRelated(title, content)) continue;

            const url = item.link || item.guid || "";
            const paywalled = isPaywalledUrl(url) ? 1 : 0;
            const success = insertArticle({
              source: "google_news",
              source_id: hashId(url),
              title,
              url,
              content,
              author: item.creator || null,
              bank_name: bank.name,
              category: "bank_press",
              published_at: item.isoDate || item.pubDate || null,
              is_paywalled: paywalled,
            });
            if (success) bankInserted++;
          }
          return bankInserted;
        } catch (e) {
          console.error(`Google News取得失敗 [${bank.name}]:`, (e as Error).message);
          return 0;
        }
      })
    );

    for (const r of results) {
      if (r.status === "fulfilled") inserted += r.value;
    }

    // バッチ間のウェイト（Google Newsのレート制限対策）
    if (i + 5 < allBanks.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return inserted;
}

// --- 日経新聞・ニッキン（有料メディア）---
export async function collectPaywalledNews(): Promise<number> {
  let inserted = 0;

  for (const pq of PAYWALLED_NEWS_QUERIES) {
    try {
      const feedUrl = buildPaywalledNewsUrl(pq.query);
      const result = await parser.parseURL(feedUrl);

      for (const item of result.items) {
        const title = item.title || "無題";
        const url = item.link || item.guid || "";
        const content = item.contentSnippet || item.content || null;

        // DX/AI関連チェック
        if (!isDxAiRelated(title, content)) continue;

        const success = insertArticle({
          source: "google_news",
          source_id: hashId(url),
          title,
          url,
          content,
          author: pq.name,
          bank_name: null,
          category: "bank_press",
          published_at: item.isoDate || item.pubDate || null,
          is_paywalled: 1,
        });
        if (success) inserted++;
      }
    } catch (e) {
      console.error(`有料ニュース取得失敗 [${pq.name}]:`, (e as Error).message);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return inserted;
}
