// ============================================================
// 情報源マスタ定義
// ============================================================

// --- 銀行リスト ---
export interface BankInfo {
  name: string;
  type: "mega" | "regional" | "regional2";
  newsUrl?: string; // プレスリリースページ（メガバンク用）
}

export const BANKS: BankInfo[] = [
  // メガバンク
  { name: "三菱UFJフィナンシャル・グループ", type: "mega", newsUrl: "https://www.mufg.jp/media/news/" },
  { name: "三井住友フィナンシャルグループ", type: "mega", newsUrl: "https://www.smfg.co.jp/news/" },
  { name: "みずほフィナンシャルグループ", type: "mega", newsUrl: "https://www.mizuho-fg.co.jp/release/" },

  // 地方銀行（第一地方銀行）
  { name: "北海道銀行", type: "regional" },
  { name: "青森銀行", type: "regional" },
  { name: "みちのく銀行", type: "regional" },
  { name: "秋田銀行", type: "regional" },
  { name: "北都銀行", type: "regional" },
  { name: "荘内銀行", type: "regional" },
  { name: "山形銀行", type: "regional" },
  { name: "岩手銀行", type: "regional" },
  { name: "東北銀行", type: "regional" },
  { name: "七十七銀行", type: "regional" },
  { name: "東邦銀行", type: "regional" },
  { name: "群馬銀行", type: "regional" },
  { name: "足利銀行", type: "regional" },
  { name: "常陽銀行", type: "regional" },
  { name: "筑波銀行", type: "regional" },
  { name: "武蔵野銀行", type: "regional" },
  { name: "千葉銀行", type: "regional" },
  { name: "千葉興業銀行", type: "regional" },
  { name: "きらぼし銀行", type: "regional" },
  { name: "横浜銀行", type: "regional" },
  { name: "第四北越銀行", type: "regional" },
  { name: "北陸銀行", type: "regional" },
  { name: "富山銀行", type: "regional" },
  { name: "北國銀行", type: "regional" },
  { name: "福井銀行", type: "regional" },
  { name: "山梨中央銀行", type: "regional" },
  { name: "八十二銀行", type: "regional" },
  { name: "長野銀行", type: "regional" },
  { name: "大垣共立銀行", type: "regional" },
  { name: "十六銀行", type: "regional" },
  { name: "静岡銀行", type: "regional" },
  { name: "スルガ銀行", type: "regional" },
  { name: "清水銀行", type: "regional" },
  { name: "三十三銀行", type: "regional" },
  { name: "百五銀行", type: "regional" },
  { name: "滋賀銀行", type: "regional" },
  { name: "京都銀行", type: "regional" },
  { name: "関西みらい銀行", type: "regional" },
  { name: "池田泉州銀行", type: "regional" },
  { name: "南都銀行", type: "regional" },
  { name: "紀陽銀行", type: "regional" },
  { name: "但馬銀行", type: "regional" },
  { name: "鳥取銀行", type: "regional" },
  { name: "山陰合同銀行", type: "regional" },
  { name: "中国銀行", type: "regional" },
  { name: "広島銀行", type: "regional" },
  { name: "山口銀行", type: "regional" },
  { name: "阿波銀行", type: "regional" },
  { name: "百十四銀行", type: "regional" },
  { name: "伊予銀行", type: "regional" },
  { name: "四国銀行", type: "regional" },
  { name: "福岡銀行", type: "regional" },
  { name: "筑邦銀行", type: "regional" },
  { name: "西日本シティ銀行", type: "regional" },
  { name: "北九州銀行", type: "regional" },
  { name: "佐賀銀行", type: "regional" },
  { name: "十八親和銀行", type: "regional" },
  { name: "肥後銀行", type: "regional" },
  { name: "大分銀行", type: "regional" },
  { name: "宮崎銀行", type: "regional" },
  { name: "鹿児島銀行", type: "regional" },
  { name: "琉球銀行", type: "regional" },
  { name: "沖縄銀行", type: "regional" },

  // 第二地方銀行
  { name: "北洋銀行", type: "regional2" },
  { name: "きらやか銀行", type: "regional2" },
  { name: "北日本銀行", type: "regional2" },
  { name: "仙台銀行", type: "regional2" },
  { name: "福島銀行", type: "regional2" },
  { name: "大東銀行", type: "regional2" },
  { name: "東和銀行", type: "regional2" },
  { name: "栃木銀行", type: "regional2" },
  { name: "京葉銀行", type: "regional2" },
  { name: "東日本銀行", type: "regional2" },
  { name: "東京スター銀行", type: "regional2" },
  { name: "神奈川銀行", type: "regional2" },
  { name: "大光銀行", type: "regional2" },
  { name: "長岡信用金庫", type: "regional2" },
  { name: "富山第一銀行", type: "regional2" },
  { name: "福邦銀行", type: "regional2" },
  { name: "静岡中央銀行", type: "regional2" },
  { name: "愛知銀行", type: "regional2" },
  { name: "名古屋銀行", type: "regional2" },
  { name: "中京銀行", type: "regional2" },
  { name: "みなと銀行", type: "regional2" },
  { name: "島根銀行", type: "regional2" },
  { name: "トマト銀行", type: "regional2" },
  { name: "もみじ銀行", type: "regional2" },
  { name: "西京銀行", type: "regional2" },
  { name: "徳島大正銀行", type: "regional2" },
  { name: "香川銀行", type: "regional2" },
  { name: "愛媛銀行", type: "regional2" },
  { name: "高知銀行", type: "regional2" },
  { name: "福岡中央銀行", type: "regional2" },
  { name: "佐賀共栄銀行", type: "regional2" },
  { name: "長崎銀行", type: "regional2" },
  { name: "熊本銀行", type: "regional2" },
  { name: "豊和銀行", type: "regional2" },
  { name: "宮崎太陽銀行", type: "regional2" },
  { name: "南日本銀行", type: "regional2" },
  { name: "沖縄海邦銀行", type: "regional2" },
];

