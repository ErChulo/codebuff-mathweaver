import type { Block, Lesson, Quiz } from "./db";

/**
 * Stable ids for the curated sample lesson so re-importing is idempotent.
 */
export const SAMPLE_LESSON_ID = "s_ftc_lesson";
export const SAMPLE_QUIZ_ID = "s_ftc_quiz";

const blocks: Block[] = [
  {
    id: "b_sample_intro",
    type: "html",
    content: `<h2>The trouble with curves</h2>
<p>We learned the area of a rectangle in grade school: <strong>base × height</strong>. But how would you find the area under a curve that is always changing?</p>
<p>The answer is <em>approximation</em>. Surround the curve with thin rectangles, sum their areas, and let the rectangles shrink to nothing.</p>`,
  },
  {
    id: "b_sample_riemann",
    type: "katex",
    content: `A = \\\\lim_{n\\to\\\\infty} \\\\sum_{i=1}^{n} f(x_i)\\,\\\\Delta x`,
  },
  {
    id: "b_sample_visual",
    type: "jsxgraph",
    content: `var n = 8, a = 0, b = Math.PI;
var f = function(x) { return Math.sin(x); };
var dx = (b - a) / n;
for (var i = 0; i < n; i++) {
  var x0 = a + i * dx;
  var x1 = x0 + dx;
  var y = f(x0);
  board.create("polygon", [[x0,0],[x1,0],[x1,y],[x0,y]], {
    fillColor: "#7dd3fc", fillOpacity: 0.35, withLines: false
  });
}
var curve = board.create("functiongraph", [f, a, b], { strokeColor: "#f472b6", strokeWidth: 2 });
board.create("text", [b - 0.6, 0.2, "Riemann rectangles"], { color: "#fff" });`,
  },
  {
    id: "b_sample_transition",
    type: "html",
    content: `<p>Each rectangle has area <code>f(xᵢ) · Δx</code>. Summing them gives an approximation. As <code>n → ∞</code>, the rectangles become vanishingly thin, and the sum converges to a single number: the integral.</p>`,
  },
  {
    id: "b_sample_integral",
    type: "katex",
    content: `\\\\int_a^b f(x)\\,dx = \\\\lim_{n\\to\\\\infty} \\\\sum_{i=1}^{n} f(x_i)\\,\\\\Delta x`,
  },
  {
    id: "b_sample_flow",
    type: "mermaid",
    // Labels are quoted so parentheses (e.g. `f(xᵢ)`, `F(b)`) stay literal —
    // unquoted, Mermaid's flowchart lexer reads `[Sum f(` as the start of a
    // Cylinder shape and chokes on the `xᵢ)·Δx` that follows.
    content: `flowchart LR
  A["Slice curve at Δx"] --> B["Sum f(xᵢ)·Δx"]
  B --> C["Shrink Δx → 0"]
  C --> D["Sum becomes ∫"]
  D --> E["F(b) − F(a)"]`,
  },
  {
    id: "b_sample_plot",
    type: "plotly",
    content: `{
  "data": [
    { "x": [0,0.5,1,1.5,2,2.5,3,3.1416], "y": [0,0.4794,0.8415,0.9975,0.9093,0.5985,0.1411,0],
      "type": "scatter", "mode": "lines", "name": "sin(x)",
      "line": { "color": "#f472b6", "width": 3 } },
    { "x": [0,0.5,1,1.5,2,2.5,3], "y": [0,0.4794,0.8415,0.9975,0.9093,0.5985,0.1411],
      "type": "bar", "name": "Left Riemann",
      "marker": { "color": "#7dd3fc", "opacity": 0.6 } }
  ],
  "layout": { "title": "Left Riemann sum for sin(x) on [0, π]",
              "xaxis": { "title": "x", "range": [0, 3.3] },
              "yaxis": { "title": "f(x)" } }
}`,
  },
  {
    id: "b_sample_geogebra_intro",
    type: "html",
    content: `<h3>Explore it yourself</h3>
<p>The GeoGebra graphing calculator below plots any function you type. Try <code>sin(x)</code>, <code>x^2</code>, or <code>1/x</code> — drag to pan, scroll to zoom.</p>`,
  },
  {
    id: "b_sample_geogebra",
    type: "geogebra",
    content: `{
  "appName": "graphing",
  "width": 800,
  "height": 500,
  "showToolBar": true,
  "showAlgebraInput": true,
  "showMenuBar": false,
  "showResetIcon": true,
  "enableRightClick": true
}`,
  },
  {
    id: "b_sample_key",
    type: "katex",
    content: `\\\\int_a^b f(x)\\,dx = F(b) - F(a) \\\\quad\\text{where}\\\\quad F'(x) = f(x)`,
  },
  {
    id: "b_sample_close",
    type: "html",
    content: `<h3>The takeaway</h3>
<p>Differentiation and integration aren't two separate worlds — they're two ends of the same bridge. Every derivative question has an integration twin, and vice versa.</p>`,
  },
  // ========================================
  // Grid demo — various block types & column configurations
  // ========================================
  {
    id: "b_grid_intro",
    type: "html",
    content: `<h2>Grid layout demo</h2>
<p>Below are several CSS grid blocks demonstrating different column configurations, gap sizes, and mixed block types inside grid cells.</p>`,
  },
  {
    id: "b_grid_2col",
    type: "grid",
    content: "",
    settings: {
      gridColumns: 2,
      gridGap: "md",
      gridAlign: "stretch",
      responsive: true,
      cells: [
        {
          id: "gc_2col_left",
          blocks: [
            {
              id: "bg_2col_html",
              type: "html",
              content: `<h3>Left: Riemann intuition</h3>
<p>Imagine slicing the area under a curve into thin vertical strips. Each strip is roughly a rectangle of width Δx and height f(xᵢ). Summing their areas gives an approximation that improves as the strips get thinner.</p>`,
            },
          ],
        },
        {
          id: "gc_2col_right",
          blocks: [
            {
              id: "bg_2col_katex",
              type: "katex",
              content: `\\\\sum_{i=1}^{n} f(x_i)\\,\\\\Delta x \\\\quad\\text{approximates}\\\\quad \\\\int_a^b f(x)\\,dx`,
            },
          ],
        },
      ],
    },
  },
  {
    id: "b_grid_3col",
    type: "grid",
    content: "",
    settings: {
      gridColumns: 3,
      gridGap: "sm",
      gridAlign: "stretch",
      responsive: true,
      cells: [
        {
          id: "gc_3col_1",
          blocks: [
            {
              id: "bg_3col_html_1",
              type: "html",
              content: `<p><strong>Derivative</strong><br />
Rate of change at a point. Slope of the tangent line.</p>`,
            },
            {
              id: "bg_3col_katex_1",
              type: "katex",
              content: `f'(x) = \\\\lim_{h\\to 0}\\\\frac{f(x+h)-f(x)}{h}`,
            },
          ],
        },
        {
          id: "gc_3col_2",
          blocks: [
            {
              id: "bg_3col_html_2",
              type: "html",
              content: `<p><strong>Integral</strong><br />
Accumulated area under a curve over an interval.</p>`,
            },
            {
              id: "bg_3col_katex_2",
              type: "katex",
              content: `\\\\int_a^b f(x)\\,dx`,
            },
          ],
        },
        {
          id: "gc_3col_3",
          blocks: [
            {
              id: "bg_3col_html_3",
              type: "html",
              content: `<p><strong>FTC</strong><br />
Derivatives and integrals are inverse operations.</p>`,
            },
            {
              id: "bg_3col_katex_3",
              type: "katex",
              content: `\\\\int_a^b f = F(b) - F(a)`,
            },
          ],
        },
      ],
    },
  },
  {
    id: "b_grid_mixed",
    type: "grid",
    content: "",
    settings: {
      gridColumns: 2,
      gridGap: "lg",
      gridAlign: "center",
      responsive: true,
      cells: [
        {
          id: "gc_mixed_left",
          blocks: [
            {
              id: "bg_mixed_mermaid",
              type: "mermaid",
              content: `flowchart LR
  A["Problem"] --> B["Derive"]
  B --> C["Integrate"]
  C --> D["Solution"]`,
            },
          ],
        },
        {
          id: "gc_mixed_right",
          blocks: [
            {
              id: "bg_mixed_plot",
              type: "plotly",
              content: `{
  "data": [
    { "x": [1,2,3,4,5], "y": [1,4,9,16,25],
      "type": "scatter", "mode": "lines+markers",
      "marker": { "color": "#f472b6" } }
  ],
  "layout": { "title": "f(x) = x²",
              "paper_bgcolor": "transparent",
              "plot_bgcolor": "transparent" }
}`,
            },
          ],
        },
      ],
    },
  },
];

