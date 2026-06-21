import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  GitBranch,
  Layers,
  Lightbulb,
  ListChecks,
  PenLine,
  PlusCircle,
  Sparkles,
  Target,
  Workflow,
  BookOpen,
  Sigma,
  Diamond,
  Triangle,
  Table,
  ChartScatter,
  Box,
  PenTool,
  Video,
  Globe,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StepKind = "lesson" | "quiz";

type Step = {
  kind: StepKind;
  title: string;
  duration: string;
  description: string;
};

const STEPS: Step[] = [
  {
    kind: "lesson",
    title: "Sketch the idea",
    duration: "2 min",
    description:
      "Open the lesson editor, give it a strong title, and write a one-sentence promise. The title field is the spine everything else hangs from.",
  },
  {
    kind: "lesson",
    title: "Compose blocks",
    duration: "5 min",
    description:
      "Drop in markdown, diagrams, interactive sandboxes, and live code blocks. Each block stays self-contained — reorder, duplicate, or delete without breaking the flow.",
  },
  {
    kind: "lesson",
    title: "Tag the stack",
    duration: "1 min",
    description:
      "Tag with the technology this lesson covers (React, Rust, Postgres, etc.). Tags power the lesson-to-quizz pipeline later.",
  },
  {
    kind: "quiz",
    title: "Spin off a quiz",
    duration: "3 min",
    description:
      "From any tagged lesson, click 'Generate quiz' — you'll get a draft aligned to the blocks you just authored. Edit, prune, or rewrite any question.",
  },
  {
    kind: "quiz",
    title: "Mix question types",
    duration: "4 min",
    description:
      "Combine multiple-choice, true/false, ordering, fill-in-the-blank, and free-response. Difficulty and topic tags stay consistent across types.",
  },
  {
    kind: "quiz",
    title: "Practice & refine",
    duration: "ongoing",
    description:
      "Take your own quiz. Track the answers you second-guess — those are the questions to rewrite. Iterate until your confidence is honest.",
  },
];

const PRINCIPLES = [
  {
    icon: Target,
    title: "One idea per block",
    body: "Tiny, atomic ideas compound. If a block is doing three things, split it.",
  },
  {
    icon: Workflow,
    title: "Lessons teach, quizzes prove",
    body: "A lesson opens the door; a quiz walks the learner across the threshold. Pair every lesson with at least one quiz.",
  },
  {
    icon: Layers,
    title: "Reuse, don't re-author",
    body: "Duplicate any lesson to remix. Imported lesson JSON stays editable once imported — nothing is write-once.",
  },
  {
    icon: Lightbulb,
    title: "Show the why, not just the how",
    body: "Every block should answer 'why this matters' before 'how to type it'. Mental models age better than syntax.",
  },
];

type TechGuide = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tagline: string;
  what: string;
  format: string;
  example: string;
  pitfalls: string;
  tips: string;
};

