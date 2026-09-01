#!/usr/bin/env node
/**
 * Translation Pipeline — fetches official doc sources from GitHub, chunks them,
 * translates to Burmese via an LLM API, and writes content/<tech>/<slug>.md files.
 *
 * Usage:
 *   node scripts/translate.mjs                     # all techs
 *   node scripts/translate.mjs --tech zustand      # one tech
 *   node scripts/translate.mjs --limit 5           # only first 5 pages
 *   node scripts/translate.mjs --dry-run           # fetch + chunk, no API calls
 *   node scripts/translate.mjs --stub              # fake translation (test mechanics, no key needed)
 *
 * Env:
 *   LLM_API_KEY     required (unless --stub)
 *   LLM_BASE_URL    default https://api.openai.com/v1
 *   LLM_MODEL       default gpt-4o-mini
 *
 * Progress is tracked in scripts/progress.json — already-translated pages are skipped.
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import matter from "gray-matter";

const ROOT = process.cwd();
const CACHE = path.join(ROOT, ".cache");
const CONTENT = path.join(ROOT, "content");
const SOURCES = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "sources.json"), "utf8"));
const PROGRESS_FILE = path.join(ROOT, "scripts", "progress.json");
const STYLE = fs.readFileSync(path.join(ROOT, "..", "content-drafts", "STYLE.md"), "utf-8");

const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
};
const has = (name) => args.includes(name);
const TECH = flag("--tech", null);
const LIMIT = Number(flag("--limit", "0")) || 0;
const CONCURRENCY = Number(flag("--concurrency", "3")) || 3;
const DRY = has("--dry-run");
const STUB = has("--stub");
const MODEL = process.env.LLM_MODEL ?? "gpt-4o-mini";
const BASE_URL = process.env.LLM_BASE_URL ?? "https://api.openai.com/v1";
const API_KEY = process.env.LLM_API_KEY ?? "";

const progress = fs.existsSync(PROGRESS_FILE)
  ? JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"))
  : {};

function saveProgress() {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

/** Download + extract a GitHub repo tarball into .cache (idempotent). */
function fetchRepo({ repo, branch }) {
  const dir = path.join(CACHE, repo.replace("/", "__"));
  if (fs.existsSync(dir)) return dir;
  fs.mkdirSync(CACHE, { recursive: true });
  const url = `https://codeload.github.com/${repo}/tar.gz/refs/heads/${branch}`;
  const tarball = path.join(CACHE, `${repo.replace("/", "__")}.tar.gz`);
  console.log(`↓ fetching ${repo}@${branch} …`);
  execSync(`curl -sL "${url}" -o "${tarball}"`, { stdio: "inherit" });
  fs.mkdirSync(dir, { recursive: true });
  execSync(`tar -xzf "${tarball}" -C "${dir}" --strip-components=1`, { stdio: "inherit" });
  return dir;
}

/** Match a file list against glob patterns (supports ** and *). */
function matchGlob(files, patterns) {
  const re = (p) =>
    new RegExp(
      "^" +
        p
          .split("/")
          .map((s) =>
            s
              .replace(/[.+^${}()|[\]\\]/g, "\\$&")
              .replace(/\*\*/g, "@@")
              .replace(/\*/g, "[^/]*")
              .replace(/@@/g, ".*")
          )
          .join("/") +
        "$"
    );
  const res = patterns.map(re);
  return files.filter((f) => res.some((r) => r.test(f)));
}

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

/** Split a markdown page into chunks at ## / ### boundaries. */
function chunkPage(content, maxLen = 6000) {
  const lines = content.split("\n");
  const chunks = [];
  let cur = [];
  let curLen = 0;
  for (const line of lines) {
    const isHeading = /^#{2,3}\s/.test(line);
    if (isHeading && curLen > 800 && cur.length > 4) {
      chunks.push(cur.join("\n").trim());
      cur = [];
      curLen = 0;
    }
    cur.push(line);
    curLen += line.length;
    if (curLen >= maxLen) {
      chunks.push(cur.join("\n").trim());
      cur = [];
      curLen = 0;
    }
  }
  if (cur.length) chunks.push(cur.join("\n").trim());
  return chunks.filter(Boolean);
}

