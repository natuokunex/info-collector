"use client";

import { useState } from "react";

interface Props {
  onCollectDone?: () => void;
}

export default function Header({ onCollectDone }: Props) {
  const [collecting, setCollecting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleCollect = async () => {
    setCollecting(true);
    setResult(null);
    try {
      const res = await fetch("/api/collect", { method: "POST" });
      const data = await res.json();
      if (data.error) {
        setResult("収集失敗");
      } else {
        setResult(`${data.total}件収集完了`);
        onCollectDone?.();
      }
    } catch {
      setResult("収集失敗");
    } finally {
      setCollecting(false);
      setTimeout(() => setResult(null), 5000);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-[960px] mx-auto px-5 h-14 flex items-center justify-between">
        <h1 className="text-[18px] font-bold text-text-primary tracking-normal">
          <span className="text-zenn-blue">Natsuo</span> News
        </h1>
        <div className="flex items-center gap-3">
          {result && (
            <span className="text-[12px] text-emerald-600 font-medium">
              {result}
            </span>
          )}
          <button
            onClick={handleCollect}
            disabled={collecting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-zenn-blue text-white text-[13px] font-semibold hover:bg-zenn-blue-dark disabled:opacity-50 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={collecting ? "animate-spin" : ""}
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            {collecting ? "収集中..." : "更新"}
          </button>
          <span className="text-[12px] text-text-secondary hidden sm:inline">
            AI・DX・銀行ニュース
          </span>
        </div>
      </div>
    </header>
  );
}
