"use client";

import { Article } from "@/lib/db";

interface Props {
  article: Article;
  onToggleBookmark: (id: number) => void;
}

const SOURCE_ICONS: Record<string, string> = {
  twitter: "𝕏",
  rss: "RSS",
  press: "PR",
  google_news: "G",
  gov: "Gov",
};

const CATEGORY_COLORS: Record<string, string> = {
  ai: "bg-[#e0f2fe] text-[#0369a1]",
  dx: "bg-[#ede9fe] text-[#6d28d9]",
  fintech: "bg-[#fce7f3] text-[#be185d]",
  bank_press: "bg-[#fef3c7] text-[#92400e]",
  gov: "bg-[#d1fae5] text-[#065f46]",
  general: "bg-surface text-text-secondary",
};

const CATEGORY_LABELS: Record<string, string> = {
  ai: "AI",
  dx: "DX",
  fintech: "フィンテック",
  bank_press: "銀行PR",
  gov: "官公庁",
  general: "一般",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function ArticleCard({ article, onToggleBookmark }: Props) {
  return (
    <article className="bg-white border border-border rounded-[12px] p-5 hover:shadow-[0_2px_4px_rgba(0,0,0,0.08)] transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* メタ情報行 */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-surface text-[10px] font-bold text-text-secondary">
              {SOURCE_ICONS[article.source] || "?"}
            </span>
            <span
              className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                CATEGORY_COLORS[article.category] || CATEGORY_COLORS.general
              }`}
            >
              {CATEGORY_LABELS[article.category] || article.category}
            </span>
            {article.bank_name && (
              <span className="inline-block px-2 py-0.5 rounded bg-[#fff7ed] text-[#c2410c] text-[11px] font-semibold">
                {article.bank_name}
              </span>
            )}
            {article.published_at && (
              <span className="text-[12px] text-text-disabled">
                {formatDate(article.published_at)}
              </span>
            )}
          </div>

          {/* タイトル */}
          <a
            href={article.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[16px] font-bold text-text-primary hover:text-zenn-blue transition-colors leading-[1.5] block"
          >
            {article.title}
          </a>

          {/* 抜粋 */}
          {article.content && (
            <p className="mt-2 text-[14px] text-text-secondary leading-[1.8] line-clamp-2">
              {article.content.slice(0, 200)}
            </p>
          )}

          {/* 著者 */}
          {article.author && (
            <p className="mt-2 text-[12px] text-text-disabled">
              {article.author}
            </p>
          )}
        </div>

        {/* ブックマーク */}
        <button
          onClick={() => onToggleBookmark(article.id)}
          className="flex-shrink-0 p-2 rounded-[8px] hover:bg-surface transition-colors"
          title={article.is_bookmarked ? "ブックマーク解除" : "ブックマーク"}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={article.is_bookmarked ? "#3ea8ff" : "none"}
            stroke={article.is_bookmarked ? "#3ea8ff" : "#d6e3ed"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>
    </article>
  );
}
