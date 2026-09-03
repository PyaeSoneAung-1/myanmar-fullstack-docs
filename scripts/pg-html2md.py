#!/usr/bin/env python3
"""
pg-html2md.py — Convert PostgreSQL 18.x HTML doc pages to clean Markdown.

Usage:
  python3 scripts/pg-html2md.py <out-dir> <page.html> [page.html ...]

Each page is fetched from https://www.postgresql.org/docs/current/<name>.html,
stripped of site chrome (header/nav, footer, "Submit correction", Prev/Up/Next),
and converted to GitHub-flavored Markdown suitable for the myanmar-fullstack-docs
translation pipeline. Writes <out-dir>/<name>.md and prints a manifest line per
page (name, section number, title, html bytes, md bytes).

Inline markup: code->`code`, em->*..*, strong->**..**, replaceable placeholders
inside code blocks are flattened to text; links to local .html pages are kept as
relative <name>.html[#anchor] so the translator can map them to internal routes
or absolute postgresql.org URLs later.
"""
import sys
import urllib.request
from bs4 import BeautifulSoup, NavigableString, Tag

BASE = "https://www.postgresql.org/docs/current/"
BLOCK_QUOTE_LABELS = {"note": "Note", "tip": "Tip", "important": "Important",
                      "caution": "Caution", "warning": "Warning"}


