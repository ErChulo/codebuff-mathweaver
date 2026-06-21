# Math Weaver

> ⚠️ **WORK IN PROGRESS** — This project is actively being built. Many features are incomplete, rough edges abound, and things may break without notice. See the [To-do](#to-do) section for what's next.

---

**Math Weaver** is a single-page web app for composing, studying, and quizzing yourself on math and technical topics — entirely in your browser, entirely offline.

### What

Math Weaver is a personal studio for the **read → quiz → refine loop**. You compose lessons out of typed content blocks — HTML prose, LaTeX equations via KaTeX, interactive diagrams with JSXGraph, data tables with Arquero, 3D visualizations with MathBox, flowcharts with Mermaid, charts with Plotly, editable formulas with MathLive, GeoGebra sandboxes, and CSS Grid layouts to arrange them side by side. Every lesson can spawn a themed quiz that shares its tag context. All data lives in your browser's IndexedDB — nothing is sent to a server.

### Why

Existing tools separate the reading experience from the assessment experience. You read on one platform, quiz on another, and nothing links the two. Math Weaver bakes both into the same surface: a lesson is a sequence of blocks that teach; a quiz proves the idea survived the learner. The tag system keeps everything connected — a quiz inherits the technology tags from its source lesson, so "Show me all trigonometry quizzes" just works.

The app is also a **typed library** of math communication tools — each block type (KaTeX, Mermaid, Plotly, JSXGraph, Arquero, etc.) is a first-class citizen with documented content formats, example code, common pitfalls, and pro tips in the in-app authoring guide.

### How

The app is a single-page React application built with:

- **React 19** with React Router for client-side navigation
- **TypeScript** for type safety
- **Vite** for fast builds and hot module reload
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **Dexie.js** (IndexedDB wrapper) for persistent, offline storage
- **Vite plugin singlefile** to bundle everything into a single HTML file for easy distribution

Block types load their rendering engines (KaTeX, Mermaid, Plotly, JSXGraph, etc.) from CDNs on demand — no heavy upfront downloads. The app uses `vite-plugin-singlefile` to inline all JS and CSS into a single `index.html`, making deployment as simple as opening a file.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Building for production](#building-for-production)
- [Using the built file](#using-the-built-file)
- [Project structure](#project-structure)
- [Routes](#routes)
- [Block types](#block-types)
- [To-do](#to-do)

---

## Prerequisites

- **Node.js** v18+ (tested with v22)
- **npm** v9+ (ships with Node)
- A modern browser (Chrome, Firefox, Edge, Safari)

## Quick start

```bash
# 1. Clone the repository
git clone https://github.com/ErChulo/codebuff-mathweaver.git
cd codebuff-mathweaver

# 2. Install dependencies
npm install

# 3. Start the dev server (hot reload at http://localhost:5173)
npm run dev
```

The dev server opens a Vite dev environment with full hot module replacement. Edit any source file and the page updates instantly.

## Building for production

```bash
# Build the app (TypeScript check + Vite bundle)
npm run build

# The output is a single file: dist/index.html (~783 kB gzipped to ~233 kB)
# All JS, CSS, and assets are inlined into this single HTML file.
```

The production build runs `tsc -b` for type-checking, then `vite build` with the singlefile plugin to produce a self-contained HTML file.

## Using the built file

The built `dist/index.html` is completely self-contained — open it directly in any browser:

```bash
# Open in default browser
open dist/index.html                    # macOS
xdg-open dist/index.html                # Linux
start dist/index.html                   # Windows

# Or serve via HTTP (recommended for best performance)
npx serve dist/
```

> **Note:** Some features (JSXGraph, MathBox sandboxes) work best when served via HTTP rather than the `file://` protocol, due to browser security restrictions on sandboxed iframes.

## Project structure

```
codebuff-mathweaver/
├── index.html                     # Vite entry point
├── package.json                   # Dependencies & scripts
├── vite.config.ts                 # Vite config + singlefile plugin
├── tsconfig.json                  # TypeScript config
├── src/
│   ├── main.tsx                   # App root: router setup, route definitions
│   ├── index.css                  # Global styles, theme tokens, glassmorphism
│   ├── lib/
│   │   ├── types.ts               # TECH metadata registry (all 11 block types)
│   │   ├── db.ts                  # Dexie/IndexedDB schema & helpers
│   │   ├── markdown.ts            # Minimal markdown + LaTeX parser
│   │   ├── cdn.ts                 # Dynamic CDN script/css loader
│   │   ├── sampleLesson.ts        # Curated sample lessons (FTC + Trigonometry)
│   │   ├── exportLesson.ts        # Lesson JSON export/import
│   │   ├── lessonIO.ts            # Download lesson as JSON
│   │   ├── utils.ts               # Utility functions (cn, etc.)
│   │   └── cdn.ts                 # CDN preloader
│   ├── hooks/
│   │   └── useTheme.tsx           # Dark/light theme toggle
│   ├── types/
│   │   └── global.d.ts            # Global type declarations
│   ├── components/
│   │   ├── AppLayout.tsx          # Sidebar nav + main content shell
│   │   ├── BlockRenderer.tsx      # Renders any block type to DOM
│   │   ├── BlockEditor.tsx        # Block type picker + content editor
│   │   ├── BlockTemplates.tsx     # Pre-built block templates
│   │   ├── MarkdownRenderer.tsx   # Inline markdown + LaTeX renderer
│   │   ├── NotesPanel.tsx         # Per-lesson notes panel
│   │   ├── TitleField.tsx         # Lesson/quiz title input
│   │   └── EmptyState.tsx         # Empty state placeholder
│   └── pages/
│       ├── Landing.tsx            # Landing page with hero & mantra
│       ├── Lessons.tsx            # Lesson list view
│       ├── LessonView.tsx         # Single lesson reader
│       ├── LessonEditor.tsx       # Lesson composer (create/edit)
│       ├── QuizList.tsx           # Quiz list view
│       ├── QuizRunner.tsx         # Quiz taker interface
│       ├── QuizEditor.tsx         # Quiz composer (create/edit)
│       ├── QuizResults.tsx        # Score history view
│       ├── Sample.tsx             # Curated sample lessons (FTC + Trig)
│       ├── AuthoringGuide.tsx     # In-app authoring guide + tech reference
│       ├── Technologies.tsx       # Block type directory
│       ├── GeoGebra.tsx           # GeoGebra standalone page
│       └── NotFound.tsx           # 404 page
```

## Routes

| Route | Page | Description |
|---|---|---|
| `/` | Landing | Landing page with mantra, features, and hero |
| `/lessons` | Lessons | Browse and manage your lessons |
| `/lessons/new` | LessonEditor | Create a new lesson |
| `/lessons/:id` | LessonView | Read a lesson |
| `/lessons/:id/edit` | LessonEditor | Edit an existing lesson |
| `/quiz` | QuizList | Browse and manage quizzes |
| `/quiz/new` | QuizEditor | Create a new quiz |
| `/quiz/:id` | QuizRunner | Take a quiz |
| `/quiz/:id/edit` | QuizEditor | Edit an existing quiz |
| `/results` | QuizResults | View score history |
| `/sample` | Sample | Curated sample lessons (FTC + Trig) |
| `/authoring` | AuthoringGuide | In-app authoring guide + per-technology reference |
| `/technologies` | Technologies | Directory of supported block types |
| `/geogebra` | GeoGebra | GeoGebra standalone interactive page |

## Block types

Math Weaver supports 11 content block types, each loaded on demand from CDNs:

| Type | Technology | What it does |
|---|---|---|
| `html` | HTML | Rich prose, headings, tables, lists, links |
| `katex` | KaTeX | LaTeX math typesetting (inline & display) |
| `mermaid` | Mermaid | Flowcharts, sequence diagrams, Gantt charts |
| `jsxgraph` | JSXGraph | Interactive geometry & function plots |
| `arquero` | Arquero | Data wrangling & table output |
| `plotly` | Plotly | Interactive 2D/3D charts |
| `mathbox` | MathBox | 3D WebGL math visualizations |
| `mathlive` | MathLive | Editable math input field |
| `manim` | Manim | Embedded MP4 animations |
| `geogebra` | GeoGebra | Interactive graphing, geometry & 3D |
| `grid` | CSS Grid | Responsive grid layout for side-by-side blocks |

Each block type has a full reference card in the **Authoring Guide** (`/authoring`) covering:
1. What it is — a plain-language description
2. Content format — the expected data shape
3. Example — a copy-pasteable working example
4. Common pitfalls — typical mistakes and how to avoid them
5. Pro tips — advanced usage and creative ideas

## To-do

- [ ] **Quiz LaTeX rendering** — The Trigonometry sample quiz has KaTeX rendering issues in the quiz preview; the escaping needs auditing
- [ ] **MathBox 3D helix** — The helix visualization in the Trig sample lesson uses the MathBox v2 API which requires Three.js + OrbitControls CDN dependencies that need verification
- [ ] **GeoGebra EventDispatcher error** — A non-blocking TypeError in `deployggb.js` when loaded from the `file://` protocol; the applet still renders but the console error is noisy
- [ ] **Mobile responsive pass** — The editor and quiz runner layouts need refinement on small screens
- [ ] **Quiz result persistence** — Score history is saved but there's no dashboard or analytics view yet
- [ ] **Import/export polish** — The JSON import flow works but could use better validation and error messages
- [ ] **Tag system** — Tag filtering for lessons and quizzes is partially implemented but not yet wired through the full UI
- [ ] **Search** — No search or full-text filtering for lessons and quizzes
- [ ] **Multiple quiz support per lesson** — Currently one lesson can have one quiz; the schema supports more but the UI doesn't surface it
- [ ] **User guide outside the app** — The in-app authoring guide is comprehensive for block types, but a standalone usage guide would help new users

---

Built with React, TypeScript, Vite, and Tailwind CSS. Stores data locally via Dexie/IndexedDB. No server required.