async function translateChunk(text, chunkIndex, totalChunks, srcPath) {
  if (STUB) return `<!-- stub-translation of ${srcPath} -->\n\n${text}`;
  const system = `You are a professional technical translator from English to Burmese (Myanmar language). Follow this style guide exactly:\n\n${STYLE}\n\nRules: translate all prose into natural Burmese; keep ALL code blocks, inline code, commands, package names, URLs and API names in English, verbatim; keep technical terms in English mixed with Burmese grammar; output ONLY the translated markdown, no commentary.`;
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `Source file: ${srcPath}\nChunk ${chunkIndex}/${totalChunks}\n\nTranslate the following markdown to Burmese:\n\n${text}`,
        },
      ],
      temperature: 0.3,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`LLM API ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

function slugify(f) {
  return f
    .replace(/\.(mdx?|md)$/i, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

async function processTech(techSlug, cfg) {
  if (!cfg.repo) {
    console.log(`⏭  ${techSlug}: no repo source (${cfg.note})`);
    return 0;
  }
  const repoDir = fetchRepo(cfg);
  const allFiles = walk(repoDir).map((p) => path.relative(repoDir, p).replace(/\\/g, "/"));
  const files = matchGlob(allFiles, cfg.include).sort();
  if (!files.length) {
    console.log(`✗ ${techSlug}: no files matched include patterns. Top-level:`);
    console.log("  " + allFiles.slice(0, 30).join("\n  "));
    return 0;
  }
  console.log(`\n=== ${techSlug}: ${files.length} source files ===`);
  const techProgress = (progress[techSlug] ??= {});
  let done = 0;
  let queue = [];

  for (const [i, f] of files.entries()) {
    if (LIMIT && i >= LIMIT) break;
    if (techProgress[f] === "done") continue;
    const abs = path.join(repoDir, f);
    const raw = fs.readFileSync(abs, "utf-8");
    const { data, content } = matter(raw);
    const chunks = chunkPage(content);
    const slug = slugify(path.basename(f));
    queue.push({ techSlug, cfg, f, raw, data, chunks, slug, order: i + 1 });
  }

  let concurrency = CONCURRENCY;
  let i = 0;
  async function worker() {
    while (i < queue.length) {
      const item = queue[i++];
      try {
        const translated = [];
        for (let c = 0; c < item.chunks.length; c++) {
          const out = await translateChunk(item.chunks[c], c + 1, item.chunks.length, item.f);
          translated.push(out);
        }
        const body = translated.join("\n\n");
        const firstH1 = body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? data.title ?? slug;
        const source = `${cfg.officialUrl}/${path.dirname(item.f).split("/").pop() === "." ? path.basename(item.f) : item.f}`;
        const frontmatter = `---\ntitle: "${firstH1.replace(/"/g, '\\"')}"\ndescription: "Official ${cfg.officialUrl} — မြန်မာဘာသာပြန်"\norder: ${item.order}\nsource: "${source}"\nstatus: translated\nupdated: ${new Date().toISOString().slice(0, 10)}\n---\n`;
        const outDir = path.join(CONTENT, item.techSlug);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, `${item.slug}.md`), frontmatter + "\n" + body);
        techProgress[item.f] = "done";
        saveProgress();
        done++;
        console.log(`✓ ${item.techSlug}/${item.slug} (${item.chunks.length} chunks)`);
      } catch (e) {
        console.error(`✗ ${item.techSlug}/${item.slug}: ${e.message}`);
      }
    }
  }

  if (!DRY) {
    await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));
  } else {
    console.log(`[dry-run] would translate ${queue.length} pages (${queue.reduce((a, q) => a + q.chunks.length, 0)} chunks)`);
  }
  return done;
}

async function main() {
  if (!STUB && !API_KEY && !DRY) {
    console.error("LLM_API_KEY not set. Use --stub for a mechanics test or set the env var.");
    process.exit(1);
  }
  const techs = TECH ? [TECH] : Object.keys(SOURCES);
  for (const t of techs) {
    if (!SOURCES[t]) {
      console.error(`unknown tech "${t}" (available: ${Object.keys(SOURCES).join(", ")})`);
      continue;
    }
    await processTech(t, SOURCES[t]);
  }
  console.log("\nDone. Run `npm run build:index` then `npm run dev` to preview.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
