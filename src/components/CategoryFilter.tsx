"use client";

import { CATEGORIES } from "@/lib/sources";

interface Props {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`whitespace-nowrap px-4 py-[6px] rounded-[8px] text-[14px] font-semibold transition-colors ${
            selected === cat.id
              ? "bg-zenn-blue text-white"
              : "bg-surface text-text-secondary hover:text-text-primary hover:bg-border"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