export const SAMPLE_LESSON: Lesson = {
  id: SAMPLE_LESSON_ID,
  title: "The Fundamental Theorem of Calculus",
  description:
    "From rectangles to the integral in five steps — a guided tour through HTML, KaTeX, JSXGraph, Mermaid, Plotly, GeoGebra, and CSS Grid working together.",
  blocks,
  createdAt: 0,
  updatedAt: 0,
};

export const SAMPLE_QUIZ: Quiz = {
  id: SAMPLE_QUIZ_ID,
  title: "Practice: Fundamental Theorem of Calculus",
  description:
    "Five questions covering Riemann sums, definite integrals, the FTC, and chart interpretation.",
  lessonId: SAMPLE_LESSON_ID,
  questions: [
    {
      id: "q_sample_1",
      prompt:
        "Which expression is the left-endpoint Riemann sum for $\\\\int_0^1 x^2\\\\,dx$ with $n$ equal subintervals?",
      options: [
        { id: "q1_a", label: "$\\\\dfrac{1}{n}\\\\sum_{i=1}^{n}\\\\left(\\\\dfrac{i}{n}\\\\right)^{2}$" },
        { id: "q1_b", label: "$\\\\sum_{i=1}^{n}\\\\left(\\\\dfrac{i}{n}\\\\right)^{2}$" },
        { id: "q1_c", label: "$\\\\dfrac{1}{n}\\\\sum_{i=0}^{n-1}\\\\left(\\\\dfrac{i}{n}\\\\right)^{2}$" },
        { id: "q1_d", label: "$\\\\int_0^1 x\\\\,dx$" },
      ],
      correctIndex: 0,
    },
    {
      id: "q_sample_2",
      prompt: "Evaluate $\\\\int_0^2 3\\\\,dx$.",
      options: [
        { id: "q2_a", label: "$3$" },
        { id: "q2_b", label: "$6$" },
        { id: "q2_c", label: "$9$" },
        { id: "q2_d", label: "$12$" },
      ],
      correctIndex: 1,
    },
    {
      id: "q_sample_3",
      prompt:
        "True or false: every continuous function on $[a,b]$ has an antiderivative on $(a,b)$.",
      options: [
        { id: "q3_a", label: "True" },
        { id: "q3_b", label: "False" },
      ],
      correctIndex: 0,
    },
    {
      id: "q_sample_4",
      prompt:
        "In the Plotly visualization above, what does the shaded bar region represent?",
      blocks: [
        {
          id: "b_q4_plot",
          type: "plotly",
          content: `{
  "data": [
    { "x": [0,0.5,1,1.5,2,2.5,3], "y": [0,0.4794,0.8415,0.9975,0.9093,0.5985,0.1411],
      "type": "bar", "name": "Left Riemann" }
  ],
  "layout": { "title": "Bars only", "xaxis": { "title": "x" }, "yaxis": { "title": "f(x)" } }
}`,
        },
        {
          id: "b_q4_geogebra",
          type: "geogebra",
          content: `{
  "appName": "graphing",
  "width": 800,
  "height": 400,
  "showToolBar": true,
  "showAlgebraInput": true,
  "showMenuBar": false,
  "showResetIcon": true,
  "enableRightClick": true
}`,
        },
      ],
      options: [
        { id: "q4_a", label: "The derivative of sin(x)" },
        { id: "q4_b", label: "A left-endpoint Riemann approximation of $\\\\int_0^{\\\\pi}\\\\sin x\\\\,dx$" },
        { id: "q4_c", label: "The Fourier series of sin(x)" },
        { id: "q4_d", label: "A histogram of random samples" },
      ],
      correctIndex: 1,
    },
    {
      id: "q_sample_5",
      prompt: "What is the next step AFTER summing $f(x_i)\\\\Delta x$ in the Riemann construction?",
      options: [
        { id: "q5_a", label: "Integrate term-by-term" },
        { id: "q5_b", label: "Let $\\\\Delta x \\\\to 0$ (i.e. send $n \\\\to \\\\infty$)" },
        { id: "q5_c", label: "Replace $f$ with a constant" },
        { id: "q5_d", label: "Take the derivative" },
      ],
      correctIndex: 1,
    },
  ],
  createdAt: 0,
  updatedAt: 0,
};

