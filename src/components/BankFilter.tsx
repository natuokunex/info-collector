"use client";

import { useState } from "react";

interface Props {
  bankNames: string[];
  selectedBank: string;
  onBankSelect: (bank: string) => void;
}

export default function BankFilter({ bankNames, selectedBank, onBankSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (bankNames.length === 0) return null;

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-[13px] text-text-secondary hover:text-zenn-blue transition-colors"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
        銀行フィルタ
        {selectedBank && (
          <span className="ml-1 px-2 py-0.5 rounded bg-[#fff7ed] text-[#c2410c] text-[11px] font-semibold">
            {selectedBank}
          </span>
        )}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="flex flex-wrap gap-1.5 p-3 bg-[#f8fafb] rounded-[8px] border border-border max-h-[200px] overflow-y-auto">
          <button
            onClick={() => onBankSelect("")}
            className={`px-2.5 py-1 rounded-[6px] text-[12px] font-medium transition-colors ${
              selectedBank === ""
                ? "bg-zenn-blue text-white"
                : "bg-white border border-border text-text-secondary hover:border-zenn-blue"
            }`}
          >
            すべて
          </button>
          {bankNames.map((name) => (
            <button
              key={name}
              onClick={() => onBankSelect(name === selectedBank ? "" : name)}
              className={`px-2.5 py-1 rounded-[6px] text-[12px] font-medium transition-colors ${
                selectedBank === name
                  ? "bg-zenn-blue text-white"
                  : "bg-white border border-border text-text-secondary hover:border-zenn-blue"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
