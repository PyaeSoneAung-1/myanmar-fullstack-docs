"use client";

import { useState } from "react";

export default function CodeBlock({
  code,
  lang,
}: {
  code: string;
  lang?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="relative group">
      <div className="absolute right-2 top-2 z-10 flex items-center gap-2">
        {lang && (
          <span className="text-[10px] font-mono uppercase text-ink-400 bg-ink-800/80 rounded px-1.5 py-0.5">
            {lang}
          </span>
        )}
        <button
          onClick={copy}
          aria-label="Copy code"
          className="text-[11px] px-2 py-1 rounded-md bg-ink-800/80 text-ink-200 hover:bg-ink-700 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="pt-6">{code}</pre>
    </div>
  );
}
