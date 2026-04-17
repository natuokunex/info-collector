"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-[960px] mx-auto px-5 h-14 flex items-center justify-between">
        <h1 className="text-[18px] font-bold text-text-primary tracking-normal">
          <span className="text-zenn-blue">Info</span>Collector
        </h1>
        <span className="text-[12px] text-text-secondary">
          AI・DX・銀行ニュース
        </span>
      </div>
    </header>
  );
}
