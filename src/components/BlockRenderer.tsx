import { memo, useEffect, useMemo, useRef, useState } from "react";
import { loadTech } from "@/lib/cdn";
import { cn } from "@/lib/utils";
import { TECH, type TechMeta } from "@/lib/types";
import type { Block, GridCell } from "@/lib/db";

export interface BlockRendererProps {
  block: Block;
  /** When true, render in a compact (inline) mode without a frame. */
  compact?: boolean;
}

/**
 * Loads the relevant CDN script/CSS, then dispatches to a typed renderer for
 * the block. Each renderer is memoized — mounting a new block makes React
 * invoke the inner renderer with a clean lifecycle.
 */
const BlockRenderer = memo(function BlockRenderer({ block, compact }: BlockRendererProps) {
  const meta = TECH[block.type];

  if (!meta) {
    return (
      <div className="glass-panel p-3 text-sm text-destructive">
        Unknown block type: {String(block.type)}
      </div>
    );
  }

  return (
    <div className={compact ? "" : "glass-card overflow-hidden"}>
      <BlockBody block={block} meta={meta} />
    </div>
  );
});

export default BlockRenderer;

const BlockBody = memo(function BlockBody({ block, meta }: { block: Block; meta: TechMeta }) {
  switch (block.type) {
    case "html":
      return <HtmlBody content={block.content} />;
    case "katex":
      return <KatexBody content={block.content} />;
    case "mermaid":
      return <MermaidBody content={block.content} />;
    case "jsxgraph":
      return <JsxGraphBody content={block.content} />;
    case "arquero":
      return <ArqueroBody content={block.content} />;
    case "plotly":
      return <PlotlyBody content={block.content} />;
    case "mathbox":
      return <MathBoxBody content={block.content} />;
    case "mathlive":
      return <MathLiveBody content={block.content} />;
    case "manim":
      return <ManimBody content={block.content} />;
    case "geogebra":
      return <GeoGebraBody content={block.content} />;
    case "grid":
      return <GridBody block={block} />;
    default:
      return (
        <div className="p-4 text-sm text-muted-foreground">
          Unsupported block type: {String((block as Block).type)}
        </div>
      );
  }
});

