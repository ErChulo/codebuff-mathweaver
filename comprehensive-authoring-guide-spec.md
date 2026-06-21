# Comprehensive Authoring Guide & Trigonometry Sample Lesson — Spec

## Overview

Two parallel deliverables:

1. **Authoring Guide** — a thorough per-technology reference on the `/authoring` page that teaches authors how to use each block type in the Math Weaver studio.
2. **Trigonometry Sample Lesson** — a comprehensive fake lesson + matching quiz about trigonometric functions that showcases all 11 block types working together. Rendered on the `/sample` page.

---

## Part 1: Authoring Guide

### Location & Layout

- Lives on its **own page** (`/authoring`) — separate from the Sample page.
- Keeps the current hero section and navigation links.
- After the hero, adds a **per-technology reference section** below the existing "Six moves, one rhythm" workflow steps.
- The workflow steps (`STEPS` array) stay as-is. The per-tech sections are added after them.

### Technologies to Cover (all 11)

| # | Technology | Block type key |
|---|-----------|----------------|
| 1 | HTML | `html` |
| 2 | KaTeX | `katex` |
| 3 | Mermaid | `mermaid` |
| 4 | JSXGraph | `jsxgraph` |
| 5 | Arquero | `arquero` |
| 6 | Plotly | `plotly` |
| 7 | MathBox | `mathbox` |
| 8 | MathLive | `mathlive` |
| 9 | Manim | `manim` |
| 10 | GeoGebra | `geogebra` |
| 11 | CSS Grid | `grid` |

### Per-Technology Section Structure (5-part)

Each technology gets a collapsible `<details>` card with the following contents:

```
┌─────────────────────────────────────────┐
│ [icon] Technology Name — tagline        │  ← summary line (always visible)
│─────────────────────────────────────────│
│ 1. What it is                           │
│    - 1-2 sentence description of the    │
│      technology and what it's used for  │
│                                         │
│ 2. Content format                       │
│    - The expected format of the block's │
│      `content` field                    │
│    - For JSON-based blocks (Plotly,     │
│      GeoGebra), show the JSON schema    │
│    - For code-based blocks (JSXGraph,   │
│      Arquero, MathBox), show the API    │
│      available to the block             │
│                                         │
│ 3. Full working example                 │
│    - A copy-pasteable example that      │
│      demonstrates realistic usage       │
│    - Shown as a code block              │
│                                         │
│ 4. Common pitfalls                      │
│    - Typical mistakes authors make      │
│    - How to debug / fix them            │
│                                         │
│ 5. Pro tips                             │
│    - Advanced usage, creative ideas     │
│    - Performance notes where relevant   │
└─────────────────────────────────────────┘
```

### Content Details Per Technology

#### HTML
- **Format**: Standard HTML — headings, paragraphs, lists, links, images, tables.
- **Example**: A proper lesson intro with `<h2>`, `<p>`, `<code>`, `<ul>`.
- **Pitfalls**: Script tags are stripped / unsafe. No `<style>` — use inline or CSS classes. No self-closing divs.
- **Tips**: Use `<details>` for expandable sections. Use `<figure>` + `<figcaption>` for annotated diagrams.

#### KaTeX
- **Format**: LaTeX math expressions — inline `$...$` or display `$$...$$`.
- **Example**: `\int_{a}^{b} f(x)\,dx`, `\frac{dy}{dx} = \sin(x)`.
- **Pitfalls**: Double-escape backslashes in JSON. `\begin{align}` not supported — use `\begin{aligned}` inside `$$...$$`.
- **Tips**: Use `\,` for spacing. `\text{}` for plain text in math mode. Auto-detects display mode for `\int`, `\sum`, `\frac`.

#### Mermaid
- **Format**: Mermaid DSL — flowchart, sequence diagram, class diagram, etc.
- **Example**: Flowchart with styled nodes, subgraphs, and edges with labels.
- **Pitfalls**: Parentheses in node labels must be quoted: `A["text (with parens)" ]`. Comma-separated items in flowchart links need explicit quotes.
- **Tips**: Use `flowchart` instead of `graph` for more layout control. Set `securityLevel: "loose"` for HTML labels. Theme adapts to dark/light mode automatically.

#### JSXGraph
- **Format**: JavaScript code. The variables `board` (JXG.Board) is pre-created.
- **Example**: Points, lines, circles, function graphs, sliders.
- **Pitfalls**: Must reference `board` — don't create your own. No DOM access. Code runs in a sandboxed iframe.
- **Tips**: Use `board.create("slider", ...)` for interactive parameters. Set `fixed: true` on static elements. Use `glider` points on curves.

