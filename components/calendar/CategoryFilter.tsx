"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CalendarCategory } from "@/lib/calendar";

type CategoryOrAll = CalendarCategory | 'Sve';

interface CategoryFilterProps {
  value: CategoryOrAll;
  counts: Record<CalendarCategory, number>;
  onChange: (v: CategoryOrAll) => void;
}

export default function CategoryFilter({ value, counts, onChange }: CategoryFilterProps) {
  const items: Array<{ key: CategoryOrAll; label: string; count?: number }>= [
    { key: 'Sve', label: 'Sve', count: (counts.BiH ?? 0) + (counts.Region ?? 0) + (counts.Svijet ?? 0) },
    { key: 'BiH', label: 'BiH', count: counts.BiH ?? 0 },
    { key: 'Region', label: 'Region', count: counts.Region ?? 0 },
    { key: 'Svijet', label: 'Svijet', count: counts.Svijet ?? 0 },
  ];

  return (
    <div className="flex flex-col md:flex-row md:gap-8">
      {/* Desktop list */}
      <div className="hidden md:block w-64 shrink-0">
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-stone-700 mb-3">Kategorije</h3>
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.key}>
                <button
                  onClick={() => onChange(it.key)}
                  className={
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm " +
                    (value === it.key
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200")
                  }
                >
                  <span>{it.label}</span>
                  <span className={
                    "inline-flex items-center justify-center min-w-8 h-6 px-2 rounded-full text-xs font-semibold " +
                    (value === it.key ? "bg-white/20 text-white" : "bg-white text-stone-700 border border-stone-200")
                  }>
                    {it.count ?? 0}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile select */}
      <div className="md:hidden mb-4">
        <Select value={String(value)} onValueChange={(v) => onChange(v as CategoryOrAll)}>
          <SelectTrigger aria-label="Odaberi kategoriju" className="bg-white border-stone-300">
            <SelectValue placeholder="Kategorija" />
          </SelectTrigger>
          <SelectContent className="bg-white border-stone-300 shadow-lg">
            {items.map((it) => (
              <SelectItem key={it.key} value={String(it.key)}>
                {it.label}{it.count !== undefined ? ` (${it.count})` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}


