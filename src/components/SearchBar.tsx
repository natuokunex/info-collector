"use client";

import { useState } from "react";

interface Props {
  onSearch: (query: string) => void;
  bankNames: string[];
  selectedBank: string;
  onBankSelect: (bank: string) => void;
}

export default function SearchBar({ onSearch, bankNames, selectedBank, onBankSelect }: Props) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="記事を検索..."
          className="flex-1 bg-white border border-border rounded-[8px] px-3 py-2 text-[16px] text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-zenn-blue h-10"
        />
        <button
          type="submit"
          className="bg-zenn-blue text-white px-5 py-2 rounded-[8px] text-[14px] font-bold hover:bg-zenn-blue-dark transition-colors h-10"
        >
          検索
        </button>
      </form>
      {bankNames.length > 0 && (
        <select
          value={selectedBank}
          onChange={(e) => onBankSelect(e.target.value)}
          className="bg-white border border-border rounded-[8px] px-3 py-2 text-[14px] text-text-primary focus:outline-none focus:border-zenn-blue h-10"
        >
          <option value="">全銀行</option>
          {bankNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