// =========================================================
// Trigonometry Sample Lesson — all 11 block types
// =========================================================

export const SAMPLE_TRIG_LESSON_ID = "s_trig_lesson";
export const SAMPLE_TRIG_QUIZ_ID = "s_trig_quiz";

const trigBlocks: Block[] = [
  // ========================================
  // Section 1: HTML — Introduction
  // ========================================
  {
    id: "b_trig_intro",
    type: "html",
    content: `<h2>Trigonometric Functions: From the Unit Circle to Waves</h2>
<p>Trigonometry is the study of triangles and the periodic relationships between angles and side lengths. It began with right triangles — ratios like <strong>sine</strong>, <strong>cosine</strong>, and <strong>tangent</strong> — but quickly expanded to describe circles, oscillations, and waves.</p>
<p>Every trigonometric function can be understood through the <strong>unit circle</strong>: a circle of radius 1 centered at the origin. As an angle θ sweeps around the circle, its coordinates <code>(cos θ, sin θ)</code> trace out the wave patterns that govern everything from sound to tides.</p>`,
  },

  // ========================================
  // Section 2: KaTeX — Unit Circle Formulas
  // ========================================
  {
    id: "b_trig_unit_circle",
    type: "katex",
    content: `\\\\sin^2\\\\theta + \\\\cos^2\\\\theta = 1 \\\\quad \\text{(Pythagorean identity)}`,
  },
  {
    id: "b_trig_angle_sum",
    type: "katex",
    content: `\\\\sin(\\\\alpha + \\\\beta) = \\\\sin\\\\alpha\\\\cos\\\\beta + \\\\cos\\\\alpha\\\\sin\\\\beta`,
  },

  // ========================================
  // Section 3: JSXGraph — Interactive Unit Circle
  // ========================================
  {
    id: "b_trig_jsxgraph_intro",
    type: "html",
    content: `<p>Drag the point on the unit circle below. The <strong>x-coordinate</strong> is cos(θ) and the <strong>y-coordinate</strong> is sin(θ). Watch how they change as the angle sweeps from 0 to 2π.</p>`,
  },
  {
    id: "b_trig_unit_circle_interactive",
    type: "jsxgraph",
    content: `var origin = board.create("point", [0, 0], { visible: false });
var circle = board.create("circle", [origin, 1], { strokeColor: "#7dd3fc", strokeWidth: 1.5, dash: 2 });
var angle = board.create("slider", [[-1.5, -1.5], [1.5, -1.5], [0, 0.8, 6.28]], { name: "θ", snapWidth: 0.01 });
var p = board.create("point", [
  function() { return Math.cos(angle.Value()); },
  function() { return Math.sin(angle.Value()); }
], { name: "P", color: "#f472b6", size: 6, fixed: false });
var line = board.create("line", [origin, p], { strokeColor: "#a78bfa", strokeWidth: 1.5, dash: 1 });
var angleArc = board.create("angle", [ [1, 0], origin, p ], { radius: 0.3, fillColor: "#a78bfa", fillOpacity: 0.3 });
board.create("text", [0, 1.3, function() { return "θ = " + angle.Value().toFixed(2) + " rad"; }], { color: "#fff", fontSize: 14 });
board.create("text", [0, 1.1, function() { return "sin = " + Math.sin(angle.Value()).toFixed(3); }], { color: "#f472b6", fontSize: 14 });
board.create("text", [0, 0.9, function() { return "cos = " + Math.cos(angle.Value()).toFixed(3); }], { color: "#7dd3fc", fontSize: 14 });`,
  },

  // ========================================
  // Section 4: Plotly — Sine & Cosine Waves
  // ========================================
  {
    id: "b_trig_plotly_intro",
    type: "html",
    content: `<p>The unit circle coordinates unfold into waves when plotted against the angle. Below, sin(θ) and cos(θ) are graphed together — notice the phase shift between them.</p>`,
  },
  {
    id: "b_trig_wave_plot",
    type: "plotly",
    content: `{
  "data": [
    {
      "x": [0,0.2,0.4,0.6,0.8,1.0,1.2,1.4,1.6,1.8,2.0,2.2,2.4,2.6,2.8,3.0,3.2,3.4,3.6,3.8,4.0,4.2,4.4,4.6,4.8,5.0,5.2,5.4,5.6,5.8,6.0,6.28],
      "y": [0,0.199,0.389,0.565,0.717,0.841,0.932,0.985,0.999,0.974,0.909,0.808,0.675,0.515,0.335,0.141,-0.058,-0.255,-0.443,-0.612,-0.757,-0.871,-0.951,-0.995,-0.999,-0.959,-0.883,-0.773,-0.631,-0.464,-0.279,0],
      "type": "scatter", "mode": "lines", "name": "sin(θ)",
      "line": { "color": "#f472b6", "width": 3 }
    },
    {
      "x": [0,0.2,0.4,0.6,0.8,1.0,1.2,1.4,1.6,1.8,2.0,2.2,2.4,2.6,2.8,3.0,3.2,3.4,3.6,3.8,4.0,4.2,4.4,4.6,4.8,5.0,5.2,5.4,5.6,5.8,6.0,6.28],
      "y": [1,0.980,0.921,0.825,0.696,0.540,0.362,0.170,-0.029,-0.227,-0.416,-0.588,-0.737,-0.857,-0.942,-0.990,-0.998,-0.966,-0.896,-0.791,-0.654,-0.490,-0.307,-0.105,0.099,0.283,0.467,0.629,0.762,0.860,0.921,1],
      "type": "scatter", "mode": "lines", "name": "cos(θ)",
      "line": { "color": "#7dd3fc", "width": 3 }
    }
  ],
  "layout": {
    "title": "Sine and cosine waves",
    "xaxis": { "title": "θ (radians)" },
    "yaxis": { "title": "Value", "range": [-1.2, 1.2] },
    "legend": { "orientation": "h", "y": 1.1 }
  }
}`,
  },

  // ========================================
  // Section 5: Grid (2-col) — Wave Comparison
  // ========================================
  {
    id: "b_trig_grid_compare",
    type: "grid",
    content: "",
    settings: {
      gridColumns: 2,
      gridGap: "md",
      gridAlign: "stretch",
      responsive: true,
      cells: [
        {
          id: "gc_trig_compare_left",
          blocks: [
            {
              id: "bg_trig_compare_html",
              type: "html",
              content: `<h3>Amplitude & frequency</h3>
<p>A wave's <strong>amplitude</strong> controls its height — <code>A</code> in <code>A·sin(ωx)</code>. Its <strong>frequency</strong> controls how many cycles fit into 2π — <code>ω</code> in <code>sin(ωx)</code>. Together they shape every oscillation.</p>`,
            },
            {
              id: "bg_trig_compare_katex",
              type: "katex",
              content: `f(x) = A\\\\cdot\\\\sin(\\\\omega x + \\\\phi) + k`,
            },
          ],
        },
        {
          id: "gc_trig_compare_right",
          blocks: [
            {
              id: "bg_trig_compare_plot",
              type: "plotly",
              content: `{
  "data": [
    { "x": [-6.28,-5.5,-4.71,-3.93,-3.14,-2.36,-1.57,-0.79,0,0.79,1.57,2.36,3.14,3.93,4.71,5.5,6.28],
      "y": [0,0.71,1,0.71,0,-0.71,-1,-0.71,0,0.71,1,0.71,0,-0.71,-1,-0.71,0],
      "type": "scatter", "mode": "lines", "name": "sin(x)",
      "line": { "color": "#f472b6", "width": 2 } },
    { "x": [-6.28,-5.5,-4.71,-3.93,-3.14,-2.36,-1.57,-0.79,0,0.79,1.57,2.36,3.14,3.93,4.71,5.5,6.28],
      "y": [0,1.41,2,1.41,0,-1.41,-2,-1.41,0,1.41,2,1.41,0,-1.41,-2,-1.41,0],
      "type": "scatter", "mode": "lines", "name": "2·sin(x)",
      "line": { "color": "#7dd3fc", "width": 2 } },
    { "x": [-6.28,-5.5,-4.71,-3.93,-3.14,-2.36,-1.57,-0.79,0,0.79,1.57,2.36,3.14,3.93,4.71,5.5,6.28],
      "y": [0,1,1.41,1,0,-1,-1.41,-1,0,1,1.41,1,0,-1,-1.41,-1,0],
      "type": "scatter", "mode": "lines", "name": "sin(2x)",
      "line": { "color": "#34d399", "width": 2 } }
  ],
  "layout": {
    "title": "Amplitude & frequency comparison",
    "xaxis": { "title": "x" },
    "yaxis": { "title": "f(x)" }
  }
}`,
            },
          ],
        },
      ],
    },
  },

  // ========================================
  // Section 6: Mermaid — Oscillations Diagram
  // ========================================
  {
    id: "b_trig_mermaid",
    type: "mermaid",
    content: `flowchart LR
  A["Angle θ"] --> B["Unit circle"]
  B --> C["sin(θ)"]
  B --> D["cos(θ)"]
  C --> E["Wave"]
  D --> E
  E --> F["Amplitude A"]
  E --> G["Frequency ω"]
  E --> H["Phase φ"]
  F --> I["f(x) = A·sin(ωx + φ)"]
  G --> I
  H --> I`,
  },

  // ========================================
  // Section 7: MathBox — 3D Helix
  // ========================================
  {
    id: "b_trig_mathbox_intro",
    type: "html",
    content: `<p>When sine and cosine are combined in 3D, they trace a helix — a curve that spirals through space. This is the path of a point moving in a circle while also moving along the z-axis.</p>`,
  },
  {
    id: "b_trig_helix",
    type: "mathbox",
    content: `view.grid({ axes: 3, detail: 1, opacity: 0.2 });
view.axis({ axis: 1, end: true, color: 0xf472b6 });
view.axis({ axis: 2, end: true, color: 0x7dd3fc });
view.axis({ axis: 3, end: true, color: 0x34d399 });
view.scale({ divide: 10 });
view.line({
  width: 64, height: 1,
  expr: function (emit, t) {
    emit(Math.cos(t * 6.28), Math.sin(t * 6.28), t * 2 - 1);
  },
  channels: 3,
  items: 1,
  color: 0xf472b6,
  width: 3
});`,
  },

  // ========================================
  // Section 8: GeoGebra — Interactive Sandbox
  // ========================================
  {
    id: "b_trig_geogebra_intro",
    type: "html",
    content: `<h3>Explore any trig function</h3>
<p>Type any function below — try <code>sin(x)</code>, <code>cos(2x)</code>, <code>tan(x)</code>, or <code>sin(x) + cos(x)</code>. Drag to pan, scroll to zoom.</p>`,
  },
  {
    id: "b_trig_geogebra",
    type: "geogebra",
    content: `{
  "appName": "graphing",
  "width": 800,
  "height": 500,
  "showToolBar": true,
  "showAlgebraInput": true,
  "showMenuBar": false,
  "showResetIcon": true,
  "enableRightClick": true
}`,
  },

  // ========================================
  // Section 9: Arquero — Trig Data Table
  // ========================================
  {
    id: "b_trig_arquero_intro",
    type: "html",
    content: `<p>The table below shows sine, cosine, and tangent values at key angles. The data is sorted by tangent in descending order — notice where tangent spikes near π/2.</p>`,
  },
  {
    id: "b_trig_arquero",
    type: "arquero",
    content: `const data = aq.from([
  { angle: 0, sin: 0, cos: 1, tan: 0 },
  { angle: 30, sin: 0.5, cos: 0.866, tan: 0.577 },
  { angle: 45, sin: 0.707, cos: 0.707, tan: 1 },
  { angle: 60, sin: 0.866, cos: 0.5, tan: 1.732 },
  { angle: 90, sin: 1, cos: 0, tan: Infinity },
  { angle: 120, sin: 0.866, cos: -0.5, tan: -1.732 },
  { angle: 135, sin: 0.707, cos: -0.707, tan: -1 },
  { angle: 150, sin: 0.5, cos: -0.866, tan: -0.577 },
  { angle: 180, sin: 0, cos: -1, tan: 0 }
]);
data
  .filter(aq.escape(d => d.tan !== Infinity && !isNaN(d.tan)))
  .select("angle", "sin", "cos", "tan")
  .orderby("tan", "desc")
  .print();`,
  },

  // ========================================
  // Section 10: MathLive — Editable Formula
  // ========================================
  {
    id: "b_trig_mathlive_intro",
    type: "html",
    content: `<p>The editable field below shows the Pythagorean identity. Click into it to modify the formula — try changing <code>sin²</code> to <code>sin</code> or swapping <code>cos²</code> for <code>tan²</code>.</p>`,
  },
  {
    id: "b_trig_mathlive",
    type: "mathlive",
    content: `\\\\sin^2 \\\\theta + \\\\cos^2 \\\\theta = 1`,
  },

  // ========================================
  // Section 11: Canvas — Unit Circle → Sine Wave Animation
  // ========================================
  {
    id: "b_trig_canvas_animation",
    type: "html",
    content: `<style>
  .uc-wrap { position: relative; max-width: 780px; margin: 0 auto; background: #0a0a1a; border-radius: 12px; overflow: hidden; }
  .uc-wrap canvas { display: block; width: 100%; height: auto; aspect-ratio: 780 / 380; }
  .uc-overlay { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; }
  .uc-overlay button {
    background: rgba(255,255,255,0.08); color: #ccc; border: 1px solid rgba(255,255,255,0.12);
    padding: 4px 14px; border-radius: 6px; font-size: 11px; cursor: pointer; transition: all 0.15s;
  }
  .uc-overlay button:hover { background: rgba(255,255,255,0.15); color: #fff; }
</style>
<div class="uc-wrap">
  <canvas id="ucCanvas" width="780" height="380"></canvas>
  <div class="uc-overlay">
    <button id="ucPlayBtn">⏸ Pause</button>
    <button id="ucResetBtn">↺ Reset</button>
  </div>
</div>
<script>
(function(){
  const c = document.getElementById('ucCanvas');
  const ctx = c.getContext('2d');
  const W = 780, H = 380;
  const cx = 170, cy = 190, R = 120;   // unit circle center & radius
  const graphL = 320, graphR = 750;     // sine graph x range
  const graphY = 190, graphH = 100;     // sine graph vertical center & half-height
  const pts = [];                       // traced sine points
  let theta = 0, running = true, animId = null;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const sinVal = Math.sin(theta);
    const cosVal = Math.cos(theta);
    const px = cx + R * cosVal;
    const py = cy - R * sinVal;  // flip y for screen

    // ---- Unit circle (left side) ----
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - R - 10, cy); ctx.lineTo(cx + R + 10, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - R - 10); ctx.lineTo(cx, cy + R + 10); ctx.stroke();

    // Radius line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Angle arc
    ctx.beginPath();
    ctx.arc(cx, cy, 30, -theta, 0);
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.4)';
    ctx.stroke();

    // Theta label
    ctx.fillStyle = '#a78bfa';
    ctx.font = '12px ui-sans-serif, system-ui';
    ctx.fillText('θ', cx + 38, cy - 8);

    // Point on circle
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#f472b6';
    ctx.fill();

    // Vertical dashed line from point to x-axis
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px, cy);
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // sin value text
    ctx.fillStyle = '#f472b6';
    ctx.font = 'bold 13px ui-sans-serif, system-ui';
    ctx.fillText('sin θ = ' + sinVal.toFixed(3), cx - 50, cy + R + 28);
    ctx.fillStyle = '#7dd3fc';
    ctx.fillText('cos θ = ' + cosVal.toFixed(3), cx - 50, cy + R + 46);

    // ---- Sine wave (right side) ----
    // Grid lines
    for (let v = -1; v <= 1; v += 0.5) {
      const gy = graphY - v * graphH;
      ctx.beginPath();
      ctx.moveTo(graphL, gy);
      ctx.lineTo(graphR, gy);
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.font = '9px ui-sans-serif, system-ui';
      ctx.fillText(v.toFixed(1), graphL - 18, gy + 3);
    }

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '11px ui-sans-serif, system-ui';
    ctx.fillText('sin(θ)', graphR - 50, graphY - graphH - 8);

    // Static reference sine (faint)
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * Math.PI * 4;
      const x = graphL + (i / 200) * (graphR - graphL);
      const y = graphY - graphH * Math.sin(t);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Add current point to trace
    const traceX = graphL + (theta / (Math.PI * 4)) * (graphR - graphL);
    if (traceX <= graphR) {
      pts.push({ x: traceX, y: graphY - graphH * sinVal });
    }

    // Draw traced path
    if (pts.length > 1) {
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();
    }

    // Current point on graph (glowing dot)
    if (pts.length > 0) {
      const last = pts[pts.length - 1];
      ctx.beginPath();
      ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#f472b6';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(last.x, last.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(244, 114, 182, 0.2)';
      ctx.fill();
    }

    // Angle label in degrees
    const deg = ((theta * 180 / Math.PI) % 360).toFixed(0);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px ui-sans-serif, system-ui';
    ctx.fillText(deg + '°', cx + R + 14, cy + 4);
  }

  function tick() {
    if (!running) return;
    theta += 0.025;
    if (theta > Math.PI * 4) {
      theta = 0;
      pts.length = 0;
    }
    draw();
    animId = requestAnimationFrame(tick);
  }

  // Controls
  document.getElementById('ucPlayBtn').onclick = function(e) {
    running = !running;
    e.target.textContent = running ? '⏸ Pause' : '▶ Play';
    if (running) animId = requestAnimationFrame(tick);
  };
  document.getElementById('ucResetBtn').onclick = function() {
    theta = 0;
    pts.length = 0;
    draw();
    if (!running) { running = true; document.getElementById('ucPlayBtn').textContent = '⏸ Pause'; animId = requestAnimationFrame(tick); }
  };

  draw();
  animId = requestAnimationFrame(tick);
})();
</script>`,
  },

  // ========================================
  // Section 12: Grid (3-col) — Summary
  // ========================================
  {
    id: "b_trig_summary_intro",
    type: "html",
    content: `<h3>Key takeaways</h3>`,
  },
  {
    id: "b_trig_summary_grid",
    type: "grid",
    content: "",
    settings: {
      gridColumns: 3,
      gridGap: "md",
      gridAlign: "stretch",
      responsive: true,
      cells: [
        {
          id: "gc_trig_summary_1",
          blocks: [
            {
              id: "bg_trig_summary_1_html",
              type: "html",
              content: `<p><strong>Key identities</strong><br />
The Pythagorean identity <code>sin²θ + cos²θ = 1</code> is the foundation. From it, all other trig identities can be derived.</p>`,
            },
            {
              id: "bg_trig_summary_1_katex",
              type: "katex",
              content: `1 + \\\\tan^2\\\\theta = \\\\sec^2\\\\theta`,
            },
          ],
        },
        {
          id: "gc_trig_summary_2",
          blocks: [
            {
              id: "bg_trig_summary_2_html",
              type: "html",
              content: `<p><strong>Graph features</strong><br />
Sine and cosine oscillate between −1 and 1 with period 2π. Tangent has vertical asymptotes at π/2 + nπ.</p>`,
            },
            {
              id: "bg_trig_summary_2_katex",
              type: "katex",
              content: `\\\\text{Period} = \\\\frac{2\\\\pi}{|\\\\omega|}`,
            },
          ],
        },
        {
          id: "gc_trig_summary_3",
          blocks: [
            {
              id: "bg_trig_summary_3_html",
              type: "html",
              content: `<p><strong>Real-world uses</strong><br />
Sound waves, tides, alternating current, seasonal patterns, and circular motion are all described by trigonometric functions.</p>`,
            },
            {
              id: "bg_trig_summary_3_katex",
              type: "katex",
              content: `f(t) = A\\\\sin(2\\\\pi ft + \\\\phi)`,
            },
          ],
        },
      ],
    },
  },
];

