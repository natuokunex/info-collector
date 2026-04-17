import { Article } from "./db";

interface DiscordEmbed {
  title: string;
  description: string;
  color: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  timestamp?: string;
}

export async function sendDiscordNotification(stats: {
  total: number;
  byCategory: Record<string, number>;
  topArticles: Article[];
}): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("DISCORD_WEBHOOK_URL が未設定です。通知をスキップします。");
    return;
  }

  const categoryLabels: Record<string, string> = {
    ai: "AI・テック",
    dx: "DX",
    fintech: "フィンテック",
    bank_press: "銀行プレスリリース",
    gov: "官公庁",
    general: "一般",
  };

  const categoryLines = Object.entries(stats.byCategory)
    .filter(([, count]) => count > 0)
    .map(([cat, count]) => `${categoryLabels[cat] || cat}: **${count}件**`)
    .join("\n");

  const topArticleLines = stats.topArticles
    .slice(0, 8)
    .map((a, i) => {
      const bankTag = a.bank_name ? ` [${a.bank_name}]` : "";
      const title = a.title.length > 60 ? a.title.slice(0, 60) + "…" : a.title;
      return `${i + 1}. [${title}](${a.url})${bankTag}`;
    })
    .join("\n");

  const embed: DiscordEmbed = {
    title: `📰 情報収集レポート — ${new Date().toLocaleDateString("ja-JP")}`,
    description: `本日 **${stats.total}件** の新着記事を収集しました。`,
    color: 0x3ea8ff, // Zenn Blue
    fields: [
      {
        name: "カテゴリ別",
        value: categoryLines || "なし",
        inline: false,
      },
      {
        name: "注目記事",
        value: topArticleLines || "なし",
        inline: false,
      },
    ],
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "情報収集Bot",
        embeds: [embed],
      }),
    });

    if (!res.ok) {
      console.error("Discord通知失敗:", res.status, await res.text());
    }
  } catch (e) {
    console.error("Discord通知エラー:", (e as Error).message);
  }
}