def fetch(name: str) -> str:
    req = urllib.request.Request(BASE + name + ".html",
                                 headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", "ignore")


def drop(node) -> None:
    if node:
        node.decompose()


def inline_text(el) -> str:
    """Render inline markdown for children of el (no block structure)."""
    out = []
    for child in el.children:
        if isinstance(child, NavigableString):
            out.append(str(child))
            continue
        if not isinstance(child, Tag):
            continue
        name = child.name.lower()
        if name in ("script", "style"):
            continue
        if name == "br":
            out.append("\n")
        elif name == "code" or name == "kbd" or name == "tt":
            out.append("`" + child.get_text() + "`")
        elif name in ("em", "i"):
            if child.get("class") and "replaceable" in child.get("class"):
                inner = child.get_text()
                if child.find("code"):
                    out.append("`" + child.get_text() + "`")
                else:
                    out.append(inner)
            else:
                out.append("*" + child.get_text() + "*")
        elif name in ("strong", "b"):
            out.append("**" + child.get_text() + "**")
        elif name == "var":
            out.append("`" + child.get_text() + "`")
        elif name == "a":
            href = child.get("href", "")
            text = inline_text(child).strip()
            if not text:
                text = child.get_text(" ", strip=True)
            if href.startswith("#"):
                out.append(text)  # anchors unmappable on translated headings
            elif href.startswith("http") or href.startswith("mailto"):
                out.append(f"[{text}]({href})")
            else:
                # local doc page — keep relative so translator can decide
                out.append(f"[{text}]({href})")
        elif name == "span" or name == "sub" or name == "sup" or name == "abbr":
            out.append(child.get_text("", strip=False))
        elif name in ("ul", "ol"):
            out.append("\n" + render_list(child))
        else:
            out.append(child.get_text("", strip=False))
    return "".join(out)


def render_list(ol: Tag) -> str:
    lines = []
    for i, li in enumerate(ol.find_all("li", recursive=False)):
        marker = "- "
        if ol.name == "ol":
            marker = f"{i+1}. "
        inner = block_inline(li)
        lines.append(marker + inner.replace("\n", "\n  "))
    return "\n".join(lines)


def block_inline(el: Tag) -> str:
    """Inline markdown for list items / cells (allows nested code, links)."""
    return inline_text(el).strip()


def render_table(tbl: Tag) -> str:
    rows = []
    header = []
    body = []
    for tr in tbl.find_all("tr"):
        cells = tr.find_all(["th", "td"])
        row = []
        for c in cells:
            txt = block_inline(c).replace("|", "\\|").replace("\n", " ")
            row.append(txt.strip())
        if tr.find_parent("thead"):
            header.append(row)
        else:
            body.append(row)
    if not body and header:
        body = header
        header = []
    if not body:
        return ""
    if header:
        hdr = header[0]
        ncol = len(hdr)
        out = ["| " + " | ".join(hdr) + " |",
               "| " + " | ".join(["---"] * ncol) + " |"]
        rest = header[1:] + body
    else:
        # first body row as header
        ncol = len(body[0])
        out = ["| " + " | ".join(body[0]) + " |",
               "| " + " | ".join(["---"] * ncol) + " |"]
        rest = body[1:]
    for r in rest:
        while len(r) < ncol:
            r.append("")
        out.append("| " + " | ".join(r[:ncol]) + " |")
    return "\n".join(out)


def render_block(el: Tag, level: int) -> str:
    """Convert one block-level container to markdown string."""
    name = el.name.lower()
    cls = el.get("class") or []
    if name in ("script", "style", "form"):
        return ""
    if name in ("h2", "h3", "h4"):
        for a in el.find_all("a", href="#"):
            drop(a)
        for a in el.find_all("a", href=True):
            if a.get_text(strip=True) == "#":
                drop(a)
        txt = inline_text(el).strip()
        txt = txt.replace("\xa0", " ").strip()
        n = int(name[1])
        return f"\n{'#' * n} {txt}\n"
    if name == "p":
        t = inline_text(el).strip()
        return t
    if name == "pre":
        code = el.get_text()
        code = code.replace("\xa0", " ")
        while code.startswith("\n"):
            code = code[1:]
        code = code.rstrip("\n")
        # language detection: psql sessions / outputs -> plain fence
        if any(line.strip().endswith("=#") or "=# " in line or
               line.strip().startswith(("$", "=>")) for line in code.splitlines()):
            return "\n```\n" + code + "\n```\n"
        return "\n```sql\n" + code + "\n```\n"
    if name in ("ul", "ol"):
        return render_list(el)
    if name == "table":
        return render_table(el)
    if name == "dl":
        parts = []
        for dt in el.find_all("dt", recursive=False):
            dd = dt.find_next_sibling("dd")
            term = inline_text(dt).strip()
            if dd is not None:
                parts.append(f"- **{term}** — {block_inline(dd)}")
            else:
                parts.append(f"- **{term}**")
        return "\n".join(parts)
    if name == "div":
        for c in cls:
            if c in BLOCK_QUOTE_LABELS:
                # drop the inner title heading (e.g. <h3>Tip</h3>)
                for h in el.find_all(["h2", "h3", "h4"], recursive=False):
                    drop(h)
                inner = render_children(el, level)
                label = BLOCK_QUOTE_LABELS[c]
                return "\n> **" + label + ":** " + inner.replace("\n", "\n> ")
        # generic wrapper — recurse
        return render_children(el, level)
    if name in ("blockquote", "pre"):
        return render_children(el, level)
    if name == "hr":
        return "\n---\n"
    return render_children(el, level)


def render_children(el: Tag, level: int) -> str:
    parts = []
    for child in el.children:
        if isinstance(child, NavigableString):
            s = str(child)
            if s.strip():
                parts.append(s.strip())
            continue
        if isinstance(child, Tag):
            if child.name in ("a", "span", "code", "em", "strong"):
                # inline at top-level (rare) — keep as paragraph text
                s = inline_text(child).strip()
                if s:
                    parts.append(s)
            else:
                parts.append(render_block(child, level))
    # collapse and normalize blank lines between blocks
    out = "\n\n".join(p.strip("\n") for p in parts if p.strip())
    out = out.replace("\n\n\n", "\n\n")
    return out


def convert(name: str, raw: str) -> str:
    soup = BeautifulSoup(raw, "html.parser")
    # remove chrome
    for sel in (".navheader", ".navfooter", "#docHeader",
                ".headerlink", "script", "style"):
        for node in soup.select(sel):
            drop(node)
    for form in soup.find_all("form"):
        drop(form)
    # drop elements whose text is exactly "Submit correction"
    for node in list(soup.find_all(string=lambda s: s and "Submit correction" in s)):
        t = node.parent
        if t is not None and t.name in ("h2", "a", "span", "p", "div"):
            drop(t)
        else:
            drop(node)
    dc = soup.find(id="docContent") or soup.body or soup
    md = render_children(dc, 0)
    return md.strip() + "\n"


def main() -> None:
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    outdir = sys.argv[1]
    names = sys.argv[2:]
    for name in names:
        raw = fetch(name)
        md = convert(name, raw)
        import os
        os.makedirs(outdir, exist_ok=True)
        with open(os.path.join(outdir, name + ".md"), "w", encoding="utf-8") as f:
            f.write(md)
        print(f"{name}\t{len(raw)}\t{len(md)}\t" + md.splitlines()[0][:90] if md else name)


if __name__ == "__main__":
    main()