#### Arquero
- **Format**: JavaScript code using `aq` (the Arquero library). `aq` is pre-imported.
- **Example**: `aq.from([...]).filter(...).groupby(...).count()...`.
- **Pitfalls**: Table is printed via `print()` call. Errors are caught and shown. Can't use `console.log`. Must return a printable result.
- **Tips**: Use `.select()` to narrow columns. `.orderby()` to sort. `.dedupe()` to remove duplicates. Great for small ad-hoc data analysis.

#### Plotly
- **Format**: JSON object with `data` (array of trace objects) and `layout` (object).
- **Example**: Multi-trace scatter + bar chart with customized axes, colors, and grid.
- **Pitfalls**: JSON must be valid — trailing commas break it. `paper_bgcolor` and `plot_bgcolor` default to `"transparent"`. Font color adapts from the app theme.
- **Tips**: Use `mode: "lines+markers"` for line+point combos. Use `barmode: "group"` for grouped bars. Config includes `displayModeBar: true` for export controls.

#### MathBox
- **Format**: JavaScript code. Variables `box` (MathBox instance), `view` (viewport), and `cartesian` (3D axes) are pre-created.
- **Example**: 3D function surface plot, parametric curve, grid axes.
- **Pitfalls**: Runs in a sandboxed iframe. WebGL required. Use `view.grid()` to add reference grid. Use `cartesian` for coordinate-based rendering.
- **Tips**: Use `view.scale({ divide: 10 })` for axis ticks. Combine `area` and `line` for surface with contour overlay.

#### MathLive
- **Format**: LaTeX string. The field renders as an editable math input.
- **Example**: `\frac{1}{2}` or `\sqrt{\frac{a}{b}}`.
- **Pitfalls**: Sets `default-value` — user can edit after render. Long expressions may wrap.
- **Tips**: Use for interactive formula exploration or student input. Pair with JavaScript check-answer scripts outside the block.

#### Manim
- **Format**: First line is the MP4 filename, remaining lines are an optional caption (with `#` prefix stripped).
- **Example**: `scene.mp4` on line 1, caption below.
- **Pitfalls**: The file must exist in the app directory. No URL loading. No preview until file is present.
- **Tips**: Keep filenames simple and unique. Use descriptive captions. Keep videos short (< 2 min) for quick loading.

#### GeoGebra
- **Format**: JSON object with GeoGebra app parameters.
- **Example**: `{"appName": "graphing", "showToolBar": true, ...}`.
- **Pitfalls**: JSON must be valid. The app loads from CDN — requires internet on first load. `appName` defaults to `"graphing"`.
- **Tips**: Set `showAlgebraInput: true` for student interaction. `showResetIcon: true` lets users reset the construction. Supports `graphing`, `geometry`, `3d`, `cas`, `classic`, and `scientific` app types.

#### CSS Grid
- **Format**: Uses `settings` object (not `content`). Properties: `gridColumns`, `gridGap`, `gridAlign`, `responsive`, `cells`.
- **Example**: 2-column grid with KaTeX on left and Plotly chart on right.
- **Pitfalls**: Cells only show blocks added to them. Empty cells show "Empty cell" placeholder. Mobile collapses to 1 column when `responsive: true`.
- **Tips**: Use `align: "center"` for vertically centered cells. Use `gap: "lg"` for more breathing room. Grids can nest other grids.

### Guide UI
- Each technology section is a `<details>` element with a polished summary line showing the tech icon, name, and tagline.
- Inside: a structured card with numbered sections (1-5).
- Examples shown as `<pre><code>` blocks.
- No live rendering inside the guide (keeps it focused on reference).

---

## Part 2: Trigonometry Sample Lesson

### Lesson Identity
- **ID**: `s_trig_lesson`
- **Title**: "Trigonometric Functions: From the Unit Circle to Waves"
- **Description**: "A guided tour of trigonometry — the unit circle, sine and cosine waves, tangent, identities, and real-world oscillations — brought to life through HTML, KaTeX, JSXGraph, Mermaid, Plotly, GeoGebra, Arquero, MathBox, MathLive, Manim, and CSS Grid blocks."

### Lesson Structure (narrative thread)

The lesson follows a natural progression through trigonometry:

