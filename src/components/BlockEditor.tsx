import { useState } from "react";
import type { Block, BlockType } from "@/lib/db";
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
