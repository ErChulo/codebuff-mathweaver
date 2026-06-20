# Spec: Embedded Diagram & Graph Rendering Investigation

## 1. Overview

Investigate and fix embedded diagrams/graphs that fail to render in the Math Weaver App.
The user reported that some diagrams/graphs did not render in the preview. Upon inspection,
the JSXGraph interactive diagram (Riemann rectangles) shows a gray/empty iframe.

**Scope:** Verify ALL block types render correctly:
- JSXGraph (interactive geometry) — **confirmed broken, now FIXED**
- MathBox (3D math visualizations) — **CDN URL was 404, now FIXED**
- Mermaid (flowchart / sequence diagrams)
- Plotly (interactive charts)
- KaTeX (math typesetting — both inline and display)
- Arquero (data tables)
- MathLive (editable math input) — **error handling improved**
- Manim (video embeds)
- GeoGebra (separate page with iframe embeds)

**Target content:** The sample lesson (`SAMPLE_LESSON` in `src/lib/sampleLesson.ts`),
which contains blocks of type: html, katex, jsxgraph, mermaid, plotly.

---

## 2. Findings — Before & After Fix

### 2.1 Critical Bug: Iframe Script Ordering (JSXGraph & MathBox) — ✅ FIXED

**File:** `src/components/BlockRenderer.tsx` — function `buildScriptSandbox()`

**Before fix:** The generated iframe HTML placed the CDN `<script src="...">` tag
**after** the inline script that used the library:

```html
<!-- BROKEN: inline script runs before CDN loads -->
<script>
  const board = JXG.JSXGraph.initBoard('box', ...);  // ReferenceError: JXG not defined
  try { /* user script */ } catch (e) { /* show error */ }
</script>
<script src="https://cdn.jsdelivr.net/npm/jsxgraph@1.10.0/distrib/jsxgraphcore.js"></script>
```

The error occurred **outside** the `try/catch` block (on the `const board = JXG...`
line before the try), so no error message was shown — the script silently crashed,
and the iframe stayed gray/empty.

**After fix:** CDN script tag now loads **before** the inline script:

```html
<!-- FIXED: CDN loads first, then inline script uses the library -->
<script src="https://cdn.jsdelivr.net/npm/jsxgraph@1.10.0/distrib/jsxgraphcore.js"></script>
<script>
  const board = JXG.JSXGraph.initBoard('box', ...);  // JXG is defined ✓
  try { /* user script */ } catch (e) { /* show error */ }
</script>
```

### 2.2 CDN URL Deduplication — ✅ FIXED

**File:** `src/components/BlockRenderer.tsx` — `buildScriptSandbox()`

**Before fix:** JSXGraph and MathBox CDN URLs were **hardcoded** in
`buildScriptSandbox()`, duplicating the version information from `TECH` metadata
in `types.ts`. This meant any version update to `TECH` would silently drift from
the iframe sandbox URLs.

**After fix:** `buildScriptSandbox()` now reads CDN URLs from `TECH[kind].cdnJs`
and `TECH[kind].cdnCss`, making a single source of truth for all CDN URLs.

### 2.3 MathBox CDN URL Broken — ✅ FIXED

**File:** `src/lib/types.ts` — `TECH.mathbox`

| Field | Before (BROKEN) | After (FIXED) |
|-------|-----------------|---------------|
| version | `mathbox@2.2.6` | `mathbox@2.3.1` |
| js path | `build/mathbox.min.js` | `build/bundle/mathbox.js` |
| css path | _(missing)_ | `build/mathbox.css` |

**Investigation:** Version `2.2.6` never existed on the npm registry. The available
versions jump from `2.2.1` → `2.3.0` → `2.3.1` → `2.3.2-rc1`.
The file path `build/mathbox.min.js` also doesn't exist — the correct file within
the npm package is `build/bundle/mathbox.js`. The CSS file at `build/mathbox.css`
was also missing and has been added.

### 2.4 MathLiveBody Error Handling — ✅ FIXED

**File:** `src/components/BlockRenderer.tsx` — `MathLiveBody`

**Before fix:** No `err` state variable or `try/catch`. If `loadTech("mathlive")`
failed (CDN down, blocked), the error was silently swallowed and the user saw an
empty `<div>` with no feedback.