// --- RSSフィード ---
export interface RssFeedSource {
  name: string;
  url: string;
  category: string;
}

export const RSS_FEEDS: RssFeedSource[] = [
  // テック系メディア
  { name: "ITmedia AI+", url: "https://rss.itmedia.co.jp/rss/2.0/aiplus.xml", category: "ai" },
  { name: "ITmedia NEWS", url: "https://rss.itmedia.co.jp/rss/2.0/news_bursts.xml", category: "general" },
  { name: "Impress Watch", url: "https://www.watch.impress.co.jp/data/rss/2.0/ipw.xml", category: "general" },
  { name: "CNET Japan", url: "https://feeds.japan.cnet.com/rss/cnet/all.xml", category: "general" },
  { name: "ZDNet Japan", url: "https://feeds.japan.zdnet.com/rss/zdnet/all.xml", category: "general" },
  { name: "Publickey", url: "https://www.publickey1.jp/atom.xml", category: "dx" },

  // 官公庁
  { name: "金融庁", url: "https://www.fsa.go.jp/common/diet/rss/fsa_news.rdf", category: "gov" },
  { name: "日本銀行", url: "https://www.boj.or.jp/rss/whatsnew.xml", category: "gov" },
];

// --- X API 検索クエリ ---
export interface TwitterQuery {
  query: string;
  category: string;
  label: string;
}

export const TWITTER_QUERIES: TwitterQuery[] = [
  {
    query: "(生成AI OR LLM OR ChatGPT OR Claude OR Gemini) lang:ja -is:retweet",
    category: "ai",
    label: "AI全般",
  },
  {
    query: "(RAG OR AIエージェント OR 大規模言語モデル OR AI活用) lang:ja -is:retweet",
    category: "ai",
    label: "AI技術",
  },
  {
    query: "(地銀DX OR 銀行DX OR フィンテック OR fintech OR オープンバンキング) lang:ja -is:retweet",
    category: "fintech",
    label: "金融DX",
  },
  {
    query: "(DX推進 OR デジタルトランスフォーメーション OR DX事例) lang:ja -is:retweet",
    category: "dx",
    label: "DX推進",
  },
];

// --- Google News RSS用のクエリ生成 ---
export function buildGoogleNewsUrl(bankName: string): string {
  const query = encodeURIComponent(`${bankName} DX OR AI OR デジタル OR フィンテック`);
  return `https://news.google.com/rss/search?q=${query}&hl=ja&gl=JP&ceid=JP:ja`;
}

// --- 有料記事ドメイン ---
export const PAYWALLED_DOMAINS = [
  "nikkei.com",
  "nikkin.co.jp",
] as const;

export function isPaywalledUrl(url: string): boolean {
  return PAYWALLED_DOMAINS.some((domain) => url.includes(domain));
}

// --- DX/AI関連性フィルタ ---
const DX_AI_KEYWORDS = [
  "AI", "ＡＩ", "人工知能", "生成AI", "生成ＡＩ",
  "LLM", "ChatGPT", "GPT", "Claude", "Gemini",
  "DX", "ＤＸ", "デジタルトランスフォーメーション", "デジタル化", "デジタル推進",
  "フィンテック", "fintech", "FinTech",
  "オープンバンキング", "BaaS", "API連携", "ＡＰＩ",
  "RPA", "ＲＰＡ", "自動化", "業務効率化",
  "クラウド", "SaaS", "ＳａａＳ",
  "ブロックチェーン", "NFT", "暗号資産",
  "データ分析", "ビッグデータ", "機械学習", "ディープラーニング",
  "チャットボット", "RAG", "エージェント",
  "デジタルバンキング", "ネットバンキング", "スマホ決済", "キャッシュレス",
  "セキュリティ", "サイバー", "マイナンバー",
  "電子契約", "ペーパーレス", "リモート",
  "IT", "ＩＴ", "ICT", "ＩＣＴ", "IoT", "ＩｏＴ",
];

export function isDxAiRelated(title: string, content?: string | null): boolean {
  const text = `${title} ${content || ""}`;
  return DX_AI_KEYWORDS.some((kw) => text.includes(kw));
}

// --- 日経・ニッキン Google News クエリ ---
export const PAYWALLED_NEWS_QUERIES = [
  {
    name: "日経新聞（銀行DX/AI）",
    query: "site:nikkei.com 銀行 DX OR AI OR デジタル OR フィンテック",
    source: "nikkei",
  },
  {
    name: "ニッキン（銀行DX/AI）",
    query: "site:nikkin.co.jp 銀行 DX OR AI OR デジタル",
    source: "nikkin",
  },
] as const;

export function buildPaywalledNewsUrl(query: string): string {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ja&gl=JP&ceid=JP:ja`;
}

// --- カテゴリ定義 ---
export const CATEGORIES = [
  { id: "all", label: "すべて" },
  { id: "ai", label: "AI・テック" },
  { id: "dx", label: "DX" },
  { id: "fintech", label: "フィンテック" },
  { id: "bank_press", label: "銀行プレスリリース" },
  { id: "gov", label: "官公庁" },
  { id: "general", label: "一般" },
] as const;
