import { useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import db, { deleteNote, upsertNote } from "@/lib/db";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Download, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface NotesPanelProps {
  lessonId: string;
  /** Heading rendered above the panel. */
  heading?: string;
  className?: string;
}

/**
 * Per-lesson markdown+LaTeX notebook. Live preview side-by-side with the
 * editor; auto-saves to IndexedDB (debounced ~250ms) so a reload keeps the work.
 */
export default function NotesPanel({
  lessonId,
  heading = "Your notes",
  className,
}: NotesPanelProps) {
  const note = useLiveQuery(() => db.notes.get(lessonId), [lessonId]);
  const [draft, setDraft] = useState("");
  const [ready, setReady] = useState(false);
  const lastSavedRef = useRef("");

  // Hydrate the editor from IndexedDB once the row arrives.
  useEffect(() => {
    if (!ready && note !== undefined) {
      setDraft(note?.content ?? "");
      lastSavedRef.current = note?.content ?? "";
      setReady(true);
    }
  }, [note, ready]);

  // Debounced saver — writes after the user stops typing for ~250ms.
  useEffect(() => {
    if (!ready) return;
    if (draft === lastSavedRef.current) return;
    const t = window.setTimeout(() => {
      upsertNote(lessonId, draft).then(() => {
        lastSavedRef.current = draft;
      });
    }, 250);
    return () => window.clearTimeout(t);
  }, [draft, lessonId, ready]);

  function exportNotes() {
    const blob = new Blob([JSON.stringify({ lessonId, content: draft }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes_${lessonId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Notes exported.");
  }

  function clearNotes() {
    if (!confirm("Clear all notes for this lesson? This cannot be undone."))
      return;
    setDraft("");
    deleteNote(lessonId);
    lastSavedRef.current = "";
    toast.success("Notes cleared.");
  }

  const chars = draft.length;
  const isDirty = draft !== lastSavedRef.current;

  return (
    <section className={cn("glass-card p-5 space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold">{heading}</h2>
          <span className="text-[11px] text-muted-foreground">
            Markdown + KaTeX · auto-saved
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className={cn(
              "px-2 py-0.5 rounded-full",
              isDirty ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
            )}
            aria-live="polite"
          >
            {isDirty ? "Saving…" : "Saved"}
          </span>
          <span className="text-muted-foreground">{chars} chars</span>
          <button
            onClick={exportNotes}
            className="px-2 py-1 rounded-md hover:bg-white/10 flex items-center gap-1"
            title="Export notes as JSON"
          >
            <Download className="size-3" /> Export
          </button>
          <button
            onClick={clearNotes}
            className="px-2 py-1 rounded-md hover:bg-destructive/20 text-destructive flex items-center gap-1"
            title="Clear notes"
            aria-label="Clear notes"
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="notes-content" className="text-xs uppercase tracking-wide text-muted-foreground">
            Markdown
          </label>
          <textarea
            id="notes-content"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`# My notes\
\
Write in **markdown**. Use $...$ for inline math and $$...$$ for a display equation.\
\
Example:\
\
The mean value theorem says there exists $c$ such that\
\
$$ f\'(c) = \\\frac{f(b) - f(a)}{b - a} $$`}
            rows={Math.max(8, Math.min(24, draft.split("\
").length + 2))}
            spellCheck={false}
            className="w-full font-mono text-[13px] glass-panel p-3 leading-relaxed"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wide text-muted-foreground">
            Preview
          </label>
          <div className="glass-panel p-4 min-h-[220px]">
            {draft.trim() === "" ? (
              <p className="text-sm text-muted-foreground">
                Empty. Start typing on the left — the preview renders here in
                real time.
              </p>
            ) : (
              <MarkdownRenderer source={draft} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
