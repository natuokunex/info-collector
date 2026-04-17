import * as cheerio from "cheerio";
import { insertArticle } from "./db";
import { BANKS, isDxAiRelated, isPaywalledUrl } from "./sources";
import crypto from "crypto";

function hashId(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex").slice(0, 32);
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; InfoCollector/1.0)",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// --- メガバンク スクレイパー ---

async function scrapeMufg(): Promise<number> {
  let inserted = 0;
  try {
    const html = await fetchHtml("https://www.mufg.jp/media/news/index.html");
    const $ = cheerio.load(html);
    $(".news-list__item, .c-news-list__item, article, .list-item").each((_, el) => {
      const $el = $(el);
      const $a = $el.find("a").first();
      const title = $a.text().trim() || $el.find(".title, .ttl, h3, h4").text().trim();
      let href = $a.attr("href") || "";
      if (href && !href.startsWith("http")) {
        href = `https://www.mufg.jp${href.startsWith("/") ? "" : "/"}${href}`;
      }
      const dateText = $el.find(".date, time, .news-list__date").text().trim();
      if (title && href) {
        const success = insertArticle({
          source: "press",
          source_id: hashId(href),
          title,
          url: href,
          content: null,
          author: "三菱UFJフィナンシャル・グループ",
          bank_name: "三菱UFJフィナンシャル・グループ",
          category: "bank_press",
          published_at: dateText || null,
        });
        if (success) inserted++;
      }
    });
  } catch (e) {
    console.error("MUFG スクレイピング失敗:", (e as Error).message);
  }
  return inserted;
}

async function scrapeSmfg(): Promise<number> {
  let inserted = 0;
  try {
    const html = await fetchHtml("https://www.smfg.co.jp/news/");
    const $ = cheerio.load(html);
    $(".news-list li, .newsList li, article, tr").each((_, el) => {
      const $el = $(el);
      const $a = $el.find("a").first();
      const title = $a.text().trim() || $el.find(".title, .ttl").text().trim();
      let href = $a.attr("href") || "";
      if (href && !href.startsWith("http")) {
        href = `https://www.smfg.co.jp${href.startsWith("/") ? "" : "/"}${href}`;
      }
      const dateText = $el.find(".date, time, td:first-child").text().trim();
      if (title && href && title.length > 5) {
        const success = insertArticle({
          source: "press",
          source_id: hashId(href),
          title,
          url: href,
          content: null,
          author: "三井住友フィナンシャルグループ",
          bank_name: "三井住友フィナンシャルグループ",
          category: "bank_press",
          published_at: dateText || null,
        });
        if (success) inserted++;
      }
    });
  } catch (e) {
    console.error("SMFG スクレイピング失敗:", (e as Error).message);
  }
  return inserted;
}

async function scrapeMizuho(): Promise<number> {
  let inserted = 0;
  try {
    const html = await fetchHtml("https://www.mizuho-fg.co.jp/release/index.html");
    const $ = cheerio.load(html);
    $(".news-list li, .newsList li, article, .list-news__item, dl").each((_, el) => {
      const $el = $(el);
      const $a = $el.find("a").first();
      const title = $a.text().trim() || $el.find(".title, .ttl, dd").text().trim();
      let href = $a.attr("href") || "";
      if (href && !href.startsWith("http")) {
        href = `https://www.mizuho-fg.co.jp${href.startsWith("/") ? "" : "/"}${href}`;
      }
      const dateText = $el.find(".date, time, dt").text().trim();
      if (title && href && title.length > 5) {
        const success = insertArticle({
          source: "press",
          source_id: hashId(href),
          title,
          url: href,
          content: null,
          author: "みずほフィナンシャルグループ",
          bank_name: "みずほフィナンシャルグループ",
          category: "bank_press",
          published_at: dateText || null,
        });
        if (success) inserted++;
      }
    });
  } catch (e) {
    console.error("みずほ スクレイピング失敗:", (e as Error).message);
  }
  return inserted;
}

