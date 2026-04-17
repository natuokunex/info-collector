import { insertArticle } from "./db";
import { TWITTER_QUERIES } from "./sources";
import crypto from "crypto";

const TWITTER_API_BASE = "https://api.twitter.com/2";

function hashId(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex").slice(0, 32);
}

interface TweetData {
  id: string;
  text: string;
  author_id?: string;
  created_at?: string;
  entities?: {
    urls?: { expanded_url: string; display_url: string }[];
  };
}

interface TwitterSearchResponse {
  data?: TweetData[];
  includes?: {
    users?: { id: string; name: string; username: string }[];
  };
  meta?: {
    result_count: number;
  };
}

export async function collectTwitter(): Promise<number> {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (!bearerToken) {
    console.warn("TWITTER_BEARER_TOKEN が未設定です。X API収集をスキップします。");
    return 0;
  }

  let inserted = 0;

  for (const tq of TWITTER_QUERIES) {
    try {
      const params = new URLSearchParams({
        query: tq.query,
        max_results: "20",
        "tweet.fields": "created_at,author_id,entities",
        expansions: "author_id",
        "user.fields": "name,username",
      });

      const res = await fetch(`${TWITTER_API_BASE}/tweets/search/recent?${params}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });

      if (!res.ok) {
        const body = await res.text();
        console.error(`X API エラー [${tq.label}]: ${res.status} ${body}`);
        continue;
      }

      const data: TwitterSearchResponse = await res.json();
      if (!data.data) continue;

      const usersMap = new Map<string, string>();
      if (data.includes?.users) {
        for (const u of data.includes.users) {
          usersMap.set(u.id, `${u.name} (@${u.username})`);
        }
      }

      for (const tweet of data.data) {
        // ツイート内のURLがあればそれをリンクに
        const linkedUrl = tweet.entities?.urls?.[0]?.expanded_url || null;
        const tweetUrl = `https://twitter.com/i/status/${tweet.id}`;

        const success = insertArticle({
          source: "twitter",
          source_id: hashId(tweet.id),
          title: tweet.text.slice(0, 140),
          url: linkedUrl || tweetUrl,
          content: tweet.text,
          author: tweet.author_id ? usersMap.get(tweet.author_id) || null : null,
          bank_name: null,
          category: tq.category,
          published_at: tweet.created_at || null,
        });
        if (success) inserted++;
      }

      // レート制限対策
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (e) {
      console.error(`X API取得失敗 [${tq.label}]:`, (e as Error).message);
    }
  }

  return inserted;
}