const TECH_GUIDES: TechGuide[] = [
  {
    id: "html",
    icon: BookOpen,
    label: "HTML",
    tagline: "Rich prose, structure, and embedding",
    what: "Standard HTML for prose, headings, figures, tables, lists, and links. Use it to shape the lesson's narrative alongside math and interactive blocks. The content is rendered directly in the page with full CSS support from the app's theme.",
    format: "Any valid HTML fragment — headings (`<h2>`–`<h6>`), paragraphs `<p>`, lists (`<ul>`/`<ol>`), tables (`<table>`), links (`<a>`), images (`<img>`), and inline elements (`<strong>`, `<em>`, `<code>`). Script tags are stripped for security.",
    example: `<h2>Introduction to Quadratic Functions</h2>
<p>A quadratic function is any function of the form <code>f(x) = ax² + bx + c</code> where <em>a ≠ 0</em>.</p>
<ul>
  <li><strong>Vertex form:</strong> f(x) = a(x − h)² + k</li>
  <li><strong>Roots:</strong> Use the quadratic formula</li>
</ul>`,
    pitfalls: "Script tags (`<script>`) are removed for security — use JSXGraph or MathBox for interactivity. Self-closing divs (`<div />`) don't work; always use `<div></div>`. Avoid `<style>` tags — use the app's theme system instead.",
    tips: "Use `<details>` and `<summary>` for expandable sections. Use `<figure>` + `<figcaption>` for annotated diagrams. Use `<code>` for inline code/math references and `<pre>` for code blocks. Tables can be styled with Tailwind classes via the `class` attribute.",
  },
  {
    id: "katex",
    icon: Sigma,
    label: "KaTeX",
    tagline: "Beautiful, fast math typesetting",
    what: "KaTeX renders LaTeX-quality equations in the browser with crisp typography. It's the fastest math renderer available and produces accessible HTML output. Perfect for formulas, derivations, and mathematical notation.",
    format: "LaTeX math expressions. Display mode is auto-detected for expressions containing `\int`, `\sum`, or `\frac`. Use `\,` for spacing, `\text{}` for plain text inside math, and `\\` for line breaks in multi-line expressions.",
    example: `f(x) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}`,
    pitfalls: "In JSON (e.g., inside the lesson editor), backslashes must be double-escaped: `\\\\` becomes `\\` in the rendered output. The `\\begin{align}` environment is not supported — use `\\begin{aligned}` inside `$$...$$` instead. Always use `\\,` for spacing — spaces are collapsed in math mode.",
    tips: "Use `\\displaystyle` for inline fractions that should look like display style. The renderer auto-detects display mode for `\\int`, `\\sum`, and `\\frac`. Color works with `\\color{red}{text}`. Use `\\boxed{...}` to highlight important results.",
  },
  {
    id: "mermaid",
    icon: Diamond,
    label: "Mermaid",
    tagline: "Diagrams from text",
    what: "Mermaid turns text into flowcharts, sequence diagrams, class diagrams, Gantt charts, and more. Perfect for visual explanations of processes, relationships, and workflows in mathematical contexts.",
    format: "Mermaid DSL — the first line declares the diagram type (`flowchart LR`, `sequenceDiagram`, `classDiagram`, `gantt`), followed by the diagram definition. See mermaid.js.org for the full syntax reference.",
    example: `flowchart LR
  A["Angle θ"] --> B["sin(θ)"]
  A --> C["cos(θ)"]
  B --> D["Wave"]
  C --> D
  D --> E["Periodic motion"]`,
    pitfalls: "Parentheses `()` inside node labels break the parser — always quote labels that contain them: `A[\"sin(θ)\" ]`. Commas in labels also need quoting. The theme auto-detects dark/light mode but you can force it with `%%{init: { 'theme': 'dark' }}%%` at the top.",
    tips: "Use `flowchart` instead of `graph` for better layout control. Subgraphs group related nodes. Click events work with `click A callback`. Use `A -.->|label| B` for dashed edges and `A ==> B` for thick edges.",
  },
  {
    id: "jsxgraph",
    icon: Triangle,
    label: "JSXGraph",
    tagline: "Interactive geometry & sketches",
    what: "JSXGraph builds tactile geometric figures — points, lines, circles, polygons, sliders, and dynamic constructions that students can drag, resize, and explore. Runs in a sandboxed iframe for safety.",
    format: "JavaScript code. The variable `board` (a JXG.Board instance) is pre-created and ready to use. The board has bounding box `[-5, 5, 5, -5]` with axes visible. All JSXGraph API methods are available on `board.create()`.",
    example: `var p1 = board.create("point", [-2, 1], { name: "A", color: "#f472b6" });
var p2 = board.create("point", [3, -2], { name: "B", color: "#7dd3fc" });
var line = board.create("line", [p1, p2], { strokeColor: "#a78bfa" });
var mid = board.create("midpoint", [p1, p2], { name: "M", color: "#34d399" });
board.create("text", [0, 2, "Drag the points!"], { color: "#fff" });`,
    pitfalls: "The code runs in a sandboxed iframe — no access to `window`, `document`, or the parent page. You must reference the pre-created `board`; don't create your own. Sliders use `board.create('slider', ...)` with a position and value range.",
    tips: "Use `glider` points that stick to curves. Set `fixed: true` on static elements to prevent dragging. Use `functiongraph` for plotting math functions. Sliders are great for interactive parameter exploration — pair them with function graphs.",
  },
  {
    id: "arquero",
    icon: Table,
    label: "Arquero",
    tagline: "Data tables & queries",
    what: "Arquero is a JavaScript library for data wrangling in the browser. Use it to filter, group, aggregate, and reshape tabular data. Results are printed as formatted tables directly in the lesson.",
    format: "JavaScript code using the `aq` namespace (pre-imported). The last expression should call `.print()` or another method that produces output. Errors are caught and displayed. Common methods: `from()`, `.filter()`, `.groupby()`, `.orderby()`, `.select()`, `.dedupe()`.",
    example: `const data = aq.from([
  { angle: 0, sin: 0, cos: 1 },
  { angle: 30, sin: 0.5, cos: 0.866 },
  { angle: 45, sin: 0.707, cos: 0.707 },
  { angle: 60, sin: 0.866, cos: 0.5 },
  { angle: 90, sin: 1, cos: 0 }
]);
data.select("angle", "sin").orderby("sin", "desc").print();`,
    pitfalls: "The `aq` variable is pre-defined — don't import or redefine it. Use `.print()` to output the table (not `console.log`). The script runs synchronously; async operations are not supported. Large datasets (>10k rows) may be slow.",
    tips: "Use `.select()` to narrow columns before printing wide tables. `.orderby()` sorts results. `.groupby().count()` gives quick frequency tables. For reproducible examples, embed the data inline with `aq.from([...])` instead of loading external files.",
  },
  {
    id: "plotly",
    icon: ChartScatter,
    label: "Plotly",
    tagline: "Interactive charts",
    what: "Plotly produces rich, interactive 2D and 3D charts — scatter, line, bar, surface, contour — that respond to hover, zoom, and pan. Each chart has a mode bar for export as PNG.",
    format: "A JSON object with two required keys: `data` (array of trace objects) and `layout` (object with chart settings). Each trace has `type`, `x`, `y`, `mode`, and styling properties. See plotly.com for the full schema.",
    example: `{
  "data": [
    {
      "x": [0, 30, 45, 60, 90],
      "y": [0, 0.5, 0.707, 0.866, 1],
      "type": "scatter",
      "mode": "lines+markers",
      "name": "sin(θ)",
      "line": { "color": "#f472b6", "width": 3 }
    }
  ],
  "layout": {
    "title": "Sine values at key angles",
    "xaxis": { "title": "Angle (degrees)" },
    "yaxis": { "title": "sin(θ)" }
  }
}`,
    pitfalls: "JSON must be strictly valid — trailing commas will break parsing. The `paper_bgcolor` and `plot_bgcolor` default to `transparent` to match the app theme. The font color is inherited from the document. For 3D charts use `type: 'surface'` or `type: 'scatter3d'`.",
    tips: "Use `barmode: 'group'` for grouped bar charts. Config includes `displayModeBar: true` for PNG export. Use `hovertemplate` for custom tooltips. Size the chart by setting `width` and `height` in the layout, or use the default responsive sizing.",
  },
  {
    id: "mathbox",
    icon: Box,
    label: "MathBox",
    tagline: "Immersive 3D math",
    what: "MathBox layers WebGL with a math-friendly API for 3D function plots, parametric curves, and immersive visualizations. Ideal for surfaces of revolution, vector fields, and multivariate calculus concepts.",
    format: "JavaScript code. Three variables are pre-created: `box` (MathBox instance), `view` (viewport), and `cartesian` (3D Cartesian axes). Runs in a sandboxed iframe. Uses the MathBox v2 API.",
    example: `view.grid({ axes: 3, detail: 1, opacity: 0.3 });
view.axis({ axis: 1, end: true, color: 0xf472b6 });
view.axis({ axis: 2, end: true, color: 0x7dd3fc });
view.axis({ axis: 3, end: true, color: 0x34d399 });
view.scale({ divide: 10 });
view.area({
  width: 32, height: 32,
  expr: function (emit, x, z, i, j) {
    var r = Math.sqrt(x*x + z*z);
    emit(x, Math.sin(r) / (r + 0.1), z);
  },
  channels: 3,
  items: 1
});`,
    pitfalls: "Requires WebGL — will not render in browsers or environments without GPU support. Runs in an iframe with no access to the parent page. The `expr` function's `emit` callback sends (x, y, z) coordinate triplets. Use `items: 1` for solid surfaces.",
    tips: "Use `view.grid({ axes: 2 })` for a 2D grid reference. Combine `area` and `line` for surface with contour overlay. The `range` option on `cartesian` controls the visible coordinate bounds. Use `opacity` for transparency effects.",
  },
  {
    id: "mathlive",
    icon: PenTool,
    label: "MathLive",
    tagline: "Editable math input",
    what: "MathLive provides an editable math field that renders LaTeX with a virtual keyboard. Users can type LaTeX directly, use the toolbar for fractions and symbols, and copy the result as LaTeX. Great for interactive exercises.",
    format: "A LaTeX string that becomes the initial value. The field renders as an interactive `<math-field>` web component. Users can edit the expression after it loads. Content updates are handled by the component — the initial value is set with `default-value`.",
    example: `\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`,
    pitfalls: "The field is editable — the user can change the expression after it renders. Long expressions may wrap on narrow screens. The virtual keyboard is language-dependent and may not include all symbols by default.",
    tips: "Use for interactive formula exploration — let students edit and experiment. Pair with JavaScript (outside the block) to check answers. For simple display-only formulas, use KaTeX instead — it's lighter and faster.",
  },
  {
    id: "manim",
    icon: Video,
    label: "Manim",
    tagline: "Animated video explanations",
    what: "Embed pre-rendered Manim animations as MP4 video. The first line specifies the filename (must be in the app directory), and subsequent lines provide an optional caption. The video plays with native HTML5 controls.",
    format: "First line: the MP4 filename (e.g., `trig_waves.mp4`). Remaining lines: optional caption — lines starting with `#` are stripped as comment markers.",
    example: `trig_waves.mp4
# Sine and cosine waves
An animation showing sin(x) and cos(x) plotted together, with the unit circle tracing the values.`,
    pitfalls: "The file must exist in the same directory as the app (or `dist/` for production builds). Only MP4 format is supported. No remote URLs — the file must be local. The video will show a broken player if the file is missing.",
    tips: "Keep videos under 2 minutes for quick loading. Use descriptive captions that explain what the animation demonstrates. Optimize MP4 files with H.264 compression for smaller file sizes and faster loading.",
  },
  {
    id: "geogebra",
    icon: Globe,
    label: "GeoGebra",
    tagline: "Interactive graphing, geometry & 3D",
    what: "Embed live GeoGebra apps — graphing calculator, geometry, 3D, CAS, and more — directly into your lesson. Configure the toolbar, input field, and menus. Requires internet on first load to download the app from CDN.",
    format: "A JSON object with GeoGebra app parameters. Required keys: `appName` (one of: `graphing`, `geometry`, `3d`, `cas`, `classic`, `scientific`). Optional: `width`, `height`, `showToolBar`, `showAlgebraInput`, `showMenuBar`, `showResetIcon`, `enableRightClick`.",
    example: `{
  "appName": "graphing",
  "width": 800,
  "height": 500,
  "showToolBar": true,
  "showAlgebraInput": true,
  "showMenuBar": false,
  "showResetIcon": true,
  "enableRightClick": true
}`,
    pitfalls: "JSON must be valid — trailing commas break it. The GeoGebra CDN script is loaded on demand; the first load may be slow. The app defaults to `graphing` if no `appName` is specified. Not all app types support all configuration options.",
    tips: "Set `showAlgebraInput: true` for student interaction. Use `showMenuBar: false` for a cleaner embed. `appName: 'geometry'` for pure geometry constructions. `appName: '3d'` for 3D graphing. `showResetIcon: true` lets users reset the construction.",
  },
  {
    id: "grid",
    icon: LayoutGrid,
    label: "Grid",
    tagline: "CSS grid layout for side-by-side content",
    what: "Arrange multiple blocks in a responsive CSS grid. Each cell can contain its own content blocks (HTML, KaTeX, Plotly, Mermaid, etc.). The grid auto-collapses to a single column on mobile when responsive mode is enabled.",
    format: "Uses the block's `settings` object (not `content`). Properties: `gridColumns` (1–4), `gridGap` ('sm', 'md', 'lg'), `gridAlign` ('stretch', 'start', 'center', 'end'), `responsive` (bool), and `cells` (array of `{ id, blocks: Block[] }`).",
    example: `// Settings for a 2-column grid with a formula on the left and chart on the right
"settings": {
  "gridColumns": 2,
  "gridGap": "md",
  "gridAlign": "stretch",
  "responsive": true,
  "cells": [
    {
      "id": "gc_left",
      "blocks": [{ "id": "b_left", "type": "katex", "content": "E = mc^2" }]
    },
    {
      "id": "gc_right",
      "blocks": [{ "id": "b_right", "type": "html", "content": "<p>Energy-mass equivalence</p>" }]
    }
  ]
}`,
    pitfalls: "Cells only show blocks explicitly added to them. Empty cells display 'Empty cell'. `responsive: true` collapses to 1 column below 640px. Grids cannot be configured via the `content` field — only `settings`. Maximum practical columns is 4.",
    tips: "Use `align: 'center'` for vertically centered cells. Use `gap: 'lg'` for more breathing room between cells. Grids can nest other grids. Great for side-by-side formula + diagram comparisons. Combine with responsive mode for mobile-friendly layouts.",
  },
];