**After fix:** Added `err`/`setErr` state and wrapped CDN-dependent logic in
`try/catch`. Now consistent with all other renderers (KatexBody, MermaidBody,
PlotlyBody, ArqueroBody).

### 2.5 CDN URL Health Check — ✅ VERIFIED

All CDN URLs confirmed returning HTTP 200:

| Tech | URL | Status |
|------|-----|--------|
| KaTeX JS | `katex@0.16.11/dist/katex.min.js` | ✅ 200 |
| KaTeX CSS | `katex@0.16.11/dist/katex.min.css` | ✅ 200 |
| Mermaid JS | `mermaid@10.9.1/dist/mermaid.min.js` | ✅ 200 |
| JSXGraph JS | `jsxgraph@1.10.0/distrib/jsxgraphcore.js` | ✅ 200 |
| JSXGraph CSS | `jsxgraph@1.10.0/distrib/jsxgraph.css` | ✅ 200 |
| Arquero JS | `arquero@5.4.0/dist/arquero.min.js` | ✅ 200 |
| Plotly JS | `plotly-2.35.2.min.js` | ✅ 200 |
| MathBox JS | `mathbox@2.3.1/build/bundle/mathbox.js` | ✅ 200 |
| MathBox CSS | `mathbox@2.3.1/build/mathbox.css` | ✅ 200 |
| MathLive JS | `mathlive@0.95.0/dist/mathlive.min.js` | ✅ 200 |

### 2.6 Other Observations (unchanged)

- **Mermaid:** Uses `mermaid.initialize()` inside useEffect. The `theme` is set
  based on `document.documentElement.classList.contains("dark")`. This works but
  won't react to theme changes after initial render (re-render requires content
  change via `cacheKey` dependency). Minor UX issue, not a rendering blocker.

- **Plotly:** Uses `Plotly.purge()` in the cleanup function. If Plotly CDN failed
  to load, the cleanup checks `if (Plotly && ref.current)` — safe.

- **KaTeX in MarkdownRenderer:** Separate from BlockRenderer. Uses same `loadTech`
  pattern. Works independently.

- **GeoGebra:** Separate page (`/geogebra`) with iframe embeds from geogebra.org.
  The iframe sandbox attribute includes `allow-same-origin` which is needed for
  the GeoGebra applet to function. Uses `buildEmbedUrl()` to construct the embed
  URL. Could be blocked by:
  - Ad-blockers (common for geogebra.org embeds)
  - Mixed content warnings (if served over HTTP with an HTTPS page)
  - CSP restrictions

- **Arquero:** Uses `new Function("aq", userContent)`. This is a code execution
  vector — user-authored content is run as-is. Already in a controlled authoring
  context, so acceptable risk.

---

## 3. Interview Summary

Questions were asked over 3 rounds via the `ask_user` tool:

### Round 1 — Scope
- **Which diagrams failed?** → JSXGraph (interactive geometry)
- **What did you see?** → Gray/empty iframe

### Round 2 — Environment
- **Other renderers checked?** → Only JSXGraph was checked; others unknown
- **Browser?** → Not sure
- **Local dev or production?** → Not sure

### Round 3 — Investigation Scope
- **Which renderers to check?** → ALL of them
- **Which lessons to check?** → Sample lesson only
- **Browser verification after fix?** → Not yet — fix first, then decide

---

## 4. Fixes Applied

| # | Description | Files Changed | Status |
|---|------------|---------------|--------|
| 1 | **Iframe script ordering** — moved CDN `<script src="...">` before inline script in `buildScriptSandbox()` | `BlockRenderer.tsx` | ✅ DONE |
| 2 | **CDN URL deduplication** — `buildScriptSandbox()` now reads from `TECH[kind].cdnJs` and `TECH[kind].cdnCss` | `BlockRenderer.tsx` | ✅ DONE |
| 3 | **MathBox CDN URL fix** — version 2.2.6 → 2.3.1, path `build/mathbox.min.js` → `build/bundle/mathbox.js`, added `cdnCss` | `types.ts` | ✅ DONE |
| 4 | **MathLiveBody error handling** — added `err` state and `try/catch` for CDN failure | `BlockRenderer.tsx` | ✅ DONE |
| 5 | **CDN URL verification** — all 10 URLs checked with curl, all return 200 | _(audit only)_ | ✅ DONE |
| 6 | **TypeScript check** — `tsc --noEmit` passes with zero errors | _(validation)_ | ✅ DONE |
| 7 | **Production build** — `vite build` completes successfully | _(validation)_ | ✅ DONE |
| 8 | **Code review** — code-reviewer-deepseek-flash approved all changes | _(validation)_ | ✅ DONE |