export const SAMPLE_TRIG_LESSON: Lesson = {
  id: SAMPLE_TRIG_LESSON_ID,
  title: "Trigonometric Functions: From the Unit Circle to Waves",
  description:
    "A guided tour of trigonometry — the unit circle, sine and cosine waves, tangent, identities, and real-world oscillations — brought to life through HTML, KaTeX, JSXGraph, Mermaid, Plotly, GeoGebra, Arquero, MathBox, MathLive, Canvas, and CSS Grid blocks.",
  blocks: trigBlocks,
  createdAt: 0,
  updatedAt: 0,
};

export const SAMPLE_TRIG_QUIZ: Quiz = {
  id: SAMPLE_TRIG_QUIZ_ID,
  title: "Practice: Trigonometric Functions",
  description:
    "Eleven questions covering the unit circle, sine/cosine/tangent, identities, graphs, and real-world applications — each tied to a specific block type demonstrated in the lesson.",
  lessonId: SAMPLE_TRIG_LESSON_ID,
  questions: [
    // Q1 — HTML section 1
    {
      id: "q_trig_1",
      prompt: "The unit circle is centered at the origin with what radius?",
      options: [
        { id: "t1_a", label: "0" },
        { id: "t1_b", label: "1" },
        { id: "t1_c", label: "π" },
        { id: "t1_d", label: "2π" },
      ],
      correctIndex: 1,
    },
    // Q2 — KaTeX section 2
    {
      id: "q_trig_2",
      prompt: "Which of the following is the Pythagorean identity?",
      options: [
        { id: "t2_a", label: "$\sin\theta + \cos\theta = 1$" },
        { id: "t2_b", label: "$\sin^2\theta + \cos^2\theta = 1$" },
        { id: "t2_c", label: "$\sin\theta \cdot \cos\theta = 1$" },
        { id: "t2_d", label: "$\sin\theta - \cos\theta = 1$" },
      ],
      correctIndex: 1,
    },
    // Q3 — JSXGraph section 3
    {
      id: "q_trig_3",
      prompt: "In the interactive unit circle, what is the y-coordinate of the point P?",
      blocks: [
        {
          id: "b_q3_trig_jsxgraph",
          type: "jsxgraph",
          content: `var origin = board.create("point", [0, 0], { visible: false });
var circle = board.create("circle", [origin, 1], { strokeColor: "#7dd3fc", strokeWidth: 1.5, dash: 2 });
var p = board.create("point", [0.5, 0.866], { name: "P", color: "#f472b6", size: 6, fixed: true });
var line = board.create("line", [origin, p], { strokeColor: "#a78bfa", strokeWidth: 1.5, dash: 1 });
board.create("text", [0.3, 0.95, "θ = 60°"], { color: "#fff", fontSize: 14 });`,
        },
      ],
      options: [
        { id: "t3_a", label: "cos(60°)" },
        { id: "t3_b", label: "sin(60°)" },
        { id: "t3_c", label: "tan(60°)" },
        { id: "t3_d", label: "sec(60°)" },
      ],
      correctIndex: 1,
    },
    // Q4 — Plotly section 4
    {
      id: "q_trig_4",
      prompt: "In the sine and cosine wave plot, what is the phase relationship between sin(θ) and cos(θ)?",
      blocks: [
        {
          id: "b_q4_trig_plot",
          type: "plotly",
          content: `{
  "data": [
    { "x": [0,1.57,3.14,4.71,6.28], "y": [0,1,0,-1,0],
      "type": "scatter", "mode": "lines", "name": "sin(θ)",
      "line": { "color": "#f472b6", "width": 3 } },
    { "x": [0,1.57,3.14,4.71,6.28], "y": [1,0,-1,0,1],
      "type": "scatter", "mode": "lines", "name": "cos(θ)",
      "line": { "color": "#7dd3fc", "width": 3 } }
  ],
  "layout": { "title": "Sine and cosine", "xaxis": { "title": "θ" }, "yaxis": { "title": "Value" } }
}`,
        },
      ],
      options: [
        { id: "t4_a", label: "They are in phase" },
        { id: "t4_b", label: "cos(θ) leads sin(θ) by π/2" },
        { id: "t4_c", label: "sin(θ) leads cos(θ) by π/2" },
        { id: "t4_d", label: "They are 180° out of phase" },
      ],
      correctIndex: 2,
    },
    // Q5 — Grid section 5
    {
      id: "q_trig_5",
      prompt: "In the grid comparison, what happens to a sine wave when you double its frequency ($\\omega$)?",
      options: [
        { id: "t5_a", label: "The amplitude doubles" },
        { id: "t5_b", label: "The wave completes twice as many cycles in the same interval" },
        { id: "t5_c", label: "The wave shifts left by π/2" },
        { id: "t5_d", label: "The period doubles" },
      ],
      correctIndex: 1,
    },
    // Q6 — Mermaid section 6
    {
      id: "q_trig_6",
      prompt: "According to the oscillations diagram, which three parameters shape a wave?",
      options: [
        { id: "t6_a", label: "Angle, radius, and circumference" },
        { id: "t6_b", label: "Amplitude, frequency, and phase" },
        { id: "t6_c", label: "Sine, cosine, and tangent" },
        { id: "t6_d", label: "Base, height, and hypotenuse" },
      ],
      correctIndex: 1,
    },
    // Q7 — MathBox section 7
    {
      id: "q_trig_7",
      prompt: "The 3D helix is formed by combining sine and cosine in which way?",
      options: [
        { id: "t7_a", label: "x = cos(t), y = sin(t), z = t" },
        { id: "t7_b", label: "x = t, y = sin(t), z = cos(t)" },
        { id: "t7_c", label: "x = sin(t), y = sin(t), z = cos(t)" },
        { id: "t7_d", label: "x = cos(t), y = cos(t), z = sin(t)" },
      ],
      correctIndex: 0,
    },
    // Q8 — GeoGebra section 8
    {
      id: "q_trig_8",
      prompt: "In the GeoGebra graphing calculator, which function would you type to graph a wave with double the frequency of sin(x)?",
      options: [
        { id: "t8_a", label: "2 sin(x)" },
        { id: "t8_b", label: "sin(2x)" },
        { id: "t8_c", label: "sin²(x)" },
        { id: "t8_d", label: "1/sin(x)" },
      ],
      correctIndex: 1,
    },
    // Q9 — Arquero section 9
    {
      id: "q_trig_9",
      prompt: "According to the Arquero data table, what is the value of tan(45°)?",
      options: [
        { id: "t9_a", label: "0" },
        { id: "t9_b", label: "0.577" },
        { id: "t9_c", label: "1" },
        { id: "t9_d", label: "1.732" },
      ],
      correctIndex: 2,
    },
    // Q10 — MathLive section 10
    {
      id: "q_trig_10",
      prompt: "Which identity can be derived from $\sin^2\theta + \cos^2\theta = 1$ by dividing both sides by $\cos^2\theta$?",
      options: [
        { id: "t10_a", label: "$1 + \tan^2\theta = \sec^2\theta$" },
        { id: "t10_b", label: "$1 - \tan^2\theta = \csc^2\theta$" },
        { id: "t10_c", label: "$\sin^2\theta = 1 - \cos\theta$" },
        { id: "t10_d", label: "$\cos^2\theta = \sin^2\theta - 1$" },
      ],
      correctIndex: 0,
    },
    // Q11 — Grid summary section 12
    {
      id: "q_trig_11",
      prompt: "In the summary grid, what is the formula for the period of a wave $f(x) = A\sin(\omega x)$?",
      options: [
        { id: "t11_a", label: "$\text{Period} = \omega$" },
        { id: "t11_b", label: "$\text{Period} = \frac{2\pi}{\omega}$" },
        { id: "t11_c", label: "$\text{Period} = \frac{\omega}{2\pi}$" },
        { id: "t11_d", label: "$\text{Period} = A\omega$" },
      ],
      correctIndex: 1,
    },
  ],
  createdAt: 0,
  updatedAt: 0,
};
