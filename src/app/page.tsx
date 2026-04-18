"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import BankFilter from "@/components/BankFilter";
import ArticleCard from "@/components/ArticleCard";
import { Article } from "@/lib/db";

interface ArticlesResponse {
  articles: Article[];
  total: number;
  bankNames: string[];
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [bankNames, setBankNames] = useState<string[]>([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const LIMIT = 30;

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      if (search) params.set("search", search);
      if (selectedBank) params.set("bank_name", selectedBank);
      if (bookmarkedOnly) params.set("bookmarked", "1");
      if (dateFrom) params.set("date_from", dateFrom);
      if (dateTo) params.set("date_to", dateTo);
      params.set("limit", String(LIMIT));
      params.set("offset", String(page * LIMIT));

      const res = await fetch(`/api/articles?${params}`);
      const data: ArticlesResponse = await res.json();
      setArticles(data.articles);
      setTotal(data.total);
      setBankNames(data.bankNames);
    } catch (e) {
      console.error("記事取得失敗:", e);
    } finally {
      setLoading(false);
    }
  }, [category, search, selectedBank, bookmarkedOnly, dateFrom, dateTo, page]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setPage(0);
  };

  const handleSearch = (q: string) => {
    setSearch(q);
    setPage(0);
  };

  const handleBankSelect = (bank: string) => {
    setSelectedBank(bank);
    setPage(0);
  };

  const handleToggleBookmark = async (id: number) => {
    try {
      await fetch("/api/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setArticles((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, is_bookmarked: a.is_bookmarked ? 0 : 1 } : a
        )
      );
    } catch (e) {
      console.error("ブックマーク切替失敗:", e);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="max-w-[960px] mx-auto px-5 py-6">
          {/* フィルタエリア */}
          <div className="space-y-4 mb-6">
            <CategoryFilter selected={category} onSelect={handleCategoryChange} />
            <SearchBar
              onSearch={handleSearch}
              bankNames={bankNames}
              selectedBank={selectedBank}
              onBankSelect={handleBankSelect}
            />
            <BankFilter
              bankNames={bankNames}
              selectedBank={selectedBank}
              onBankSelect={handleBankSelect}
            />
            {/* 日付フィルタ */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-text-secondary whitespace-nowrap">期間:</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setPage(0);
                  }}
                  className="bg-white border border-border rounded-[8px] px-2 py-1 text-[13px] text-text-primary focus:outline-none focus:border-zenn-blue h-8"
                />
                <span className="text-[13px] text-text-disabled">〜</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPage(0);
                  }}
                  className="bg-white border border-border rounded-[8px] px-2 py-1 text-[13px] text-text-primary focus:outline-none focus:border-zenn-blue h-8"
                />
                {(dateFrom || dateTo) && (
                  <button
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                      setPage(0);
                    }}
                    className="text-[12px] text-text-disabled hover:text-text-secondary"
                  >
                    クリア
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setBookmarkedOnly(!bookmarkedOnly);
                  setPage(0);
                }}
                className={`text-[13px] px-3 py-1 rounded-[8px] border transition-colors ${
                  bookmarkedOnly
                    ? "border-zenn-blue text-zenn-blue bg-[#eff8ff]"
                    : "border-border text-text-secondary hover:border-zenn-blue"
                }`}
              >
                ★ ブックマークのみ
              </button>
              <span className="text-[13px] text-text-disabled">
                {total}件
              </span>
            </div>
          </div>

          {/* 記事一覧 */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-3 border-surface border-t-zenn-blue rounded-full animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 text-text-disabled text-[15px]">
              記事が見つかりません
            </div>
          ) : (
            <div className="space-y-3">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onToggleBookmark={handleToggleBookmark}
                />
              ))}
            </div>
          )}

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pb-8">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2 rounded-[8px] border border-border text-[14px] text-text-secondary hover:border-zenn-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                前へ
              </button>
              <span className="text-[14px] text-text-secondary px-3">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 rounded-[8px] border border-border text-[14px] text-text-secondary hover:border-zenn-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                次へ
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