---

## 5. Edge Cases & Considerations

| Edge Case | How it's handled | Current Status |
|-----------|-----------------|----------------|
| CDN script fails to load in iframe | `<script src="...">` inside iframe srcdoc has no `onerror` — silent failure | ⚠️ Iframe stays blank |
| CDN blocked by ad-blocker (main page) | `onerror` rejects promise; caught by `try/catch` in all renderers | ✅ Error text shown |
| CDN blocked by ad-blocker (iframe) | Iframe's own CDN `<script>` has no error handling | ⚠️ Iframe stays blank |
| CSP blocks inline scripts in iframe | `sandbox="allow-scripts"` permits inline scripts | ✅ Correct |
| CSP blocks CDN domain | Sandboxed iframe inherits parent CSP | ⚠️ Iframe may not load |
| Mermaid theme doesn't update on dark/light toggle | Captured at render time, not reactive | ✅ Minor UX issue |
| Plotly purge in cleanup when CDN never loaded | Guarded with `if (Plotly && ref.current)` | ✅ Safe |
| MathLive CDN failure | Now caught with `try/catch` and error displayed | ✅ Fixed |
| Arquero `new Function()` code execution | In authoring context — acceptable | ✅ Documented risk |
| GeoGebra embed fails silently | No error feedback if geogebra.org is unreachable | ⚠️ Silent failure |
| Version drift between TECH and buildScriptSandbox | Resolved — single source of truth via `TECH` metadata | ✅ FIXED |

---

## 6. Success Criteria

1. ✅ **JSXGraph iframe** — script-ordering bug fixed; Riemann rectangles should now render
2. ✅ **MathBox CDN** — URL corrected from 404 to working; CSS now also loaded
3. ✅ **MathLive error handling** — added try/catch and error display
4. ✅ **CDN URL deduplication** — `buildScriptSandbox()` uses `TECH` metadata, no more drift
5. ✅ **All CDN URLs verified** — every URL returns HTTP 200
6. ✅ **TypeScript check** — passes with zero errors
7. ✅ **Production build** — completes successfully
8. ⬜ **Browser verification** — still pending (user opted to "fix first, then decide")

---

## 7. Non-Goals

- ❌ No new features or block types
- ❌ No CSS/design changes to how diagrams are framed
- ❌ No changes to the CDN versioning strategy (pinned versions stay pinned)
- ❌ No changes to the GeoGebra page beyond verifying the embed format
- ❌ No changes to non-rendering code (auth, navigation, data persistence, etc.)

---

## 8. Browser Verification Results — ✅ PASSED

Verification performed using Playwright Chromium against `http://localhost:5199` (Vite dev server).

| Test | Status | Notes |
|------|--------|-------|
| JSXGraph Riemann rectangles render | ✅ PASS | Previously gray/empty iframe — now renders correctly with interactive geometry |
| Mermaid flowchart | ✅ PASS | Flowchart showing "Slice curve at Δx → Sum f(xᵢ)·Δx → Shrink Δx → 0" renders |
| Plotly bar chart | ✅ PASS | "Left Riemann sum for sin(x)" chart renders with bars and line trace |
| KaTeX math equations | ✅ PASS | Math equations in quiz questions render (e.g. integrals, sums, fractions) |
| GeoGebra embed page | ✅ PASS | Sample buttons clickable; iframe loads GeoGebra materials from geogebra.org |
| Console errors (critical) | ✅ NONE | Only minor warning: missing manifest icon `logo.png` (pre-existing, not renderer-related) |

**Console warnings (non-critical):**
- `Manifest icon not found: logo.png` — the app references `logo.png` in its manifest but no such file exists in `/public`. Does not affect rendering.
- `Form field element should have an id or name attribute` — on the GeoGebra page's input field. Minor accessibility issue.
