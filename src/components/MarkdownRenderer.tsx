import { useEffect, useMemo, useRef, useState } from "react";
import { loadTech } from "@/lib/cdn";
import type { Block, Inline } from "@/lib/markdown";
import { parseMarkdown } from "@/lib/markdown";

export interface MarkdownRendererProps {
  source: string;
  className?: string;
  /** When true, render inline content without block-level wrappers (no <div>, no <p>). */
  inline?: boolean;
}

/** Tiny markdown + LaTeX renderer. Reuses the existing KaTeX CDN loader. */
export default function MarkdownRenderer({ source, className, inline: isInline }: MarkdownRendererProps) {
  const blocks = useMemo(() => parseMarkdown(source), [source]);

  if (isInline) {
    return <RenderInlineContent blocks={blocks} />;
  }

  return (
    <div className={className ?? "md-lesson space-y-3 text-[15px] leading-relaxed"}>
      {blocks.map((b, i) => (
        <RenderBlock key={i} block={b} />
      ))}
    </div>
  );
}

/** Renders the inline children of the first paragraph without any block wrapper. */
function RenderInlineContent({ blocks }: { blocks: Block[] }) {
  const children = useMemo(() => {
    const parts: React.ReactNode[] = [];
    blocks.forEach((b, i) => {
      if (b.type === "paragraph" || b.type === "heading") {
        parts.push(<>{renderInline(b.children)}</>);
      } else {
        parts.push(<span key={i} className="text-muted-foreground">Unsupported inline block</span>);
      }
    });
    return parts;
  }, [blocks]);
  return <>{children}</>;
}

function RenderBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "heading":
      if (block.level === 1) {
        return <h1 className="text-2xl font-semibold tracking-tight">{renderInline(block.children)}</h1>;
      }
      if (block.level === 2) {
        return <h2 className="text-xl font-semibold tracking-tight">{renderInline(block.children)}</h2>;
      }
      return <h3 className="text-lg font-semibold">{renderInline(block.children)}</h3>;
    case "paragraph":
      return <p className="text-foreground/90">{renderInline(block.children)}</p>;
    case "code":
      return (
        <pre className="glass-panel px-3 py-2 rounded-md overflow-x-auto text-[12px] font-mono">
          <code data-lang={block.lang}>{block.content}</code>
        </pre>
      );
    case "ul":
      return (
        <ul className="list-disc pl-6 space-y-1">
          {block.items.map((it, i) => (
            <li key={i}>{renderInline(it)}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="list-decimal pl-6 space-y-1">
          {block.items.map((it, i) => (
            <li key={i}>{renderInline(it)}</li>
          ))}
        </ol>
      );
    case "hr":
      return <hr className="border-white/10" />;
    case "blockquote":
      return (
        <blockquote className="border-l-2 border-primary/40 pl-4 italic text-muted-foreground space-y-2">
          {block.blocks.map((bb, i) => (
            <RenderBlock key={i} block={bb} />
          ))}
        </blockquote>
      );
    default:
      return null;
  }
}

function renderInline(segs: Inline[]): React.ReactNode {
  return segs.map((s, i) => {
    switch (s.kind) {
      case "text":
        // Preserve authored whitespace; line breaks stay as spaces inside a paragraph.
        return <span key={i}>{s.text}</span>;
      case "code":
        return (
          <code
            key={i}
            className="px-1 py-0.5 rounded bg-white/10 dark:bg-white/10 font-mono text-[13px]"
          >
            {s.text}
          </code>
        );
      case "bold":
        return <strong key={i}>{renderInline(s.children)}</strong>;
      case "italic":
        return <em key={i}>{renderInline(s.children)}</em>;
      case "link":
        return (
          <a
            key={i}
            href={s.href}
            target={s.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="underline underline-offset-2 text-primary hover:text-primary/80"
          >
            {renderInline(s.children)}
          </a>
        );
      case "math":
        return s.display ? (
          <DisplayKatex key={i} tex={s.content} />
        ) : (
          <InlineKatex key={i} tex={s.content} />
        );
      default:
        return null;
    }
  });
}

/** Inline (`span`) math — sits inside a paragraph; no extra padding. */
function InlineKatex({ tex }: { tex: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadTech("katex");
      if (cancelled || !ref.current) return;
      try {
        const katex = (window as unknown as { katex: any }).katex;
        katex.render(tex, ref.current, {
          throwOnError: false,
          displayMode: false,
          output: "html",
        });
      } catch (e) {
        setErr(String((e as Error).message ?? e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tex]);
  if (err) {
    return (
      <span className="text-destructive text-xs" title={err}>
        ${tex}$
      </span>
    );
  }
  return <span ref={ref} className="inline-math" />;
}

/** Block-level math — takes its own line (`$$…$$`). */
function DisplayKatex({ tex }: { tex: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadTech("katex");
      if (cancelled || !ref.current) return;
      try {
        const katex = (window as unknown as { katex: any }).katex;
        katex.render(tex, ref.current, {
          throwOnError: false,
          displayMode: true,
          output: "html",
        });
      } catch (e) {
        setErr(String((e as Error).message ?? e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tex]);
  if (err) {
    return <div className="text-destructive text-xs">$${tex}$$</div>;
  }
  return <div ref={ref} className="my-2 overflow-x-auto display-math" />;
}
