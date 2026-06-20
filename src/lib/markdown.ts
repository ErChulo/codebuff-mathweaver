/**
 * Tiny markdown + LaTeX parser tailored to Math Weaver notes.
 *
 * Supports:
 *   - # / ## / ### headings
 *   - paragraphs separated by blank lines
 *   - `code` span and ```fenced code``` blocks
 *   - **bold**, *italic*
 *   - [text](url) links
 *   - unordered (-) and ordered (1.) lists
 *   - horizontal rule (---)
 *   - blockquote (> ...)
 *   - inline math: $...$   display math: $$...$$
 *
 * Authored-content is treated as trusted (same trust model as the existing
 * `HtmlBody` block). For paranoia, the inline link builder rejects URLs with
 * non-http(s)/mailto schemes.
 */

export type Inline =
  | { kind: "text"; text: string }
  | { kind: "math"; display: boolean; content: string }
  | { kind: "code"; text: string }
  | { kind: "bold"; children: Inline[] }
  | { kind: "italic"; children: Inline[] }
  | { kind: "link"; href: string; children: Inline[] };

export type Block =
  | { type: "heading"; level: 1 | 2 | 3; children: Inline[] }
  | { type: "paragraph"; children: Inline[] }
  | { type: "code"; content: string; lang?: string }
  | { type: "ul"; items: Inline[][] }
  | { type: "ol"; items: Inline[][] }
  | { type: "hr" }
  | { type: "blockquote"; blocks: Block[] }
  | { type: "math"; display: true; content: string };

/** Whitelist URL protocols so a malformed `[x](javascript:…)` can\'t bite us. */
function sanitizeHref(raw: string): string | null {
  const trimmed = raw.trim();
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  // Allow root-relative and same-site hash links.
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) return trimmed;
  return null;
}

/** Parse inline content like `hello **$a^2$** and [link](https://x.com)`. */
export function parseInline(s: string): Inline[] {
  const out: Inline[] = [];
  let i = 0;
  let buf = "";
  const flush = () => {
    if (buf) out.push({ kind: "text", text: buf });
    buf = "";
  };

  while (i < s.length) {
    // $$...$$ display math
    if (s.startsWith("$$", i)) {
      const end = s.indexOf("$$", i + 2);
      if (end !== -1) {
        flush();
        out.push({ kind: "math", display: true, content: s.slice(i + 2, end).trim() });
        i = end + 2;
        continue;
      }
    }
    // $...$ inline math (no newlines inside)
    if (s[i] === "$") {
      const end = s.indexOf("$", i + 1);
      if (end !== -1 && !s.slice(i + 1, end).includes("\
")) {
        flush();
        out.push({ kind: "math", display: false, content: s.slice(i + 1, end).trim() });
        i = end + 1;
        continue;
      }
    }
    // `code`
    if (s[i] === "`") {
      const end = s.indexOf("`", i + 1);
      if (end !== -1 && end !== i + 1) {
        flush();
        out.push({ kind: "code", text: s.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    // **bold**
    if (s.startsWith("**", i)) {
      const end = s.indexOf("**", i + 2);
      if (end !== -1 && end !== i + 2) {
        flush();
        out.push({ kind: "bold", children: parseInline(s.slice(i + 2, end)) });
        i = end + 2;
        continue;
      }
    }
    // *italic* but not when this would consume a stray bullet (`*` in prose)
    if (s[i] === "*" && !/[\s*]/.test(s[i + 1] ?? "")) {
      const end = s.indexOf("*", i + 1);
      if (end !== -1 && end !== i + 1) {
        flush();
        out.push({ kind: "italic", children: parseInline(s.slice(i + 1, end)) });
        i = end + 1;
        continue;
      }
    }
    // [text](href) — note this runs after bold/italic so ***x*** is left alone.
    if (s[i] === "[") {
      const closeText = s.indexOf("]", i + 1);
      if (closeText !== -1 && s[closeText + 1] === "(") {
        const closeHref = s.indexOf(")", closeText + 2);
        if (closeHref !== -1) {
          flush();
          const href = sanitizeHref(s.slice(closeText + 2, closeHref));
          if (href !== null) {
            out.push({
              kind: "link",
              href,
              children: parseInline(s.slice(i + 1, closeText)),
            });
            i = closeHref + 1;
            continue;
          }
          // If sanitization failed, fall through and emit the literal text.
        }
      }
    }

    buf += s[i];
    i++;
  }
  flush();
  return out;
}

/**
 * Parse a markdown string into a tree of blocks.
 * Line-based state machine — handles fenced code, lists, blockquotes, headings.
 */
export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r?\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw;

    // Skip blank lines (block separators).
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Fenced code block.
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || undefined;
      i++;
      const buf: string[] = [];
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      // skip closing fence if present
      if (i < lines.length && lines[i].startsWith("```")) i++;
      blocks.push({ type: "code", content: buf.join("\
"), lang });
      continue;
    }

    // Heading.
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length as 1 | 2 | 3;
      blocks.push({ type: "heading", level, children: parseInline(h[2]) });
      i++;
      continue;
    }

    // Horizontal rule.
    if (/^-{3,}\s*$/.test(line) || /^_{3,}\s*$/.test(line)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Unordered list.
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: Inline[][] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        const text = lines[i].replace(/^\s*[-*+]\s+/, "");
        items.push(parseInline(text));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Ordered list.
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: Inline[][] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        const text = lines[i].replace(/^\s*\d+\.\s+/, "");
        items.push(parseInline(text));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Blockquote.
    if (/^\s*>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      blocks.push({ type: "blockquote", blocks: parseMarkdown(buf.join("\
")) });
      continue;
    }

    // Loose paragraph: collect until blank or special opener.
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,3})\s+/.test(lines[i]) &&
      !/^-{3,}\s*$/.test(lines[i]) &&
      !lines[i].startsWith("```") &&
      !/^\s*[-*+]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^\s*>\s?/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push({ type: "paragraph", children: parseInline(buf.join(" ")) });
  }

  return blocks;
}
