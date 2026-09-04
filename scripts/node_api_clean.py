#!/usr/bin/env python3
"""Clean nodejs/node doc/api markdown for the Myanmar Fullstack Docs site.

Mirrors the (uncommitted) node_api_clean.py used by wave 37:
- strips <!-- ... --> generator/YAML comment blocks (multiline, fence-aware)
- drops the leading H1 title
- converts raw-HTML <table> to GFM pipe tables
- converts stray inline HTML (<code>/<kbd>/<em>/<strong>/<a>/<span>/<br>) to markdown
- leaves code fences byte-identical (workers must keep them so)

Usage: node_api_clean.py <in.md> <out.md>
"""
import re
import sys


def process_nonfence(text, fn):
    """Apply fn() only to the non-fence segments of text."""
    parts = re.split(r"(```[^\n]*\n.*?```)", text, flags=re.S)
    out = []
    for p in parts:
        if p.startswith("```"):
            out.append(p)  # fence: verbatim
        else:
            out.append(fn(p))
    return "".join(out)


def strip_html_comments(seg):
    return re.sub(r"<!--.*?-->", "", seg, flags=re.S)


def drop_leading_h1(text):
    text = text.lstrip("\n")
    if text.startswith("# "):
        first_nl = text.find("\n")
        text = text[first_nl + 1 :]
    return text


def inline_html_to_md(seg):
    if "<" not in seg:
        return seg
    seg = re.sub(r"<code>(.*?)</code>", lambda m: "`" + m.group(1) + "`", seg, flags=re.S)
    seg = re.sub(r"<kbd>(.*?)</kbd>", lambda m: "`" + m.group(1) + "`", seg, flags=re.S)
    seg = re.sub(r"<strong>(.*?)</strong>", lambda m: "**" + m.group(1) + "**", seg, flags=re.S)
    seg = re.sub(r"<b>(.*?)</b>", lambda m: "**" + m.group(1) + "**", seg, flags=re.S)
    seg = re.sub(r"<em>(.*?)</em>", lambda m: "*" + m.group(1) + "*", seg, flags=re.S)
    seg = re.sub(r"<i>(.*?)</i>", lambda m: "*" + m.group(1) + "*", seg, flags=re.S)
    seg = re.sub(r"<br\s*/?>", " ", seg)
    seg = re.sub(
        r"<a href=[\"'](.*?)[\"']>(.*?)</a>",
        lambda m: "[" + m.group(2) + "](" + m.group(1) + ")",
        seg,
        flags=re.S,
    )
    seg = re.sub(r"<span[^>]*>(.*?)</span>", r"\1", seg, flags=re.S)
    seg = re.sub(r"</?(?:sub|sup|tt|samp|var|cite|small|mark|u|s|abbr)[^>]*>", "", seg)
    seg = re.sub(r"</?(?:hr|p|div|ul|ol|li|table|thead|tbody|tr|td|th)\s*/?>", "", seg)
    return seg


def table_to_gfm(seg):
    def repl(m):
        block = m.group(0)
        rows = re.findall(r"<tr[^>]*>(.*?)</tr>", block, flags=re.S)
        parsed = []
        for r in rows:
            cells = re.findall(r"<(?:th|td)[^>]*>(.*?)</(?:th|td)>", r, flags=re.S)
            cells = [inline_html_to_md(c).strip().replace("\n", " ") for c in cells]
            parsed.append(cells)
        if not parsed:
            return ""
        widths = max(len(c) for c in parsed)
        for c in parsed:
            c.extend([""] * (widths - len(c)))
        lines = ["| " + " | ".join(parsed[0]) + " |"]
        lines.append("| " + " | ".join(["---"] * widths) + " |")
        for row in parsed[1:]:
            lines.append("| " + " | ".join(row) + " |")
        return "\n".join(lines)

    return re.sub(r"<table>.*?</table>", repl, seg, flags=re.S)


def main():
    src, dst = sys.argv[1], sys.argv[2]
    text = open(src, encoding="utf-8").read()
    text = drop_leading_h1(text)
    text = process_nonfence(text, strip_html_comments)
    text = process_nonfence(text, table_to_gfm)
    text = process_nonfence(text, inline_html_to_md)
    # collapse blank-line runs to max 1 (outside fences)
    def norm(seg):
        # collapse runs of blank lines (2+ newlines) to exactly one blank line.
        # Never merge fence-open lines with fence-close lines: keep a real newline.
        return re.sub(r"\n{2,}", "\n\n", seg)

    text = process_nonfence(text, norm)
    text = text.strip("\n") + "\n"
    open(dst, "w", encoding="utf-8").write(text)
    print(f"{src} -> {dst}: {len(text)} bytes")


if __name__ == "__main__":
    main()
