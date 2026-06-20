# HTML Grid Layout Block — Specification

## 1. Overview

Add a new block type (`grid`) to the Math Weaver block system that arranges content in a CSS grid layout. The grid block wraps dynamically-managed child cells, each of which can contain any supported block type (KaTeX, HTML, Plotly, Mermaid, etc.). The user configures the grid via UI controls (column count, gap, responsive behavior, alignment) rather than writing raw CSS.

---

## 2. Data Model

### 2.1 New block type

Extend `BlockType` union in `src/lib/db.ts`:

```ts
export type BlockType =
  | "html"
  | "katex"
  | "mermaid"
  // … existing types …
  | "grid";   // NEW
```

### 2.2 Grid-specific data shape

The existing `Block` interface has `content` (string), `settings` (optional `Record<string, unknown>`), and `id`/`type`. For the grid block:

- `content` — unused or empty string (cells carry their own content).
- `settings.gridColumns` — number of columns (2–4, default 2).
- `settings.gridGap` — gap size index: `"sm" | "md" | "lg"` (default `"md"`), mapped to `gap-2 | gap-4 | gap-6`.
- `settings.gridAlign` — alignment: `"stretch" | "start" | "center" | "end"` (default `"stretch"`), mapped to `align-items`.
- `settings.responsive` — boolean (default `true`). When true, auto-collapse to single column on mobile (`< 640px`).
- `settings.cells` — array of cell definitions.

### 2.3 Cell definition

Introduce a `GridCell` interface:

```ts
export interface GridCell {
  id: string;
  blocks: Block[];      // each cell contains its own list of blocks
}
```

The grid `Block.content` field can remain empty. The structured grid data lives in `settings.cells` and `settings.grid*` properties.

### 2.4 TechMeta entry

Add a new entry to `TECH` in `src/lib/types.ts`:

```ts
grid: {
  type: "grid",
  label: "Grid",
  tagline: "CSS grid layout for side-by-side content",
  description: "Arrange multiple blocks in a responsive grid with auto-collapse on mobile. Each cell can contain its own content blocks.",
  icon: "⊞",
  cdnJs: "",
  placeholder: "",
  defaultContent: "",
}
```

Note: No CDN dependency — grid is pure CSS.

---

## 3. Editor UI (BlockEditor integration)

### 3.1 Grid block panel

When a `grid` block is opened in the block editor, its edit panel shows:

#### 3.1.1 Grid controls toolbar (collapsed by default, expandable)

| Control | Type | Values |
|---------|------|--------|
| **Columns** | Button group | 1, 2, 3, 4 (default 2) |
| **Gap** | Segmented control | Sm, Md, Lg (default Md) |
| **Alignment** | Segmented control | Stretch, Start, Center, End |
| **Responsive** | Toggle | On (default) / Off |

#### 3.1.2 Visual grid preview

Below the controls, render a live editable preview showing the grid layout with dashed cell borders visible only in the editor.

- Each cell shows a mini block area with:
  - A small toolbar (Add block, cell-level actions)
  - The rendered content of the cell's blocks
  - A "ghost" placeholder when the cell is empty: *"Drop blocks here or click + to add"*
- Cells can be reordered via drag handles (if practical in first iteration, fall back to move-up / move-down buttons on each cell).

#### 3.1.3 Adding/removing cells

- **Add cell**: Button at bottom of grid preview labeled "+ Add cell". Appends a new empty cell.
- **Remove cell**: Trash icon on each cell. Minimum 1 cell enforced.
- **Add block to cell**: Within each cell, a row of block-type buttons (same as the existing "Add block" bar) lets the user insert a new block into that cell.

### 3.2 Cell block editor

Each cell gets its own mini block editor that follows the same pattern as the main `BlockEditor` component but is vertically compact:

- Clicking a cell opens a nested block editor for that cell's blocks.
- Each cell's blocks can be of any type (html, katex, mermaid, plotly, etc.).
- The cell editor shows: block type selector, content textarea, move up/down, remove.

### 3.3 TemplateMenu

The `grid` type appears in the `TemplateMenu` component alongside all other block types, with its icon and tagline. Selecting it creates a grid block with default settings (2 columns, md gap, 2 empty cells).

---

## 4. Rendering (BlockRenderer)

### 4.1 GridBody component

Add a new `GridBody` case in `BlockRenderer.tsx`'s `BlockBody` switch:

```tsx
case "grid":
  return <GridBody content={block.content} settings={block.settings} />;
```

### 4.2 GridBody implementation

```tsx
const GridBody = memo(function GridBody({
  content,
  settings,
}: {
  content: string;
  settings?: Record<string, unknown>;
}) {
  const columns = settings?.gridColumns ?? 2;
  const gap = settings?.gridGap ?? "md";
  const align = settings?.gridAlign ?? "stretch";
  const responsive = settings?.responsive !== false;
  const cells = (settings?.cells as GridCell[]) ?? [];

  const gapClass = gap === "sm" ? "gap-2" : gap === "lg" ? "gap-6" : "gap-4";
  const alignClass =
    align === "start"
      ? "items-start"
      : align === "center"
        ? "items-center"
        : align === "end"
          ? "items-end"
          : "items-stretch";

  return (
    <div
      className={cn(
        "grid p-5",
        `grid-cols-1`,
        `sm:grid-cols-${columns}`,
        gapClass,
        alignClass,
      )}
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
```

