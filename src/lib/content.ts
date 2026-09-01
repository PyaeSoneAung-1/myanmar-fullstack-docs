import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const CONTENT_DIR = path.join(process.cwd(), "content");

export interface TechMeta {
  name: string;
  nameMy: string;
  tagline: string;
  officialUrl: string;
  color: string;
  order: number;
  category: string;
  slug: string;
}

export interface PageMeta {
  title: string;
  description: string;
  order: number;
  source: string;
  status: "translated" | "partial" | "todo";
  updated: string;
  slug: string;
  tech: string;
}

export interface Category {
  key: string;
  label: string;
  techs: TechMeta[];
}

export const CATEGORIES: { key: string; label: string }[] = [
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "data", label: "Data Fetching & State" },
  { key: "tooling", label: "Tooling" },
];

export function getTechs(): TechMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const entries = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory());
  const techs: TechMeta[] = [];
  for (const e of entries) {
    const metaPath = path.join(CONTENT_DIR, e.name, "_meta.json");
    if (fs.existsSync(metaPath)) {
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as TechMeta;
        meta.category = meta.category ?? "other";
        techs.push(meta);
      } catch {
        // skip malformed meta
      }
    }
  }
  return techs.sort((a, b) => a.order - b.order);
}

export function getTech(tech: string): TechMeta | null {
  return getTechs().find((t) => t.slug === tech) ?? null;
}

export function getTechPages(tech: string): PageMeta[] {
  const dir = path.join(CONTENT_DIR, tech);
  if (!fs.existsSync(dir)) return [];
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .sort();
  const pages: PageMeta[] = [];
  for (const f of files) {
    const raw = fs.readFileSync(path.join(dir, f), "utf-8");
    const { data } = matter(raw);
    pages.push({
      title: data.title ?? f,
      description: data.description ?? "",
      order: data.order ?? 999,
      source: data.source ?? "",
      status: data.status ?? "todo",
      updated: (data.updated instanceof Date ? data.updated.toISOString().slice(0,10) : (data.updated ?? "")),
      slug: f.replace(/\.md$/, ""),
      tech,
    });
  }
  return pages.sort((a, b) => a.order - b.order);
}

export function getPage(tech: string, slug: string): { content: string; meta: PageMeta } | null {
  const file = path.join(CONTENT_DIR, tech, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);
  return {
    content,
    meta: {
      title: data.title ?? slug,
      description: data.description ?? "",
      order: data.order ?? 999,
      source: data.source ?? "",
      status: data.status ?? "todo",
      updated: (data.updated instanceof Date ? data.updated.toISOString().slice(0,10) : (data.updated ?? "")),
      slug,
      tech,
    },
  };
}

export function getAllPages(): PageMeta[] {
  return getTechs().flatMap((t) => getTechPages(t.slug));
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function getCategories(): Category[] {
  const techs = getTechs();
  return CATEGORIES.map((c) => ({
    ...c,
    techs: techs.filter((t) => t.category === c.key),
  })).filter((c) => c.techs.length > 0);
}

export function countTranslated(tech: string): { done: number; total: number } {
  const pages = getTechPages(tech);
  return {
    done: pages.filter((p) => p.status === "translated").length,
    total: pages.length,
  };
}
