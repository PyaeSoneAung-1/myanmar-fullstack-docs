"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MiniSearch from "minisearch";
import Link from "next/link";

interface DocEntry {
  id: string;
  tech: string;
  techName: string;
  color: string;
  slug: string;
  title: string;
  description: string;
  text: string;
  status: string;
}

export default function SearchBox() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DocEntry[]>([]);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const engineRef = useRef<MiniSearch<DocEntry> | null>(null);

  useEffect(() => {
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((data: DocEntry[]) => {
        const engine = new MiniSearch<DocEntry>({
          fields: ["title", "description", "text"],
          storeFields: ["id", "tech", "techName", "color", "slug", "title", "description", "status"],
          searchOptions: { boost: { title: 3, description: 2 }, fuzzy: 0.2, prefix: true },

        });
        engine.addAll(data);
        engineRef.current = engine;
        setLoaded(true);
      })
      .catch(() => {});
  }, []);

  const onSearch = useCallback((q: string) => {
    setQuery(q);
    const engine = engineRef.current;
    if (!engine || !q.trim()) {
      setResults([]);
      return;
    }
    const found = engine.search(q).slice(0, 12).map((r) => r as unknown as DocEntry);
    setResults(found);
    setActive(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
    else setQuery("");
  }, [open]);

  const go = (r: DocEntry) => {
    setOpen(false);
    window.location.href = `/docs/${r.tech}/${r.slug}`;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 px-3 py-1.5 text-sm text-ink-500 dark:text-ink-400 hover:border-ink-300 dark:hover:border-ink-600 transition-colors"
        aria-label="Search documentation"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span className="hidden sm:inline">Search…</span>
        <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded border border-ink-200 dark:border-ink-700 font-mono">
          Ctrl K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-[12vh] px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-100 dark:border-ink-800">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-400">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => onSearch(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="ရှာဖွေရန်… (React, state, Prisma…)"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-ink-400"
              />
              <button onClick={() => setOpen(false)} className="text-xs text-ink-400 hover:text-ink-600 px-1.5 py-0.5 rounded border border-ink-200 dark:border-ink-700">
                Esc
              </button>
            </div>
            <div className="max-h-[55vh] overflow-y-auto py-2">
              {!loaded && (
                <p className="px-4 py-3 text-sm text-ink-400">Index loading…</p>
              )}
              {loaded && query.trim() && results.length === 0 && (
                <p className="px-4 py-3 text-sm text-ink-400">
                  “{query}” အတွက် ရလဒ်မတွေ့ပါ။
                </p>
              )}
              {results.map((r, i) => (
                <Link
                  key={r.id}
                  href={`/docs/${r.tech}/${r.slug}`}
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => setActive(i)}
                  className={`block px-4 py-2.5 ${i === active ? "bg-ink-50 dark:bg-ink-800" : ""}`}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
                    <span className="font-semibold">{r.title}</span>
                    <span className="text-xs text-ink-400 ml-auto shrink-0">{r.techName}</span>
                  </div>
                  {r.description && (
                    <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400 line-clamp-1">
                      {r.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