// --- PR TIMES ---
async function collectPrTimes(): Promise<number> {
  let inserted = 0;
  const keywords = ["フィンテック", "地銀 DX", "銀行 AI", "デジタルバンキング", "オープンバンキング"];

  for (const keyword of keywords) {
    try {
      const url = `https://prtimes.jp/main/action.php?run=html&page=searchkey&search_word=${encodeURIComponent(keyword)}&response_format=rss`;
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; InfoCollector/1.0)" },
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) {
        // PR TIMESのRSSが使えない場合はHTMLをスクレイピング
        const searchUrl = `https://prtimes.jp/main/action.php?run=html&page=searchkey&search_word=${encodeURIComponent(keyword)}`;
        const html = await fetchHtml(searchUrl);
        const $ = cheerio.load(html);
        $("article, .list-article__item").each((_, el) => {
          const $el = $(el);
          const $a = $el.find("a").first();
          const title = $a.text().trim() || $el.find("h2, h3, .title").text().trim();
          let href = $a.attr("href") || "";
          if (href && !href.startsWith("http")) {
            href = `https://prtimes.jp${href}`;
          }
          if (title && href && title.length > 5) {
            const success = insertArticle({
              source: "press",
              source_id: hashId(href),
              title,
              url: href,
              content: null,
              author: "PR TIMES",
              bank_name: null,
              category: "fintech",
              published_at: null,
            });
            if (success) inserted++;
          }
        });
        continue;
      }

      const xml = await res.text();
      const $ = cheerio.load(xml, { xmlMode: true } as cheerio.CheerioParserOptions);
      $("item").each((_, el) => {
        const $el = $(el);
        const title = $el.find("title").text().trim();
        const link = $el.find("link").text().trim();
        const pubDate = $el.find("pubDate").text().trim();
        const description = $el.find("description").text().trim();
        if (title && link) {
          const success = insertArticle({
            source: "press",
            source_id: hashId(link),
            title,
            url: link,
            content: description || null,
            author: "PR TIMES",
            bank_name: null,
            category: "fintech",
            published_at: pubDate || null,
          });
          if (success) inserted++;
        }
      });
    } catch (e) {
      console.error(`PR TIMES取得失敗 [${keyword}]:`, (e as Error).message);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return inserted;
}

// --- 銀行協会 ---
async function collectBankAssociations(): Promise<number> {
  let inserted = 0;

  // 全国地方銀行協会
  try {
    const html = await fetchHtml("https://www.chiginkyo.or.jp/news/");
    const $ = cheerio.load(html);
    $("article, .news-item, .news-list li, .entry, dl").each((_, el) => {
      const $el = $(el);
      const $a = $el.find("a").first();
      const title = $a.text().trim() || $el.find(".title, dd").text().trim();
      let href = $a.attr("href") || "";
      if (href && !href.startsWith("http")) {
        href = `https://www.chiginkyo.or.jp${href.startsWith("/") ? "" : "/"}${href}`;
      }
      if (title && href && title.length > 5) {
        const success = insertArticle({
          source: "press",
          source_id: hashId(href),
          title,
          url: href,
          content: null,
          author: "全国地方銀行協会",
          bank_name: null,
          category: "bank_press",
          published_at: null,
        });
        if (success) inserted++;
      }
    });
  } catch (e) {
    console.error("地方銀行協会 スクレイピング失敗:", (e as Error).message);
  }

  return inserted;
}

// --- メインエクスポート ---
export async function collectMegaBankPress(): Promise<number> {
  const [mufg, smfg, mizuho] = await Promise.allSettled([
    scrapeMufg(),
    scrapeSmfg(),
    scrapeMizuho(),
  ]);

  let total = 0;
  if (mufg.status === "fulfilled") total += mufg.value;
  if (smfg.status === "fulfilled") total += smfg.value;
  if (mizuho.status === "fulfilled") total += mizuho.value;
  return total;
}

export { collectPrTimes, collectBankAssociations };