export default function AuthoringGuide() {
  return (
    <div className="space-y-10 max-w-5xl">
      {/* Hero */}
      <section className="relative overflow-hidden glass-card-strong p-8 md:p-12 quiz-glow-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-24 size-80 rounded-full bg-[hsl(var(--quiz-cyan)/0.25)] blur-3xl" />
          <div className="absolute -bottom-32 -left-16 size-72 rounded-full bg-[hsl(var(--quiz-magenta)/0.25)] blur-3xl" />
        </div>
        <div className="relative space-y-5">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="quiz-cyan-text bg-[hsl(var(--quiz-cyan)/0.15)] border-[hsl(var(--quiz-cyan)/0.4)]">
              <PenLine className="size-3" /> Authoring
            </Badge>
            <Badge variant="outline" className="quiz-magenta-text border-[hsl(var(--quiz-magenta)/0.4)]">
              v1.0 · in-app guide
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
            Compose a lesson.
            <br />
            <span className="bg-gradient-to-r from-[hsl(var(--quiz-cyan))] via-[hsl(var(--quiz-magenta))] to-[hsl(var(--quiz-cyan))] bg-clip-text text-transparent">
              Then prove it with a quiz.
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            This guide walks through both halves of the authoring loop. Lessons open the door
            through curated blocks. Quizzes walk the learner across the threshold and tell the
            system what they've actually internalized.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/lessons/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors quiz-pulse"
            >
              <PlusCircle className="size-4" />
              Start a lesson
            </Link>
            <Link
              to="/quiz/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card text-sm font-medium hover:glow-ring transition-all"
            >
              <ListChecks className="size-4" />
              Author a quiz
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* The loop */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              The composition loop
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold">Six moves, one rhythm.</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Lessons and quizzes share the same authoring rhythm. Each pair of moves builds on the
            last — tag-aware, idempotent, and remixed in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className={cn(
                "glass-card p-5 relative group",
                step.kind === "quiz" &&
                  "quiz-glow-border hover:bg-[hsl(var(--quiz-cyan)/0.05)]",
                step.kind === "lesson" && "hover:bg-white/5"
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "shrink-0 size-10 rounded-xl flex items-center justify-center font-mono text-sm transition-colors",
                    step.kind === "quiz"
                      ? "bg-[hsl(var(--quiz-cyan)/0.15)] quiz-cyan-text border border-[hsl(var(--quiz-cyan)/0.3)]"
                      : "bg-primary/10 text-primary border border-primary/20"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-base">{step.title}</h3>
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border",
                        step.kind === "quiz"
                          ? "quiz-cyan-text border-[hsl(var(--quiz-cyan)/0.4)]"
                          : "text-muted-foreground border-border"
                      )}
                    >
                      {step.kind === "quiz" ? "Quiz" : "Lesson"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground/70">
                    <Sparkles className="size-3" />
                    ~{step.duration}
                  </div>
                </div>
              </div>
              {step.kind === "quiz" && (
                <div className="absolute -top-1 -right-1 size-3 rounded-full bg-[hsl(var(--quiz-magenta))] quiz-pulse" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technology Reference */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              Technology reference
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold">
              Every block, documented.
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Click each technology to expand its reference — content format, working example,
            common pitfalls, and pro tips for getting the most out of each block type.
          </p>
        </div>

        <div className="space-y-3">
          {TECH_GUIDES.map((tech) => (
            <details
              key={tech.id}
              className="glass-card group open:glass-card-strong transition-all"
            >
              <summary className="flex items-center gap-3 p-4 cursor-pointer list-none select-none">
                <div className="size-9 rounded-lg bg-[hsl(var(--quiz-cyan)/0.12)] flex items-center justify-center shrink-0">
                  <tech.icon className="size-4 quiz-cyan-text" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{tech.label}</div>
                  <div className="text-xs text-muted-foreground">{tech.tagline}</div>
                </div>
                <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180 shrink-0" />
              </summary>
              <div className="px-4 pb-5 space-y-4 border-t border-white/10 pt-4">
                {/* 1. What it is */}
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    What it is
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {tech.what}
                  </p>
                </div>

                {/* 2. Content format */}
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    Content format
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {tech.format}
                  </p>
                </div>

                {/* 3. Example */}
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    Example
                  </div>
                  <pre className="text-xs bg-black/30 dark:bg-black/50 text-foreground/90 p-3 rounded-md overflow-x-auto leading-relaxed whitespace-pre-wrap">
                    {tech.example}
                  </pre>
                </div>

                {/* 4. Common pitfalls */}
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    Common pitfalls
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {tech.pitfalls}
                  </p>
                </div>

                {/* 5. Pro tips */}
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    Pro tips
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {tech.tips}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="space-y-4">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Principles
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRINCIPLES.map((p) => (
            <div
              key={p.title}
              className="glass-panel p-5 space-y-3 hover:glass-card-strong transition-all"
            >
              <div className="size-9 rounded-lg bg-[hsl(var(--quiz-cyan)/0.15)] flex items-center justify-center quiz-cyan-text">
                <p.icon className="size-4" />
              </div>
              <h4 className="font-semibold text-sm">{p.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* In-app tour */}
      <section className="glass-card-strong p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <Code2 className="size-3" />
          Once you're authoring
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Feature
            icon={GitBranch}
            title="Tag inheritance"
            body="Quiz questions inherit the tags from their source lesson so 'Show me React quizzes' just works."
          />
          <Feature
            icon={Workflow}
            title="Live autosaave"
            body="Every keystroke writes to IndexedDB. Close the tab, reopen tomorrow — it picks up exactly where you left off."
          />
          <Feature
            icon={Layers}
            title="Remix-first JSON"
            body="Export any lesson or quiz as portable JSON. Drop the file back into the app and it rehydrates as a draft to keep iterating."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <Link
            to="/lessons/new"
            className="group p-5 rounded-2xl glass-panel hover:glass-card-strong transition-all flex items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="font-semibold">Open the lesson editor</div>
              <div className="text-xs text-muted-foreground">
                Title, blocks, tags, export — all in one studio.
              </div>
            </div>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 quiz-cyan-text" />
          </Link>
          <Link
            to="/quiz/new"
            className="group p-5 rounded-2xl glass-panel hover:glass-card-strong transition-all flex items-center justify-between gap-3 quiz-glow-border"
          >
            <div className="space-y-1">
              <div className="font-semibold quiz-cyan-text">Open the quiz editor</div>
              <div className="text-xs text-muted-foreground">
                Five question types, all theme-aware.
              </div>
            </div>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 quiz-magenta-text" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="space-y-2">
      <div className="size-9 rounded-lg border border-[hsl(var(--quiz-cyan)/0.3)] flex items-center justify-center quiz-cyan-text bg-[hsl(var(--quiz-cyan)/0.08)]">
        <Icon className="size-4" />
      </div>
      <h4 className="font-semibold text-sm">{title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
