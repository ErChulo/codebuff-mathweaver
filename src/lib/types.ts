import type { BlockType } from "./db";

export type TechMeta = {
  type: BlockType;
  label: string;
  tagline: string;
  description: string;
  icon: string;
  cdnJs: string;
  cdnCss?: string;
  placeholder: string;
  /** Default starter template that gets inserted when a new block is added. */
  defaultContent: string;
  /** When true, the block must be rendered inside a sandboxed iframe. */
  sandbox?: boolean;
};

/**
 * Canonical metadata for every content technology supported by Math Weaver.
 * Drives the technology index page, the authoring guide, templates,
 * and dynamic CDN script loading.
 */
export const TECH: Record<BlockType, TechMeta> = {
  html: {
    type: "html",
    label: "HTML",
    tagline: "Rich prose, structure, and embedding",
    description:
      "Standard HTML for prose, headings, figures, tables, lists, and links. Use it to shape the lesson's narrative alongside math and interactive blocks.",
    icon: "</>",
    cdnJs: "",
    placeholder:
      '<h2>Section heading</h2>\
<p>Write your prose here. <em>Italic</em>, <strong>strong</strong>, <a href="#">links</a>.</p>',
    defaultContent:
      '<h2>Heading</h2>\
<p>Write the lesson text here. You can use <strong>bold</strong>, <em>italics</em>, lists, and links.</p>',
  },
  katex: {
    type: "katex",
    label: "KaTeX",
    tagline: "Beautiful, fast math typesetting",
    description:
      "KaTeX renders LaTeX-quality equations in the browser with crisp typography. Use inline \`$...$\` or display \`$$...$$\` math expressions.",
    icon: "∑",
    cdnJs: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js",
    cdnCss: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css",
    placeholder: "f(x) = \\\int_{a}^{b} \\\frac{\\\sin(x)}{x}\\\,dx",
    defaultContent:
      "f(x) = \\\int_{a}^{b} \\\frac{\\\sin(x)}{x}\\\,dx",
  },
  mermaid: {
    type: "mermaid",
    label: "Mermaid",
    tagline: "Diagrams from text",
    description:
      "Mermaid turns text into flowcharts, sequence diagrams, class diagrams, Gantt charts, and more — perfect for visual explanations.",
    icon: "◇",
    cdnJs: "https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js",
    placeholder: "graph TD\n  A[Idea] --> B[Derive]\n  B --> C[Verify]\n  C --> D[Teach]",
    defaultContent: "graph TD\n  A[Idea] --> B[Derive]\n  B --> C[Verify]\n  C --> D[Teach]",
  },
  jsxgraph: {
    type: "jsxgraph",
    label: "JSXGraph",
    tagline: "Interactive geometry & sketches",
    description:
      "JSXGraph builds tactile geometric figures — points, lines, circles, polygons, sliders, and dynamic constructions — that students can drag.",
    icon: "△",
    cdnJs:
      "https://cdn.jsdelivr.net/npm/jsxgraph@1.10.0/distrib/jsxgraphcore.js",
    cdnCss: "https://cdn.jsdelivr.net/npm/jsxgraph@1.10.0/distrib/jsxgraph.css",
    placeholder:
      '// JSXGraph script. \`board\` is pre-created and ready to use.\
var p1 = board.create("point", [0, 0], { name: "A" });\
var p2 = board.create("point", [3, 0], { name: "B" });\
board.create("line", [p1, p2]);',
    defaultContent:
      'var p1 = board.create("point", [0, 0], { name: "A" });\
var p2 = board.create("point", [3, 0], { name: "B" });\
board.create("line", [p1, p2]);',
    sandbox: true,
  },
  arquero: {
    type: "arquero",
    label: "Arquero",
    tagline: "Data tables & queries",
    description:
      "Arquero is a JavaScript library for data wrangling. Use it to filter, group, aggregate, and reshape tabular data inside lessons.",
    icon: "▦",
    cdnJs: "https://cdn.jsdelivr.net/npm/arquero@5.4.0/dist/arquero.min.js",
    placeholder:
      "// Arquero query. Table is rendered onto #table.\
const data = aq.from(arr);\
data.filter(d => d.value > 0).print();",
    defaultContent:
      "const t = aq.from([\
  { x: 1, y: 2 },\
  { x: 2, y: 5 },\
  { x: 3, y: 10 }\
]);\
t.print();",
  },
  plotly: {
    type: "plotly",
    label: "Plotly",
    tagline: "Interactive charts",
    description:
      "Plotly produces rich, interactive 2D and 3D charts — scatter, line, bar, surface, contour — that respond to hover and zoom.",
    icon: "📈",
    cdnJs: "https://cdn.plot.ly/plotly-2.35.2.min.js",
    placeholder:
      '{\
  "data": [{ "x": [1,2,3], "y": [2,5,10], "type": "scatter" }],\
  "layout": { "title": "My plot" }\
}',
    defaultContent:
      '{\
  "data": [{ "x": [1,2,3,4], "y": [1,4,9,16], "type": "scatter", "mode": "lines+markers", "name": "y = x^2" }],\
  "layout": { "title": "Quadratic", "xaxis": { "title": "x" }, "yaxis": { "title": "y" } }\
}',
  },
  mathbox: {
    type: "mathbox",
    label: "MathBox",
    tagline: "Immersive 3D math",
    description:
      "MathBox layers WebGL with a math-friendly API. Use it for 3D function plots, parametric curves, and immersive visualizations.",
    icon: "⟐",
    cdnJs: "https://cdn.jsdelivr.net/npm/mathbox@2.3.1/build/bundle/mathbox.js",
    cdnCss: "https://cdn.jsdelivr.net/npm/mathbox@2.3.1/build/mathbox.css",
    placeholder:
      "// \`box\` is the MathBox instance; \`view\` and \`cartesian\` are pre-created.\
view.grid({ axes: 1, style: { color: 0xa0a0a0 } });",
    defaultContent:
      "view.grid({ axes: 2 });\
view.axis({ end: true });\
view.scale({ divide: 10 });",
    sandbox: true,
  },
  mathlive: {
    type: "mathlive",
    label: "MathLive",
    tagline: "Editable math input",
    description:
      "MathLive provides an editable math keyboard-style input field that supports LaTeX entry, fraction editing, and copy-as-LaTeX.",
    icon: "✎",
    cdnJs: "https://cdn.jsdelivr.net/npm/mathlive@0.95.0/dist/mathlive.min.js",
    placeholder: "\\\frac{1}{2}",
    defaultContent: "\\\frac{1}{2}",
  },
  manim: {
    type: "manim",
    label: "Manim",
    tagline: "Animated video explanations",
    description:
      "Embed pre-rendered Manim scenes as MP4 video. Paste a URL or use an attached file; the video plays with native browser controls.",
    icon: "▶",
    cdnJs: "",
    placeholder:
      "https://example.com/your-manim-scene.mp4\
(Caption or explanation below.)",
    defaultContent:
      "https://example.com/scene.mp4\
# Manim Scene\
Describe what this animation shows.",
  },
  geogebra: {
    type: "geogebra",
    label: "GeoGebra",
    tagline: "Interactive graphing, geometry & 3D",
    description:
      "Embed live GeoGebra apps — graphing calculator, geometry, 3D, CAS, and more — directly into your lesson. Configure the toolbar, input, and menus.",
    icon: "📐",
    cdnJs: "https://www.geogebra.org/apps/deployggb.js",
    placeholder:
      '{\
  "appName": "graphing",\
  "showToolBar": true,\
  "showAlgebraInput": true,\
  "showMenuBar": true\
}',
    defaultContent:
      '{\
  "appName": "graphing",\
  "width": 800,\
  "height": 600,\
  "showToolBar": true,\
  "showAlgebraInput": true,\
  "showMenuBar": true\
}',
  },
  grid: {
    type: "grid",
    label: "Grid",
    tagline: "CSS grid layout for side-by-side content",
    description:
      "Arrange multiple blocks in a responsive grid with auto-collapse on mobile. Each cell can contain its own content blocks.",
    icon: "⊞",
    cdnJs: "",
    placeholder: "",
    defaultContent: "",
  },
};

export const BLOCK_TYPES = Object.keys(TECH) as BlockType[];
