import { useState } from "react";
import type { Block, BlockType, GridCell } from "@/lib/db";
import { TECH } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import BlockRenderer from "./BlockRenderer";

export interface BlockEditorProps {
  blocks: Block[];
  onChange: (next: Block[]) => void;
}

const TYPE_ORDER: BlockType[] = Object.keys(TECH) as BlockType[];

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [openId, setOpenId] = useState<string | null>(blocks[0]?.id ?? null);
  const [showPreview, setShowPreview] = useState(true);

  const update = (id: string, patch: Partial<Block>) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const remove = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
  };

  const move = (id: string, dir: -1 | 1) => {
    const idx = blocks.findIndex((b) => b.id === id);
    const next = idx + dir;
    if (next < 0 || next >= blocks.length) return;
    const copy = [...blocks];
    [copy[idx], copy[next]] = [copy[next], copy[idx]];
    onChange(copy);
  };

  const addAfter = (id: string, type: BlockType) => {
    const idx = blocks.findIndex((b) => b.id === id);
    const meta = TECH[type];
    const newBlock: Block = {
      id: `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      content: meta.defaultContent,
    };
    const next = [...blocks];
    next.splice(idx + 1, 0, newBlock);
    onChange(next);
    setOpenId(newBlock.id);
  };

  // Grid-specific helpers
  const genCellId = () =>
    `gcell_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const genBlockId = () =>
    `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

  const updateGridSettings = (id: string, patch: Record<string, unknown>) => {
    update(id, {
      settings: { ...(blocks.find((b) => b.id === id)?.settings ?? {}), ...patch },
    });
  };

  const addGridCell = (id: string) => {
    const block = blocks.find((b) => b.id === id);
    const cells = (block?.settings?.cells as GridCell[]) ?? [];
    updateGridSettings(id, {
      cells: [
        ...cells,
        { id: genCellId(), blocks: [] },
      ],
    });
  };

  const removeGridCell = (blockId: string, cellId: string) => {
    const block = blocks.find((b) => b.id === blockId);
    const cells = (block?.settings?.cells as GridCell[]) ?? [];
    if (cells.length <= 1) return;
    updateGridSettings(blockId, {
      cells: cells.filter((c) => c.id !== cellId),
    });
  };

  const updateCellBlocks = (blockId: string, cellId: string, nextBlocks: Block[]) => {
    const block = blocks.find((b) => b.id === blockId);
    const cells = (block?.settings?.cells as GridCell[]) ?? [];
    updateGridSettings(blockId, {
      cells: cells.map((c) =>
        c.id === cellId ? { ...c, blocks: nextBlocks } : c
      ),
    });
  };

  const addCellBlock = (blockId: string, cellId: string, type: BlockType) => {
    const block = blocks.find((b) => b.id === blockId);
    const cells = (block?.settings?.cells as GridCell[]) ?? [];
    const meta = TECH[type];
    const newBlock: Block = {
      id: genBlockId(),
      type,
      content: meta.defaultContent,
    };
    updateGridSettings(blockId, {
      cells: cells.map((c) =>
        c.id === cellId ? { ...c, blocks: [...c.blocks, newBlock] } : c
      ),
    });
  };

  const removeCellBlock = (blockId: string, cellId: string, blockToRemoveId: string) => {
    const block = blocks.find((b) => b.id === blockId);
    const cells = (block?.settings?.cells as GridCell[]) ?? [];
    updateGridSettings(blockId, {
      cells: cells.map((c) =>
        c.id === cellId
          ? { ...c, blocks: c.blocks.filter((b) => b.id !== blockToRemoveId) }
          : c
      ),
    });
  };

  const moveCellBlock = (
    blockId: string,
    cellId: string,
    blockIdx: number,
    dir: -1 | 1
  ) => {
    const block = blocks.find((b) => b.id === blockId);
    const cells = (block?.settings?.cells as GridCell[]) ?? [];
    const cell = cells.find((c) => c.id === cellId);
    if (!cell) return;
    const next = blockIdx + dir;
    if (next < 0 || next >= cell.blocks.length) return;
    const copy = [...cell.blocks];
    [copy[blockIdx], copy[next]] = [copy[next], copy[blockIdx]];
    updateCellBlocks(blockId, cellId, copy);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-3">
        <div className="glass-card p-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Blocks
            </span>
            <span className="text-xs text-muted-foreground">
              {blocks.length} total
            </span>
          </div>
          <button
            className="text-xs flex items-center gap-1 px-2 py-1 rounded-md bg-primary/15 hover:bg-primary/25"
            onClick={() => setShowPreview((s) => !s)}
          >
            {showPreview ? (
              <>
                <EyeOff className="size-3" /> Hide preview
              </>
            ) : (
              <>
                <Eye className="size-3" /> Show preview
              </>
            )}
          </button>
        </div>

        {blocks.length === 0 && (
          <div className="glass-panel p-6 text-center text-sm text-muted-foreground">
            No blocks yet. Use <span className="font-medium text-foreground">Add block</span> below to
            insert your first one.
          </div>
        )}

        {blocks.map((b, i) => (
          <div key={b.id} className="glass-card p-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <button
                onClick={() => setOpenId(openId === b.id ? null : b.id)}
                className="flex items-center gap-2 flex-1 min-w-0 text-left"
              >
                <span
                  className="size-7 rounded-md bg-primary/15 flex items-center justify-center text-sm font-semibold glow-text"
                  aria-hidden
                >
                  {TECH[b.type].icon}
                </span>
                <span className="font-medium text-sm">{TECH[b.type].label}</span>
                <span className="text-xs text-muted-foreground truncate">
                  #{i + 1}
                </span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => move(b.id, -1)}
                  disabled={i === 0}
                  className={cn(
                    "p-1.5 rounded-md hover:bg-white/10",
                    i === 0 && "opacity-40 pointer-events-none"
                  )}
                  aria-label="Move up"
                >
                  <ArrowUp className="size-3.5" />
                </button>
                <button
                  onClick={() => move(b.id, 1)}
                  disabled={i === blocks.length - 1}
                  className={cn(
                    "p-1.5 rounded-md hover:bg-white/10",
                    i === blocks.length - 1 && "opacity-40 pointer-events-none"
                  )}
                  aria-label="Move down"
                >
                  <ArrowDown className="size-3.5" />
                </button>
                <button
                  onClick={() => remove(b.id)}
                  className="p-1.5 rounded-md hover:bg-destructive/20 text-destructive"
                  aria-label="Remove block"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>

            {openId === b.id && (
              <div className="mt-2 space-y-2">
                <label htmlFor={`block-type-${b.id}`} className="text-xs text-muted-foreground">
                  Type
                </label>
                <select
                  id={`block-type-${b.id}`}
                  value={b.type}
                  onChange={(e) => {
                    const next = e.target.value as BlockType;
                    update(b.id, {
                      type: next,
                      content: TECH[next].defaultContent,
                    });
                  }}
                  className="w-full bg-transparent glass-panel p-2 text-sm"
                >
                  {TYPE_ORDER.map((t) => (
                    <option key={t} value={t}>
                      {TECH[t].label} — {TECH[t].tagline}
                    </option>
                  ))}
                </select>

                {b.type === "grid" ? (
                  <GridEditorPanel
                    block={b}
                    onUpdateSettings={(patch) => updateGridSettings(b.id, patch)}
                    onAddCell={() => addGridCell(b.id)}
                    onRemoveCell={(cellId) => removeGridCell(b.id, cellId)}
                    onAddCellBlock={(cellId, type) => addCellBlock(b.id, cellId, type)}
                    onRemoveCellBlock={(cellId, blockId) =>
                      removeCellBlock(b.id, cellId, blockId)
                    }
                    onMoveCellBlock={(cellId, blockIdx, dir) =>
                      moveCellBlock(b.id, cellId, blockIdx, dir)
                    }
                    onUpdateCellBlocks={(cellId, nextBlocks) =>
                      updateCellBlocks(b.id, cellId, nextBlocks)
                    }
                  />
                ) : (
                  <>
                    <label htmlFor={`block-content-${b.id}`} className="text-xs text-muted-foreground block mt-2">
                      {TECH[b.type].label} content
                    </label>
                    <textarea
                      id={`block-content-${b.id}`}
                      value={b.content}
                      onChange={(e) => update(b.id, { content: e.target.value })}
                      rows={Math.max(4, Math.min(12, b.content.split("\
").length + 2))}
                      spellCheck={false}
                      placeholder={TECH[b.type].placeholder}
                      className="w-full font-mono text-[13px] glass-panel p-3 leading-relaxed"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Tip: {TECH[b.type].tagline}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-muted-foreground mr-1">
                          Insert below:
                        </span>
                        {TYPE_ORDER.map((t) => (
                          <button
                            key={t}
                            onClick={() => addAfter(b.id, t)}
                            title={`Add ${TECH[t].label}`}
                            className="px-1.5 py-0.5 text-[11px] rounded bg-primary/15 hover:bg-primary/25"
                          >
                            {TECH[t].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="glass-card p-3 flex flex-wrap items-center gap-1">
          <span className="text-xs text-muted-foreground mr-2 flex items-center gap-1">
            <Plus className="size-3" /> Add block
          </span>
          {TYPE_ORDER.map((t) => {
            const meta = TECH[t];
            const newBlock: Block = {
              id: `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
              type: t,
              content: meta.defaultContent,
            };
            return (
              <button
                key={t}
                onClick={() => {
                  onChange([...blocks, newBlock]);
                  setOpenId(newBlock.id);
                }}
                className="px-2 py-1 text-xs rounded-md bg-primary/15 hover:bg-primary/25"
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {showPreview && (
        <div className="space-y-4">
          <div className="glass-card p-3 text-xs text-muted-foreground">
            Live preview (renders all current blocks)
          </div>
          {blocks.length === 0 ? (
            <div className="glass-panel p-10 text-center text-sm text-muted-foreground">
              Add a block to see it render here.
            </div>
          ) : (
            blocks.map((b) => <BlockRenderer key={b.id} block={b} />)
          )}
        </div>
      )}
    </div>
  );
}

