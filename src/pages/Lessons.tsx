import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router";
import db, { createLesson, deleteLesson } from "@/lib/db";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { downloadLessonAsJson, readLessonJson } from "@/lib/lessonIO";
import { BookOpen, Download, FileUp, Plus, Search, Trash2, Upload } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { cn } from "@/lib/utils";

export default function Lessons() {
  const lessons = useLiveQuery(() => db.lessons.orderBy("updatedAt").reverse().toArray(), []);
  const [query, setQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  const list = (lessons ?? []).filter((l) =>
    l.title.toLowerCase().includes(query.toLowerCase())
  );

  async function handleImport(file: File) {
    setImporting(true);
    try {
      const read = await readLessonJson(file);
      for (const l of read) {
        await createLesson({
          title: l.title,
          description: l.description,
          blocks: l.blocks,
        });
      }
      toast.success(`Imported ${read.length} lesson${read.length > 1 ? "s" : ""}.`);
    } catch (e) {
      toast.error(String((e as Error).message ?? e));
    } finally {
      setImporting(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteLesson(id);
    toast.success("Lesson deleted.");
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Lessons</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compose, edit, and read full mathematical lessons — stored locally.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            id="lesson-import"
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImport(f);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={importing}
            className="px-3 py-2 text-sm rounded-md glass-panel hover:bg-primary/15 flex items-center gap-2"
          >
            <Upload className="size-4" /> Import JSON
          </button>
          <Link
            to="/lessons/new"
            className="px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
          >
            <Plus className="size-4" /> New lesson
          </Link>
        </div>
      </header>

      <div className="glass-card p-3 flex items-center gap-2 max-w-md">
        <Search className="size-4 text-muted-foreground" />
        <input
          id="lesson-search"
          name="lesson-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lessons…"
          className="bg-transparent outline-none text-sm w-full"
          aria-label="Search lessons"
        />
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={lessons === undefined ? "Loading…" : "No lessons yet"}
          description={
            lessons === undefined
              ? "Reading from your IndexedDB store…"
              : "Create your first lesson to begin — HTML, KaTeX, Mermaid, JSXGraph, Arquero, Plotly, MathBox, MathLive, and Manim videos are supported."
          }
          cta={
            lessons === undefined
              ? undefined
              : { label: "Create a lesson", to: "/lessons/new" }
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((l, idx) => (
            <div
              key={l.id}
              className={cn("glass-card p-5 flex flex-col gap-3 fade-in")}
              style={{ animationDelay: `${Math.min(idx * 25, 200)}ms` }}
            >
              <div className="flex items-start justify-between gap-2">
                <Link to={`/lessons/${l.id}`} className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg line-clamp-2 hover:underline">
                    {l.title}
                  </h3>
                </Link>
              </div>
              {l.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {l.description}
                </p>
              )}
              <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                <span>{l.blocks.length} blocks</span>
                <span>·</span>
                <span>updated {new Date(l.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-auto">
                {l.blocks.slice(0, 6).map((b, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-foreground/80"
                  >
                    {b.type}
                  </span>
                ))}
                {l.blocks.length > 6 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-muted-foreground">
                    +{l.blocks.length - 6}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 pt-2 border-t border-white/10">
                <Link
                  to={`/lessons/${l.id}`}
                  className="text-xs px-3 py-1 rounded-md bg-primary/15 hover:bg-primary/25"
                >
                  Open
                </Link>
                <Link
                  to={`/lessons/${l.id}/edit`}
                  className="text-xs px-3 py-1 rounded-md bg-primary/15 hover:bg-primary/25"
                >
                  Edit
                </Link>
                <button
                  onClick={() => downloadLessonAsJson(l)}
                  className="text-xs px-3 py-1 rounded-md hover:bg-white/10 flex items-center gap-1"
                  title="Download as JSON"
                >
                  <Download className="size-3" /> JSON
                </button>
                <button
                  onClick={() => handleDelete(l.id, l.title)}
                  className="ml-auto text-xs px-2 py-1 rounded-md hover:bg-destructive/20 text-destructive flex items-center gap-1"
                  aria-label="Delete"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <details className="glass-panel p-3 text-xs text-muted-foreground">
        <summary className="cursor-pointer flex items-center gap-2 text-foreground/80 font-medium">
          <FileUp className="size-3" /> How import works
        </summary>
        <div className="mt-2 space-y-1 leading-relaxed">
          <p>
            Drop any JSON file produced by <em>Download JSON</em> on a lesson
            card or by this app\'s export feature.
          </p>
          <p>
            Lessons are merged into your local store. Two lessons with the same
            title and updatedAt are treated as the same entry. Share with friends
            via the exported file (e-mail, drive, etc).
          </p>
        </div>
      </details>
    </div>
  );
}
