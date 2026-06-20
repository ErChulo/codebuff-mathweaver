import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router";
import db, { deleteQuiz } from "@/lib/db";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ListChecks, Plus, Trash2, Upload } from "lucide-react";
import EmptyState from "@/components/EmptyState";

export default function QuizList() {
  const quizzes = useLiveQuery(
    () => db.quizzes.orderBy("updatedAt").reverse().toArray(),
    []
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  async function handleImport(file: File) {
    setImporting(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      for (const q of list) {
        if (typeof q?.title !== "string" || !Array.isArray(q?.questions)) {
          throw new Error("Invalid quiz JSON");
        }
        const { createQuiz } = await import("@/lib/db");
        await createQuiz({
          title: q.title,
          description: q.description,
          lessonId: q.lessonId,
          questions: q.questions,
        });
      }
      toast.success(`Imported ${list.length} quiz${list.length > 1 ? "zes" : ""}.`);
    } catch (e) {
      toast.error(String((e as Error).message ?? e));
    } finally {
      setImporting(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}" and its scores? This cannot be undone.`)) return;
    await deleteQuiz(id);
    toast.success("Quiz deleted.");
  }

  const list = quizzes ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Quizzes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Author interactive quizzes in any of the supported technologies. Your
            scores save here automatically.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            id="quiz-list-import"
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
            to="/quiz/new"
            className="px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
          >
            <Plus className="size-4" /> New quiz
          </Link>
        </div>
      </header>

      {list.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title={quizzes === undefined ? "Loading…" : "No quizzes yet"}
          description={
            quizzes === undefined
              ? "Reading from your IndexedDB store…"
              : "Author your first quiz — mix KaTeX, Mermaid, JSXGraph, arquero tables, Manim videos, and more into each question."
          }
          cta={
            quizzes === undefined ? undefined : { label: "Create a quiz", to: "/quiz/new" }
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((q, idx) => (
            <div
              key={q.id}
              className="glass-card p-5 flex flex-col gap-3 fade-in"
              style={{ animationDelay: `${Math.min(idx * 25, 200)}ms` }}
            >
              <Link to={`/quiz/${q.id}`} className="font-semibold text-lg line-clamp-2 hover:underline">
                {q.title}
              </Link>
              {q.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">{q.description}</p>
              )}
              <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                <span>{q.questions.length} questions</span>
                <span>·</span>
                <span>updated {new Date(q.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-auto">
                {q.questions.slice(0, 6).map((qq, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-foreground/80"
                  >
                    Q{i + 1}
                  </span>
                ))}
                {q.questions.length > 6 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-muted-foreground">
                    +{q.questions.length - 6}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 pt-2 border-t border-white/10">
                <Link
                  to={`/quiz/${q.id}`}
                  className="text-xs px-3 py-1 rounded-md bg-primary/15 hover:bg-primary/25"
                >
                  Take
                </Link>
                <Link
                  to={`/quiz/${q.id}/edit`}
                  className="text-xs px-3 py-1 rounded-md bg-primary/15 hover:bg-primary/25"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(q.id, q.title)}
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
    </div>
  );
}
