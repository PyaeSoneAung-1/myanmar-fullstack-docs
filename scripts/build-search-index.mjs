// Builds public/search-index.json from content/*.md for client-side search.
// Run via `npm run build:index` (auto-run on predev / prebuild).
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const OUT = path.join(ROOT, "public", "search-index.json");

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_\-|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const index = [];
if (fs.existsSync(CONTENT_DIR)) {
  for (const tech of fs.readdirSync(CONTENT_DIR, { withFileTypes: true })) {
    if (!tech.isDirectory()) continue;
    const metaPath = path.join(CONTENT_DIR, tech.name, "_meta.json");
    if (!fs.existsSync(metaPath)) continue;
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    const files = fs
      .readdirSync(path.join(CONTENT_DIR, tech.name))
      .filter((f) => f.endsWith(".md"));
    for (const f of files) {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, tech.name, f), "utf-8");
      const { data, content } = matter(raw);
      index.push({
        id: `${tech.name}/${f.replace(/\.md$/, "")}`,
        tech: tech.name,
        techName: meta.name,
        color: meta.color,
        slug: f.replace(/\.md$/, ""),
        title: data.title ?? f,
        description: data.description ?? "",
        text: stripMarkdown(content).slice(0, 800),
        status: data.status ?? "todo",
      });
    }
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(index));
console.log(`search-index.json: ${index.length} pages`);
