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
    content: `A = \\\lim_{n\\	o\\\infty} \\\sum_{i=1}^{n} f(x_i)\\\,\\\Delta x`,
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
    content: `\\\int_a^b f(x)\\\,dx = \\\lim_{n\\	o\\\infty} \\\sum_{i=1}^{n} f(x_i)\\\,\\\Delta x`,
  },
  {
    id: "b_sample_flow",
    type: "mermaid",
    // Labels are quoted so parentheses (e.g. `f(xᵢ)`, `F(b)`) stay literal —
    // unquoted, Mermaid\'s flowchart lexer reads `[Sum f(` as the start of a
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
    content: `\\\int_a^b f(x)\\\,dx = F(b) - F(a) \\\quad\\	ext{where}\\\quad F\'(x) = f(x)`,
  },
  {
    id: "b_sample_close",
    type: "html",
    content: `<h3>The takeaway</h3>
<p>Differentiation and integration aren\'t two separate worlds — they\'re two ends of the same bridge. Every derivative question has an integration twin, and vice versa.</p>`,
  },
];

export const SAMPLE_LESSON: Lesson = {
  id: SAMPLE_LESSON_ID,
  title: "The Fundamental Theorem of Calculus",
  description:
    "From rectangles to the integral in five steps — a guided tour through HTML, KaTeX, JSXGraph, Mermaid, Plotly, and GeoGebra working together.",
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
        "Which expression is the left-endpoint Riemann sum for $\\\int_0^1 x^2\\\,dx$ with $n$ equal subintervals?",
      options: [
        { id: "q1_a", label: "$\\\dfrac{1}{n}\\\sum_{i=1}^{n}\\\left(\\\dfrac{i}{n}\\\right)^{2}$" },
        { id: "q1_b", label: "$\\\sum_{i=1}^{n}\\\left(\\\dfrac{i}{n}\\\right)^{2}$" },
        { id: "q1_c", label: "$\\\dfrac{1}{n}\\\sum_{i=0}^{n-1}\\\left(\\\dfrac{i}{n}\\\right)^{2}$" },
        { id: "q1_d", label: "$\\\int_0^1 x\\\,dx$" },
      ],
      correctIndex: 0,
    },
    {
      id: "q_sample_2",
      prompt: "Evaluate $\\\int_0^2 3\\\,dx$.",
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
        { id: "q4_b", label: "A left-endpoint Riemann approximation of $\\\int_0^{\\\pi}\\\sin x\\\,dx$" },
        { id: "q4_c", label: "The Fourier series of sin(x)" },
        { id: "q4_d", label: "A histogram of random samples" },
      ],
      correctIndex: 1,
    },
    {
      id: "q_sample_5",
      prompt: "What is the next step AFTER summing $f(x_i)\\\Delta x$ in the Riemann construction?",
      options: [
        { id: "q5_a", label: "Integrate term-by-term" },
        { id: "q5_b", label: "Let $\\\Delta x \\	o 0$ (i.e. send $n \\	o \\\infty$)" },
        { id: "q5_c", label: "Replace $f$ with a constant" },
        { id: "q5_d", label: "Take the derivative" },
      ],
      correctIndex: 1,
    },
  ],
  createdAt: 0,
  updatedAt: 0,
};
