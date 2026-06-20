import { Link, useNavigate, useParams } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import db, { recordScore, type Quiz, type QuizOption, type QuizQuestion, type Block } from "@/lib/db";
import { useState } from "react";
import BlockRenderer from "@/components/BlockRenderer";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";

export default function QuizRunner() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quiz = useLiveQuery(
    () => (id ? db.quizzes.get(id) : Promise.resolve(undefined)),
    [id]
  ) as Quiz | undefined | null;

  const [questionIdx, setQuestionIdx] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [answersLocked, setAnswersLocked] = useState(false);
  const [finished, setFinished] = useState(false);

  if (quiz === undefined) {
    return <div className="text-muted-foreground">Loading quiz…</div>;
  }

  if (quiz === null) {
    return (
      <div className="glass-card p-10 text-center max-w-lg mx-auto">
        <p className="text-muted-foreground mb-4">Quiz not found.</p>
        <Link to="/quiz" className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm">
          Back
        </Link>
      </div>
    );
  }

  if (quiz.questions.length === 0) {
    return (
      <div className="glass-card p-10 max-w-lg mx-auto text-center">
        <p className="text-muted-foreground mb-4">
          This quiz has no questions yet. Add some from the editor.
        </p>
        <Link
          to={`/quiz/${quiz.id}/edit`}
          className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm"
        >
          Open editor
        </Link>
      </div>
    );
  }

  const total = quiz.questions.length;
  const current = quiz.questions[questionIdx];
  const correctCount = quiz.questions.filter(
    (q: QuizQuestion) => picks[q.id] === q.correctIndex
  ).length;

  function pick(qid: string, idx: number) {
    if (answersLocked) return;
    setPicks((prev) => ({ ...prev, [qid]: idx }));
  }

  async function finish() {
    const score = Math.round((correctCount / total) * 100);
    await recordScore({
      quizId: quiz!.id,
      quizTitle: quiz!.title,
      lessonName: quiz!.title,
      score,
      correctCount,
      totalCount: total,
    });
    setFinished(true);
    toast.success(`Score saved: ${score}%`);
  }

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="glass-card-strong p-8 text-center">
          <CheckCircle2 className="size-12 mx-auto mb-3 glow-text" />
          <h2 className="text-3xl font-semibold mb-2">Quiz complete</h2>
          <p className="text-sm text-muted-foreground">
            You answered {correctCount} out of {total} correctly.
          </p>
          <div className="text-6xl font-bold mt-6 mb-2 glow-text">{Math.round((correctCount / total) * 100)}%</div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Score
          </div>
        </div>

        <div className="space-y-3">
          {quiz.questions.map((q: QuizQuestion, i: number) => {
            const picked = picks[q.id];
            const isCorrect = picked === q.correctIndex;
            return (
              <div
                key={q.id}
                className={`glass-card p-5 ${
                  isCorrect ? "border-primary/40" : "border-destructive/40"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`size-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCorrect ? "bg-primary/30" : "bg-destructive/30"
                    }`}
                  >
                    {isCorrect ? "✓" : "✗"}
                  </span>
                  <span className="text-sm font-medium">Question {i + 1}</span>
                </div>
                <p className="text-sm mb-3">{q.prompt}</p>
                <div className="space-y-2">
                  {q.options.map((o: QuizOption, oIdx: number) => (
                    <div
                      key={o.id}
                      className={`text-sm rounded-md px-3 py-2 ${
                        oIdx === q.correctIndex
                          ? "bg-primary/20"
                          : picked === oIdx
                          ? "bg-destructive/20"
                          : "bg-white/5"
                      }`}
                    >
                      <span className="font-medium mr-2">
                        {String.fromCharCode(65 + oIdx)}.
                      </span>
                      {o.label}
                      {oIdx === q.correctIndex && (
                        <span className="ml-2 text-[11px] text-primary">Correct</span>
                      )}
                      {picked === oIdx && oIdx !== q.correctIndex && (
                        <span className="ml-2 text-[11px] text-destructive">Your pick</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <Link
            to="/results"
            className="px-3 py-1.5 rounded-md glass-panel text-xs"
          >
            View score history
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPicks({});
                setQuestionIdx(0);
                setFinished(false);
              }}
              className="px-3 py-1.5 rounded-md glass-panel text-xs flex items-center gap-1"
            >
              <RotateCcw className="size-3" /> Retake
            </button>
            <Link
              to="/quiz"
              className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs"
            >
              Back to quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <Link
          to="/quiz"
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ArrowLeft className="size-3" /> Quizzes
        </Link>
        <div className="text-xs text-muted-foreground">
          Question {questionIdx + 1} of {total}
        </div>
      </div>

      <div className="glass-card-strong p-8 space-y-5">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold glow-text leading-snug">
            {current.prompt}
          </h2>
          {current.blocks?.map((b: Block) => (
            <BlockRenderer key={b.id} block={b} />
          ))}
        </div>

        <div className="space-y-2">
          {current.options.map((o: QuizOption, oIdx: number) => {
            const picked = picks[current.id] === oIdx;
            return (
              <button
                key={o.id}
                onClick={() => pick(current.id, oIdx)}
                className={`w-full text-left rounded-xl p-4 transition-all border ${
                  picked
                    ? "bg-primary/20 border-primary/50 glow-ring"
                    : "glass-panel hover:bg-primary/10 border-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`size-7 rounded-full flex items-center justify-center text-sm font-bold border ${
                      picked
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-white/30 text-foreground/80"
                    }`}
                  >
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span>{o.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={() => setQuestionIdx((i) => Math.max(0, i - 1))}
            disabled={questionIdx === 0}
            className="px-3 py-1.5 rounded-md glass-panel text-xs flex items-center gap-1 disabled:opacity-40"
          >
            <ArrowLeft className="size-3" /> Previous
          </button>
          {questionIdx < total - 1 ? (
            <button
              onClick={() => setQuestionIdx((i) => Math.min(total - 1, i + 1))}
              disabled={picks[current.id] === undefined}
              className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1 disabled:opacity-40"
            >
              Next <ArrowRight className="size-3" />
            </button>
          ) : (
            <button
              onClick={finish}
              disabled={
                Object.keys(picks).length < total ||
                picks[current.id] === undefined
              }
              className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1 disabled:opacity-40 glow-ring"
            >
              <CheckCircle2 className="size-3" /> Finish
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 justify-center pt-2">
          {quiz.questions.map((q: QuizQuestion, i: number) => {
            const answered = picks[q.id] !== undefined;
            return (
              <button
                key={q.id}
                onClick={() => setQuestionIdx(i)}
                className={`size-2.5 rounded-full ${
                  i === questionIdx
                    ? "bg-primary"
                    : answered
                    ? "bg-primary/40"
                    : "bg-white/20"
                }`}
                aria-label={`Go to question ${i + 1}`}
              />
            );
          })}
        </div>
      </div>

      <button
        onClick={() => {
          if (confirm("Discard your progress?")) navigate("/quiz");
        }}
        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
      >
        <X className="size-3" /> Discard & exit
      </button>
    </div>
  );
}