// =========================================================
// HTML — escape then dangerously inject.
// =========================================================
// Note: this block is intended for trusted authored content.
const HtmlBody = memo(function HtmlBody({ content }: { content: string }) {
  return (
    <div
      className="prose-lesson p-5 text-[15px] leading-relaxed"
      // eslint-disable-next-line react/no-danger -- authored HTML is the goal here.
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
});

// =========================================================
// KaTeX
// =========================================================
const KatexBody = memo(function KatexBody({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadTech("katex");
      if (cancelled || !ref.current) return;
      try {
        const katex = (window as unknown as { katex: any }).katex;
        katex.render(content, ref.current, {
          throwOnError: false,
          displayMode: content.includes("\\int") || content.includes("\\sum") || content.includes("\\frac"),
          output: "html",
        });
      } catch (e) {
        setErr(String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [content]);

  return (
    <div className="p-5 overflow-x-auto">
      {err && <div className="text-destructive text-xs mb-2">{err}</div>}
      <div ref={ref} />
    </div>
  );
});

// =========================================================
// Mermaid
// =========================================================
const MermaidBody = memo(function MermaidBody({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState<string | null>(null);
  const cacheKey = useMemo(() => content, [content]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadTech("mermaid");
      if (cancelled || !ref.current) return;
      try {
        const mermaid = (window as unknown as { mermaid: any }).mermaid;
        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains("dark") ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "inherit",
        });
        const id = `mmd-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, cacheKey);
        if (cancelled) return;
        ref.current.innerHTML = svg;
      } catch (e) {
        setErr(String((e as Error).message ?? e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cacheKey]);

  return (
    <div className="p-5">
      {err && <div className="text-destructive text-xs mb-2">{err}</div>}
      <div ref={ref} className="mermaid" />
    </div>
  );
});

// =========================================================
// JSXGraph — sandboxed iframe with srcdoc.
// =========================================================
const JsxGraphBody = memo(function JsxGraphBody({ content }: { content: string }) {
  const srcDoc = useMemo(() => buildScriptSandbox(content, "jsxgraph"), [content]);
  return (
    <iframe
      title="JSXGraph sketch"
      sandbox="allow-scripts"
      srcDoc={srcDoc}
      className="w-full h-[360px] border-0"
    />
  );
});

// =========================================================
// Arquero — script prints JSON table to a <pre>.
// =========================================================
const ArqueroBody = memo(function ArqueroBody({ content }: { content: string }) {
  const ref = useRef<HTMLPreElement>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadTech("arquero");
      if (cancelled || !ref.current) return;
      try {
        const aq = (window as unknown as { aq: any }).aq;
        const fn = new Function("aq", `try { ${content} } catch (e) { return { __error: String(e) }; }`);
        const result = fn(aq);
        if (result && result.__error) {
          setErr(result.__error);
          if (ref.current) ref.current.textContent = "";
          return;
        }
        ref.current.textContent = result?.toString?.() ?? "(no result)";
      } catch (e) {
        setErr(String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [content]);

  return (
    <div className="p-5">
      <div className="text-xs text-muted-foreground mb-2">Arquero output</div>
      {err && <div className="text-destructive text-xs mb-2">{err}</div>}
      <pre
        ref={ref}
        className="text-xs bg-black/30 dark:bg-black/50 text-foreground/90 p-3 rounded-md overflow-x-auto max-h-64"
      />
    </div>
  );
});

// =========================================================
// Plotly — JSON spec.
// =========================================================
const PlotlyBody = memo(function PlotlyBody({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadTech("plotly");
      if (cancelled || !ref.current) return;
      try {
        const Plotly = (window as unknown as { Plotly: any }).Plotly;
        const spec = JSON.parse(content);
        const data = spec.data ?? [];
        const layout = {
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          font: { color: getComputedStyle(document.body).color },
          ...(spec.layout ?? {}),
        };
        const config = { responsive: true, displayModeBar: true };
        await Plotly.newPlot(ref.current, data, layout, config);
      } catch (e) {
        setErr(String((e as Error).message ?? e));
      }
    })();
    return () => {
      cancelled = true;
      const Plotly = (window as unknown as { Plotly?: any }).Plotly;
      if (Plotly && ref.current) {
        try { Plotly.purge(ref.current); } catch { /* noop */ }
      }
    };
  }, [content]);

  return (
    <div className="p-5">
      {err && <div className="text-destructive text-xs mb-2">{err}</div>}
      <div ref={ref} className="w-full h-[360px]" />
    </div>
  );
});

// =========================================================
// MathBox — sandboxed iframe.
// =========================================================
const MathBoxBody = memo(function MathBoxBody({ content }: { content: string }) {
  const srcDoc = useMemo(() => buildScriptSandbox(content, "mathbox"), [content]);
  return (
    <iframe
      title="MathBox visualization"
      sandbox="allow-scripts"
      srcDoc={srcDoc}
      className="w-full h-[400px] border-0"
    />
  );
});

// =========================================================
// MathLive — editable math field.
// =========================================================
const MathLiveBody = memo(function MathLiveBody({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadTech("mathlive");
        if (cancelled || !ref.current) return;
        const id = `mf-${Math.random().toString(36).slice(2)}`;
        const el = document.createElement("math-field");
        el.id = id;
        el.setAttribute("default-value", content);
        ref.current.innerHTML = "";
        ref.current.appendChild(el);
      } catch (e) {
        setErr(String((e as Error).message ?? e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [content]);

  return (
    <div className="p-5">
      {err && <div className="text-destructive text-xs mb-2">{err}</div>}
      <div ref={ref} />
    </div>
  );
});

// =========================================================
// Manim — MP4 embed.
// =========================================================
const ManimBody = memo(function ManimBody({ content }: { content: string }) {
  const { url, caption } = parseManim(content);
  if (!url) {
    return (
      <div className="p-5 text-sm text-muted-foreground">
        Provide a video URL on the first line. Example:
        <pre className="mt-2 bg-black/30 p-3 rounded text-xs">
{`https://example.com/scene.mp4
Caption: short explanation here.`}
        </pre>
      </div>
    );
  }
  return (
    <div className="p-5">
      <video
        src={url}
        controls
        preload="metadata"
        className="w-full rounded-md border border-white/10 bg-black"
      />
      {caption && (
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{caption}</p>
      )}
    </div>
  );
});

// =========================================================
// GeoGebra — deployggb.js app injection.
// =========================================================
const GeoGebraBody = memo(function GeoGebraBody({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadTech("geogebra");
      if (cancelled || !ref.current) return;
      try {
        let params: Record<string, unknown>;
        try {
          params = JSON.parse(content);
        } catch {
          setErr("Invalid JSON — must be a valid GeoGebra params object.");
          return;
        }
        // Default to graphing if no appName specified
        params = {
          appName: "graphing",
          width: 800,
          height: 600,
          showToolBar: true,
          showAlgebraInput: true,
          showMenuBar: true,
          ...params,
        };
        const ggbApp = new (window as unknown as { GGBApplet: any }).GGBApplet(params, true);
        const id = `ggb-${Math.random().toString(36).slice(2, 10)}`;
        ref.current.id = id;
        ggbApp.inject(id);
      } catch (e) {
        setErr(String((e as Error).message ?? e));
      }
    })();
    return () => {
      cancelled = true;
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [content]);

  return (
    <div className="p-2">
      {err && <div className="text-destructive text-xs mb-2">{err}</div>}
      <div ref={ref} className="w-full min-h-[400px]" />
    </div>
  );
});

// =========================================================
// Grid — responsive CSS grid layout with cell blocks.
// =========================================================
const GridBody = memo(function GridBody({ block }: { block: Block }) {
  const settings = block.settings ?? {};
  const columns = (settings.gridColumns as number) ?? 2;
  const gap = (settings.gridGap as string) ?? "md";
  const align = (settings.gridAlign as string) ?? "stretch";
  const responsive = settings.responsive !== false;
  const cells = (settings.cells as GridCell[]) ?? [];

  const gapClass =
    gap === "sm" ? "gap-2" : gap === "lg" ? "gap-6" : "gap-4";
  const alignClass =
    align === "start"
      ? "items-start"
      : align === "center"
        ? "items-center"
        : align === "end"
          ? "items-end"
          : "items-stretch";

  if (cells.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        Empty grid — add cells in the editor
      </div>
    );
  }

  return (
    <div
      className={cn("grid grid-cols-1 p-5", gapClass, alignClass, "grid-body")}
      style={
        responsive
          ? ({ "--grid-cols": columns } as React.CSSProperties)
          : ({ gridTemplateColumns: `repeat(${columns}, 1fr)` } as React.CSSProperties)
      }
    >
      {cells.map((cell) => (
        <div key={cell.id} className="glass-card overflow-hidden">
          {cell.blocks.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Empty cell
            </div>
          ) : (
            cell.blocks.map((b) => <BlockRenderer key={b.id} block={b} />)
          )}
        </div>
      ))}
    </div>
  );
});

function parseManim(raw: string) {
  const lines = raw.split(/\r?\n/);
  const url = (lines[0] || "").trim();
  const caption = lines.slice(1).join("\n").replace(/^#+\s*/, "").trim();
  return { url, caption };
}

// =========================================================
// Sandbox helper — builds a self-contained iframe document for tech that
// needs more than markup (JSXGraph, MathBox).
// =========================================================
function buildScriptSandbox(script: string, kind: "jsxgraph" | "mathbox"): string {
  const meta = TECH[kind];

  const initScript = kind === "mathbox"
    ? `const box = mathbox({ element: document.getElementById('box') });
  const view = box.viewport({ ratio: 16/10, scaled: true });
  const cartesian = view.cartesian({ range: [[-2, 2], [-2, 2], [-2, 2]] });
  try { ${escapeForScript(script)} } catch (e) { document.body.appendChild(Object.assign(document.createElement('pre'), { textContent: String(e), style: 'color:red;padding:1rem' })); }`
    : `const board = JXG.JSXGraph.initBoard('box', { boundingbox: [-5, 5, 5, -5], axis: true, showNavigation: false, showZoom: false });
  try { ${escapeForScript(script)} } catch (e) { document.body.appendChild(Object.assign(document.createElement('pre'), { textContent: String(e), style: 'color:red;padding:1rem' })); }`;

  const boxDiv = kind === "mathbox"
    ? `<div id="box" style="width:100%;height:380px"></div>`
    : `<div id="box" class="jxgbox" style="width:100%;height:340px"></div>`;

  const cssLink = meta.cdnCss
    ? `<link rel="stylesheet" href="${meta.cdnCss}">`
    : "";

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  html, body { margin: 0; padding: 0; background: #000; color: #fff; font-family: ui-sans-serif, system-ui; }
  body { display: flex; align-items: stretch; justify-content: stretch; min-height: 100vh; }
</style>
${cssLink}
</head>
<body>
${boxDiv}
<script src="${meta.cdnJs}"><\/script>
<script>${initScript}<\/script>
</body>
</html>`;
}

function escapeForScript(s: string) {
  return s.replace(/<\/script>/gi, "<\\\/script>");
}
