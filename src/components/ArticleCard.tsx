"use client";

import { useState } from "react";
import { Article } from "@/lib/db";

interface Props {
  article: Article;
  onToggleBookmark: (id: number) => void;
}

const SOURCE_ICONS: Record<string, string> = {
  twitter: "\ud835\udd4f",
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
  fintech: "\u30d5\u30a3\u30f3\u30c6\u30c3\u30af",
  bank_press: "\u9280\u884cPR",
  gov: "\u5b98\u516c\u5e81",
  general: "\u4e00\u822c",
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
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [showRelated, setShowRelated] = useState(false);
  const [loadingRelated, setLoadingRelated] = useState(false);

  const handleShowRelated = async () => {
    if (showRelated) {
      setShowRelated(false);
      return;
    }
    if (relatedArticles.length > 0) {
      setShowRelated(true);
      return;
    }
    setLoadingRelated(true);
    try {
      const res = await fetch(`/api/related?id=${article.id}`);
      const data = await res.json();
      setRelatedArticles(data.articles || []);
      setShowRelated(true);
    } catch (e) {
      console.error("\u95a2\u9023\u8a18\u4e8b\u53d6\u5f97\u5931\u6557:", e);
    } finally {
      setLoadingRelated(false);
    }
  };

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
            {article.is_paywalled === 1 && (
              <span className="inline-block px-2 py-0.5 rounded bg-[#fef2f2] text-[#dc2626] text-[11px] font-semibold">
                有料記事
              </span>
            )}
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

          {/* 有料記事の関連記事リンク */}
          {article.is_paywalled === 1 && (
            <div className="mt-3">
              <button
                onClick={handleShowRelated}
                className="text-[13px] text-zenn-blue hover:underline flex items-center gap-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                {loadingRelated ? "検索中..." : showRelated ? "関連記事を閉じる" : "無料の関連記事を探す"}
              </button>
              {showRelated && (
                <div className="mt-2 pl-3 border-l-2 border-[#3ea8ff33] space-y-2">
                  {relatedArticles.length === 0 ? (
                    <p className="text-[13px] text-text-disabled">関連する無料記事が見つかりませんでした</p>
                  ) : (
                    relatedArticles.map((rel) => (
                      <a
                        key={rel.id}
                        href={rel.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-[13px] text-text-secondary hover:text-zenn-blue transition-colors leading-[1.5]"
                      >
                        <span className="text-text-disabled mr-1">{rel.author || rel.source}</span>
                        {rel.title}
                      </a>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ブックマーク */}
        <button
          onClick={() => onToggleBookmark(article.id)}
          className="flex-shrink-0 p-2 rounded-[8px] hover:bg-surface transition-colors"
          title={article.is_bookmarked ? "\u30d6\u30c3\u30af\u30de\u30fc\u30af\u89e3\u9664" : "\u30d6\u30c3\u30af\u30de\u30fc\u30af"}
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
