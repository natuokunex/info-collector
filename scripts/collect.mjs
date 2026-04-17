#!/usr/bin/env node

/**
 * cron実行用の情報収集スクリプト
 * 使い方: node scripts/collect.mjs
 * crontab: 0 22 * * * cd /path/to/app && node scripts/collect.mjs
 * (UTC 22:00 = JST 7:00)
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function main() {
  console.log(`[${new Date().toLocaleString("ja-JP")}] 情報収集開始...`);
  console.log(`API: ${BASE_URL}/api/collect`);

  try {
    const res = await fetch(`${BASE_URL}/api/collect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(600000), // 10分タイムアウト
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`エラー: HTTP ${res.status}`, body);
      process.exit(1);
    }

    const result = await res.json();
    console.log("収集完了:", JSON.stringify(result, null, 2));
  } catch (e) {
    console.error("収集失敗:", e.message);
    process.exit(1);
  }
}

main();
