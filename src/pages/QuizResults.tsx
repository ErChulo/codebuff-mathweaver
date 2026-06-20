import { useLiveQuery } from "dexie-react-hooks";
import db, { deleteScore } from "@/lib/db";
import { Link } from "react-router";
import { GraduationCap, Trash2 } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { toast } from "sonner";

export default function QuizResults() {
  const scores = useLiveQuery(
    () => db.scores.orderBy("completedAt").reverse().toArray(),
    []
  );

  async function handleDelete(id: string) {
    await deleteScore(id);
    toast.success("Score deleted.");
  }

  function exportCsv() {
    const rows = (scores ?? []).map((s) => ({
      quiz: s.quizTitle,
      lesson: s.lessonName,
      score: s.score,
      correct: s.correctCount,
      total: s.totalCount,
      completedAt: s.completedAt,
    }));
    const csv =
      "quiz,lesson,score,correct,total,completedAt\
" +
      rows
        .map((r) =>
          [r.quiz, r.lesson, r.score, r.correct, r.total, r.completedAt]
            .map((x) => `"${String(x).replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\
");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quiz-scores.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if ((scores ?? []).length === 0) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">Score history</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All quizzes you complete appear here, sorted by most-recent first.
          </p>
        </header>
        <EmptyState
          icon={GraduationCap}
          title={scores === undefined ? "Loading…" : "No scores yet"}
          description={
            scores === undefined
              ? "Reading from your IndexedDB store…"
              : "Take a quiz and your score, completion date, and totals are saved automatically."
          }
          cta={
            scores === undefined ? undefined : { label: "Take a quiz", to: "/quiz" }
          }
        />
      </div>
    );
  }

  // Group by quiz for clarity.
  const grouped = new Map<string, typeof scores>();
  for (const s of scores ?? []) {
    const arr = grouped.get(s.quizId) ?? [];
    arr.push(s);
    grouped.set(s.quizId, arr);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Score history</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Saved per quiz: date completed, lesson name, score (%).
          </p>
        </div>
        <button
          onClick={exportCsv}
          className="px-3 py-2 text-sm rounded-md glass-panel hover:bg-primary/15"
        >
          Export CSV
        </button>
      </header>

      <div className="space-y-4">
        {[...grouped.entries()].map(([quizId, list]) => (
          <section key={quizId} className="glass-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Link
                to={`/quiz/${quizId}`}
                className="font-semibold text-lg hover:underline"
              >
                {list![0].quizTitle}
              </Link>
              <div className="text-xs text-muted-foreground">
                {list!.length} attempt{list!.length === 1 ? "" : "s"}
              </div>
            </div>
            <div className="luminous-divider" />
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th className="text-left py-2 font-medium">Date</th>
                  <th className="text-left py-2 font-medium">Lesson</th>
                  <th className="text-right py-2 font-medium">Score</th>
                  <th className="text-right py-2 font-medium">Correct / Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list!.map((s) => (
                  <tr key={s.id} className="border-t border-white/5">
                    <td className="py-2 text-muted-foreground">
                      {new Date(s.completedAt).toLocaleString()}
                    </td>
                    <td className="py-2">{s.lessonName}</td>
                    <td className="py-2 text-right font-semibold glow-text">
                      {s.score}%
                    </td>
                    <td className="py-2 text-right text-muted-foreground">
                      {s.correctCount} / {s.totalCount}
                    </td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1 rounded-md hover:bg-destructive/20 text-destructive"
                        aria-label="Delete score"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    </div>
  );
}
