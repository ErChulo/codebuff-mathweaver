import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Compass, Globe, Copy, Check } from "lucide-react";
import { loadTech } from "@/lib/cdn";

const APPS = [
  { id: "graphing", label: "Graphing", description: "Plot functions, analyze curves, find intersections" },
  { id: "geometry", label: "Geometry", description: "Construct shapes, measure angles, explore transformations" },
  { id: "3d", label: "3D", description: "Surface plots, space curves, 3D solids" },
  { id: "cas", label: "CAS", description: "Symbolic algebra — factor, solve, differentiate" },
  { id: "classic", label: "Classic", description: "All GeoGebra tools in one unified view" },
  { id: "scientific", label: "Scientific", description: "Scientific calculator with graphing" },
  { id: "evaluator", label: "Evaluator", description: "Simple expression evaluator" },
  { id: "notes", label: "Notes", description: "GeoGebra Notes — combine text, math, and sketches" },
];

const PARAM_HELP: Record<string, string> = {
  showToolBar: "Show the toolbar with drawing/editing tools",
  showAlgebraInput: "Show the algebraic input field",
  showMenuBar: "Show the top menu bar",
  showResetIcon: "Show a reset button for the view",
  enableRightClick: "Enable right-click context menus",
  enableLabelDrags: "Allow dragging labels on objects",
  showZoomButtons: "Show zoom in/out buttons",
};

const DEFAULT_PARAMS: Record<string, boolean> = {
  showToolBar: true,
  showAlgebraInput: true,
  showMenuBar: false,
  showResetIcon: true,
  enableRightClick: true,
  enableLabelDrags: false,
  showZoomButtons: false,
};

export default function GeoGebra() {
  const [appName, setAppName] = useState("graphing");
  const [params, setParams] = useState<Record<string, boolean>>({ ...DEFAULT_PARAMS });
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const appKey = useRef(0);

  // Load deployggb.js on mount
  useEffect(() => {
    (async () => {
      try {
        await loadTech("geogebra");
        setLoaded(true);
      } catch {
        setErr("Failed to load GeoGebra library. Check your connection and try again.");
      }
    })();
  }, []);

  // Inject / re-inject the app when settings change
  useEffect(() => {
    if (!loaded || !containerRef.current) return;
    const key = ++appKey.current;

    const appParams: Record<string, unknown> = {
      appName,
      width,
      height,
      ...params,
      borderColor: "#888888",
    };

    // Clear previous content
    containerRef.current.innerHTML = "";

    const id = `ggb-main-${key}`;
    const div = document.createElement("div");
    div.id = id;
    containerRef.current.appendChild(div);

    try {
      const GGBApplet = (window as unknown as { GGBApplet: any }).GGBApplet;
      const applet = new GGBApplet(appParams, true);
      applet.inject(id);
      setErr(null);
    } catch (e) {
      setErr(String((e as Error).message ?? e));
    }

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [loaded, appName, width, height, params]);

  const toggleParam = (key: string) => {
    setParams((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const buildConfigJSON = () => {
    const config: Record<string, unknown> = { appName, width, height, ...params };
    return JSON.stringify(config, null, 2);
  };

  const copyConfig = async () => {
    try {
      await navigator.clipboard.writeText(buildConfigJSON());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <section className="relative overflow-hidden glass-card-strong p-8 md:p-10 quiz-glow-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 size-72 rounded-full bg-[hsl(var(--quiz-cyan)/0.25)] blur-3xl" />
          <div className="absolute -bottom-24 -left-16 size-64 rounded-full bg-[hsl(var(--quiz-magenta)/0.25)] blur-3xl" />
        </div>
        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <Globe className="size-3 quiz-cyan-text" /> GeoGebra
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-[hsl(var(--quiz-cyan))] via-[hsl(var(--quiz-magenta))] to-[hsl(var(--quiz-cyan))] bg-clip-text text-transparent">
              Interactive math apps
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Embed live GeoGebra apps — graphing calculator, geometry, 3D, CAS, and more — directly into your lessons.
            Choose an app, configure it, and copy the JSON to use as a GeoGebra block.
          </p>
        </div>
      </section>

      {/* App selector */}
      <section className="glass-card p-5">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Compass className="size-4 quiz-cyan-text" /> Choose an app
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => setAppName(app.id)}
              className={`text-left glass-panel p-3 rounded-xl hover:bg-white/5 transition-colors ${
                appName === app.id ? "ring-1 ring-primary/50 bg-white/5" : ""
              }`}
            >
              <div className="font-semibold text-sm mb-0.5">{app.label}</div>
              <div className="text-[11px] text-muted-foreground leading-snug">{app.description}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Controls */}
      <section className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <div className="glass-card p-4 space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Settings</h3>

          {/* Dimensions */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Width</label>
            <input
              type="range"
              min={400}
              max={1200}
              step={50}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">{width}px</div>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Height</label>
            <input
              type="range"
              min={300}
              max={900}
              step={50}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">{height}px</div>
          </div>

          <div className="border-t border-white/10 pt-3 space-y-1">
            {Object.keys(PARAM_HELP).map((key) => (
              <label
                key={key}
                className="flex items-center gap-2 py-1 cursor-pointer text-xs hover:text-foreground text-muted-foreground"
                title={PARAM_HELP[key]}
              >
                <input
                  type="checkbox"
                  checked={params[key] ?? false}
                  onChange={() => toggleParam(key)}
                  className="rounded"
                />
                <span>{key.replace(/^show/, "").replace(/[A-Z]/g, " $&").trim()}</span>
              </label>
            ))}
          </div>

          {err && (
            <p className="text-destructive text-xs" role="alert">
              {err}
            </p>
          )}
        </div>

        {/* Live app */}
        <div className="glass-card overflow-hidden">
          {!loaded ? (
            <div className="flex items-center justify-center h-[400px] text-sm text-muted-foreground animate-pulse">
              Loading GeoGebra…
            </div>
          ) : (
            <motion.div
              key={`${appName}-${appKey.current}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div ref={containerRef} className="min-h-[400px]" />
            </motion.div>
          )}
        </div>
      </section>

      {/* JSON config */}
      <section className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Block JSON config
          </h3>
          <button
            onClick={copyConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-primary/15 hover:bg-primary/25 transition-colors"
          >
            {copied ? (
              <>
                <Check className="size-3" /> Copied
              </>
            ) : (
              <>
                <Copy className="size-3" /> Copy
              </>
            )}
          </button>
        </div>
        <pre className="text-xs font-mono bg-black/30 dark:bg-black/50 text-foreground/90 p-4 rounded-lg overflow-x-auto leading-relaxed">
          {buildConfigJSON()}
        </pre>
        <p className="text-xs text-muted-foreground mt-3">
          Paste this JSON into a <strong>GeoGebra</strong> block in the lesson editor to embed this app. The block type
          loads GeoGebra from CDN automatically.
        </p>
      </section>
    </div>
  );
}