// =======================================================
// Grid Editor Panel — controls + visual grid cell editing
// =======================================================
interface GridEditorPanelProps {
  block: Block;
  onUpdateSettings: (patch: Record<string, unknown>) => void;
  onAddCell: () => void;
  onRemoveCell: (cellId: string) => void;
  onAddCellBlock: (cellId: string, type: BlockType) => void;
  onRemoveCellBlock: (cellId: string, blockId: string) => void;
  onMoveCellBlock: (cellId: string, blockIdx: number, dir: -1 | 1) => void;
  onUpdateCellBlocks: (cellId: string, nextBlocks: Block[]) => void;
}

function GridEditorPanel({
  block,
  onUpdateSettings,
  onAddCell,
  onRemoveCell,
  onAddCellBlock,
  onRemoveCellBlock,
  onMoveCellBlock,
  onUpdateCellBlocks,
}: GridEditorPanelProps) {
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

  const handleCellBlockContentChange = (
    cellId: string,
    blockId: string,
    content: string
  ) => {
    const cell = cells.find((c) => c.id === cellId);
    if (!cell) return;
    onUpdateCellBlocks(
      cellId,
      cell.blocks.map((b) => (b.id === blockId ? { ...b, content } : b))
    );
  };

  return (
    <div className="space-y-3">
      {/* Grid controls toolbar */}
      <div className="glass-panel p-2 flex flex-wrap items-center gap-2">
        {/* Columns */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground mr-1">
            Cols
          </span>
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => onUpdateSettings({ gridColumns: n })}
              className={cn(
                "size-7 rounded-md text-xs font-medium transition-colors",
                columns === n
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/10 hover:bg-white/20 text-muted-foreground"
              )}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-white/10" />

        {/* Gap */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground mr-1">
            Gap
          </span>
          {[
            { value: "sm", label: "Sm" },
            { value: "md", label: "Md" },
            { value: "lg", label: "Lg" },
          ].map((g) => (
            <button
              key={g.value}
              onClick={() => onUpdateSettings({ gridGap: g.value })}
              className={cn(
                "px-2 py-1 rounded-md text-xs font-medium transition-colors",
                gap === g.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/10 hover:bg-white/20 text-muted-foreground"
              )}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-white/10" />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground mr-1">
            Align
          </span>
          {[
            { value: "stretch", label: "Str" },
            { value: "start", label: "St" },
            { value: "center", label: "Ct" },
            { value: "end", label: "End" },
          ].map((a) => (
            <button
              key={a.value}
              onClick={() => onUpdateSettings({ gridAlign: a.value })}
              className={cn(
                "px-2 py-1 rounded-md text-xs font-medium transition-colors",
                align === a.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/10 hover:bg-white/20 text-muted-foreground"
              )}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-white/10" />

        {/* Responsive toggle */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground mr-1">
            Resp
          </span>
          <button
            onClick={() => onUpdateSettings({ responsive: !responsive })}
            className={cn(
              "px-2 py-1 rounded-md text-xs font-medium transition-colors",
              responsive
                ? "bg-primary text-primary-foreground"
                : "bg-white/10 hover:bg-white/20 text-muted-foreground"
            )}
          >
            {responsive ? "On" : "Off"}
          </button>
        </div>
      </div>

      {/* Cell count */}
      <div className="text-xs text-muted-foreground">
        {cells.length} cell{cells.length !== 1 ? "s" : ""}
      </div>

      {/* Visual grid preview with dashed cell borders */}
      <div
        className={cn(
          "grid grid-cols-1",
          gapClass,
          alignClass,
          "grid-body",
          "border border-dashed border-white/20 rounded-lg p-2"
        )}
        style={
          {
            "--grid-cols": columns,
          } as React.CSSProperties
        }
      >
        {cells.length === 0 ? (
          <div className="col-span-full p-8 text-center text-sm text-muted-foreground">
            No cells yet. Add one below.
          </div>
        ) : (
          cells.map((cell, cIdx) => (
            <div
              key={cell.id}
              className="border border-dashed border-white/30 rounded-lg p-2 relative group"
            >
              {/* Cell header */}
              <div className="flex items-center justify-between mb-2 text-[10px] text-muted-foreground">
                <span>
                  Cell {cIdx + 1}
                  {cell.blocks.length > 0 && (
                    <span className="ml-1">· {cell.blocks.length} block{cell.blocks.length !== 1 ? "s" : ""}</span>
                  )}
                </span>
                {cells.length > 1 && (
                  <button
                    onClick={() => onRemoveCell(cell.id)}
                    className="p-1 rounded hover:bg-destructive/20 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove cell"
                  >
                    <Trash2 className="size-3" />
                  </button>
                )}
              </div>

              {/* Cell blocks */}
              {cell.blocks.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground italic">
                  Empty cell — add a block below
                </div>
              ) : (
                <div className="space-y-2">
                  {cell.blocks.map((cb, cbIdx) => (
                    <CellBlockItem
                      key={cb.id}
                      block={cb}
                      index={cbIdx}
                      total={cell.blocks.length}
                      onRemove={() => onRemoveCellBlock(cell.id, cb.id)}
                      onMoveUp={
                        cbIdx > 0
                          ? () => onMoveCellBlock(cell.id, cbIdx, -1)
                          : undefined
                      }
                      onMoveDown={
                        cbIdx < cell.blocks.length - 1
                          ? () => onMoveCellBlock(cell.id, cbIdx, 1)
                          : undefined
                      }
                      onContentChange={(content) =>
                        handleCellBlockContentChange(cell.id, cb.id, content)
                      }
                    />
                  ))}
                </div>
              )}

              {/* Add block to cell */}
              <div className="mt-2 flex items-center gap-1 flex-wrap">
                <span className="text-[10px] text-muted-foreground mr-1">+</span>
                {TYPE_ORDER.filter((t) => t !== "grid").map((t) => (
                  <button
                    key={t}
                    onClick={() => onAddCellBlock(cell.id, t)}
                    className="px-1.5 py-0.5 text-[10px] rounded bg-primary/15 hover:bg-primary/25"
                    title={`Add ${TECH[t].label} block`}
                  >
                    {TECH[t].label}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add cell button */}
      <button
        onClick={onAddCell}
        className="w-full glass-panel p-3 text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
      >
        <Plus className="size-4" /> Add cell
      </button>
    </div>
  );
}

// =======================================================
// Cell Block Item — compact block display in a grid cell
// =======================================================
interface CellBlockItemProps {
  block: Block;
  index: number;
  total: number;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onContentChange: (content: string) => void;
}

function CellBlockItem({
  block,
  index,
  total,
  onRemove,
  onMoveUp,
  onMoveDown,
  onContentChange,
}: CellBlockItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-panel p-2">
      <div className="flex items-center justify-between gap-1">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 flex-1 min-w-0 text-left"
        >
          <span className="text-xs font-medium">
            {TECH[block.type].icon} {TECH[block.type].label}
          </span>
          <span className="text-[10px] text-muted-foreground">#{index + 1}</span>
        </button>
        <div className="flex items-center gap-0.5">
          {onMoveUp && (
            <button
              onClick={onMoveUp}
              className="p-1 rounded hover:bg-white/10"
              aria-label="Move up"
            >
              <ArrowUp className="size-3" />
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={onMoveDown}
              className="p-1 rounded hover:bg-white/10"
              aria-label="Move down"
            >
              <ArrowDown className="size-3" />
            </button>
          )}
          <button
            onClick={onRemove}
            className="p-1 rounded hover:bg-destructive/20 text-destructive"
            aria-label="Remove block"
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      </div>

      {open && (
        <textarea
          defaultValue={block.content}
          onBlur={(e) => {
            const val = e.target.value.trim();
            if (val !== block.content) onContentChange(val);
          }}
          rows={Math.max(3, Math.min(8, block.content.split("\
").length + 1))}
          className="w-full font-mono text-[11px] bg-black/20 p-2 rounded mt-1 leading-relaxed"
          placeholder={TECH[block.type].placeholder}
          spellCheck={false}
        />
      )}
    </div>
  );
}