**Mobile behavior**: The grid always starts as `grid-cols-1`. On `sm:` breakpoint (640px+) it switches to the configured column count via Tailwind's responsive prefix. This achieves auto-collapse without JavaScript.

### 4.3 Editor grid guides

When rendered inside the block editor (a `compact` or `editing` mode), apply a dashed border to each cell so the author can see the grid layout:

```tsx
// In editor mode, add:
"border border-dashed border-white/20"
```

### 4.4 Compact mode

When `compact` prop is true (used in quiz previews, etc.), the grid should still render with the same layout but without outer `glass-card` wrapping and reduced padding.

---

## 5. Lesson View Rendering

In `LessonView.tsx`, blocks are rendered via `<BlockRenderer key={b.id} block={b} />`. Since `BlockRenderer` dispatches to `GridBody` for grid blocks, no changes are needed in `LessonView` itself.

The grid renders with:
- The configured column count at `sm:` breakpoint and above
- 1 column below `sm:` breakpoint
- Each cell maintaining the glass-card styling
- Child blocks rendered via their individual renderers (KaTeX, Mermaid, etc.)

---

## 6. Technical Details

### 6.1 Database migration

Since the grid uses `Block.settings` (already a `Record<string, unknown>`) rather than adding a new table, no IndexedDB migration is required. Existing blocks with type `grid` will have their grid structure in `settings.cells` and grid configuration in `settings.grid*` properties.

### 6.2 Tailwind dynamic class limitation

Tailwind does not support dynamic class names. The `grid-cols-${columns}` pattern will not work if purged. Options:

1. **Whitelist classes**: Add `grid-cols-1`, `grid-cols-2`, `grid-cols-3`, `grid-cols-4` to the Tailwind safelist in `vite.config.ts` or tailwind config.
2. **Use inline style**: `{ gridTemplateColumns: \`repeat(${columns}, 1fr)\` }` — avoids the purge issue entirely.
3. **Map manually**: Use a lookup object `{ 1: "grid-cols-1", 2: "grid-cols-2", … }`.

**Recommendation**: Use inline style for `gridTemplateColumns` and Tailwind classes for gap/alignment, to keep things simple and avoid purge issues.

For the responsive auto-collapse, wrap in two `<div>`s:
- Outer: visible on mobile, `display: block;`
- Inner (visually hidden on mobile): the grid itself

Or more practically, use a media-query-aware approach with Tailwind responsive variants — but since responsive column count doesn't map to a single Tailwind utility, use inline style combined with a CSS custom property approach:

```tsx
style={{
  gridTemplateColumns: `repeat(${columns}, 1fr)`,
}}
// On mobile, CSS in index.css can override:
// .grid-mobile-collapse { grid-template-columns: 1fr !important; }
// @media (min-width: 640px) { .grid-mobile-collapse { grid-template-columns: var(--grid-cols) !important; } }
```

Simpler approach: **Use two separate divs or `@media` query with CSS variable**.

### 6.3 Cell identity

Each `GridCell.id` is generated the same way as `Block.id`: `gcell_${Date.now().toString(36)}_${random}`.

### 6.4 Block nesting constraints

A grid cell should NOT contain another `grid` block to avoid nested grid complexity. Validate on insert.

### 6.5 Export

JSON export of a lesson includes the grid block's `settings` as-is, so grid layout is preserved when exporting/importing.

---

## 7. Implementation Steps (Suggested Order)

1. **Data model**: Add `GridCell` interface and `"grid"` to `BlockType` in `db.ts`.
2. **TechMeta**: Add `grid` entry to `TECH` in `types.ts`.
3. **Renderer**: Implement `GridBody` component in `BlockRenderer.tsx` with grid CSS, glass-card cells, and child block rendering.
4. **Editor**: Add grid-specific editor UI in `BlockEditor.tsx` — controls (columns, gap, alignment, responsive toggle) and visual cell management.
5. **Cell sub-editor**: Implement inline block editor within each grid cell.
6. **TemplateMenu**: No changes needed — it already iterates over all `TECH` entries.
7. **Validation**: Prevent nested grids.
8. **Testing**: Verify lesson view rendering, editor preview, JSON export/import, and mobile collapse.

---

## 8. Edge Cases & Constraints

- **Minimum 1 cell**: The editor must enforce at least 1 cell.
- **Empty cell**: Renders as a placeholder "Empty cell" message.
- **Nested grids**: Prevented.
- **Single column (gridColumns = 1)**: Renders as a single column with glass-card cells stacked vertically — equivalent to existing block stacking but with cell borders.
- **Zero cells**: Treat as a single empty cell.
- **Very wide grids (>4 columns)**: Not supported via UI controls, but the column button group caps at 4.
- **Many cells (>12)**: UI should scroll within the visual grid preview area.
- **Dark mode**: Glass-card theming adapts automatically via CSS variables.
- **Single-file HTML build**: No CDN dependencies, so no extra work.
