import { useState } from "react";
import type { BlockType } from "@/lib/db";
import type { Block } from "@/lib/db";
import { TECH } from "@/lib/types";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TemplateMenuProps {
  onPick: (block: Block) => void;
}

/**
 * Renders a compact grid of starter templates. Each tile shows the icon,
 * label, and tagline for a technology; clicking it calls `onPick` with a fresh
 * block pre-populated with the technology\'s `defaultContent`.
 */
export default function TemplateMenu({ onPick }: TemplateMenuProps) {
  const [hover, setHover] = useState<BlockType | null>(null);
  const TYPES = Object.keys(TECH) as BlockType[];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="size-4 text-muted-foreground" />
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          Templates
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TYPES.map((t) => {
          const meta = TECH[t];
          const isHover = hover === t;
          return (
            <button
              key={t}
              onClick={() =>
                onPick({
                  id: `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
                  type: t,
                  content: meta.defaultContent,
                })
              }
              onMouseEnter={() => setHover(t)}
              onMouseLeave={() => setHover(null)}
              className={cn(
                "glass-card p-4 text-left transition-transform hover:-translate-y-0.5",
                isHover && "glow-ring"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="size-8 rounded-md bg-primary/20 flex items-center justify-center text-base font-bold glow-text">
                  {meta.icon}
                </span>
                <span className="font-semibold text-sm">{meta.label}</span>
              </div>
              <div className="text-[11px] text-muted-foreground leading-snug">
                {meta.tagline}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