| Section | Block type(s) | Content |
|---------|---------------|---------|
| 1. Introduction | HTML | `<h2>` overview of trig: angles, triangles, circles |
| 2. The Unit Circle | KaTeX | `\sin^2\theta + \cos^2\theta = 1`, definitions |
| 3. Interactive Unit Circle | JSXGraph | Draggable point on unit circle showing sin/cos values |
| 4. Sine & Cosine Waves | Plotly | Multi-trace: sin(x), cos(x), and sin(x)+cos(x) overlaid |
| 5. Wave Comparison Grid | Grid (2-col) | Left: KaTeX formula for amplitude/frequency, Right: Plotly chart of `A·sin(ωx)` |
| 6. Oscillations Diagram | Mermaid | Flowchart: Angle → Period → Frequency → Amplitude → Wave |
| 7. 3D Trig Visualization | MathBox | 3D helical wave — `(cos(t), sin(t), t)` |
| 8. GeoGebra Sandbox | GeoGebra | Interactive graphing calculator — type any trig function |
| 9. Trig Data Table | Arquero | Table of sin/cos/tan values at key angles, with filter/orderby |
| 10. Editable Formula | MathLive | Editable `\sin^2 x + \cos^2 x` — user can modify and see rendered |
| 11. Manim Animation | Manim | Filename: `trig_waves.mp4` — pre-rendered sine wave animation |
| 12. Summary Grid | Grid (3-col) | Three cells: Key identities, Graph features, Real-world uses — each with HTML + KaTeX |

### Block Requirements
- Each of the 11 block types must appear **at least once** in the lesson.
- Grid blocks (sections 5 and 12) must **contain other block types** (KaTeX, Plotly, HTML) inside their cells.
- All block IDs follow the pattern: `b_trig_<descriptive_name>` and cell IDs: `gc_trig_<descriptive_name>`.

### Quiz Identity
- **ID**: `s_trig_quiz`
- **Title**: "Practice: Trigonometric Functions"
- **Description**: "Eleven questions covering the unit circle, sine/cosine/tangent, identities, graphs, and real-world applications — at least one question tied to each block type demonstrated in the lesson."
- **lessonId**: `s_trig_lesson`

### Quiz Structure
- At least **11 questions** (one per block type).
- Each question references content from a specific block in the lesson.
- Question types: multiple choice (default), with optional embedded blocks (Plotly chart, GeoGebra app, KaTeX formula).
- Questions include inline math with `$...$` delimiters for KaTeX rendering.
- Questions that reference visualizations (Plotly, GeoGebra, JSXGraph, MathBox) include an embedded block so the user can refer to it while answering.

### Quiz Question Map

| # | Tests understanding of | Referenced block type | Has embedded block |
|---|----------------------|----------------------|--------------------|
| 1 | Unit circle definitions | KaTeX (section 2) | No |
| 2 | Interactive unit circle interaction | JSXGraph (section 3) | Yes — embed the JSXGraph block |
| 3 | Reading sine/cosine from the plot | Plotly (section 4) | Yes — embed the Plotly block |
| 4 | Grid comparison of amplitude formulas | Grid (section 5) | No |
| 5 | Oscillation / frequency relationships | Mermaid (section 6) | No |
| 6 | Interpreting the 3D helix | MathBox (section 7) | Yes — embed the MathBox view |
| 7 | Using the GeoGebra sandbox | GeoGebra (section 8) | Yes — embed the GeoGebra app |
| 8 | Reading trig data tables | Arquero (section 9) | No |
| 9 | Manipulating the editable formula | MathLive (section 10) | No |
| 10 | Understanding the Manim animation | Manim (section 11) | No |
| 11 | Applying summary grid concepts | Grid (section 12) | No |

### Implementation Notes
- The sample lesson is stored in `src/lib/sampleLesson.ts` — a new `SAMPLE_TRIG_LESSON` and `SAMPLE_TRIG_QUIZ` alongside the existing FTC ones.
- The Sample page (`src/pages/Sample.tsx`) gets a **tab or toggle** to switch between the two sample lessons, or shows the trig lesson alongside the FTC lesson.
- Quiz questions with embedded blocks use the `blocks` field on `QuizQuestion` (already supported in the data model).

---

## File Changes Summary

| File | Change |
|------|--------|
| `src/pages/AuthoringGuide.tsx` | Add per-technology reference sections (11 collapsible cards with 5-part structure) below the workflow steps |
| `src/lib/sampleLesson.ts` | Add `SAMPLE_TRIG_LESSON` (blocks array) and `SAMPLE_TRIG_QUIZ` (questions array) with new stable IDs |
| `src/pages/Sample.tsx` | Add tab/toggle to switch between FTC lesson and Trig lesson — or list both sequentially |
| `src/lib/types.ts` | No changes needed (all 11 block types already defined in TECH) |
| `src/lib/db.ts` | No changes needed (all types already supported) |

---

## Design Principles

1. **Learn by reading, copy by example** — Every guide section includes a real working example the author can copy-paste.
2. **Show the pitfalls up front** — Each tech section lists the most common mistakes so authors avoid them before they happen.
3. **One narrative, many tools** — The trig lesson tells one coherent story (the unit circle → waves) while naturally demonstrating every tool.
4. **Quiz ties back to lesson** — Each quiz question references a specific block, reinforcing what the author just read.
5. **Grid is a layout tool, not a separate demo** — Grid blocks are used within the lesson to arrange side-by-side content, not as a standalone showcase.
