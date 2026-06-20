import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import db, { createQuiz, updateQuiz } from "@/lib/db";
import type { Block, BlockType, Quiz, QuizQuestion } from "@/lib/db";
import { TECH } from "@/lib/types";
import { TitleField, DescriptionField } from "@/components/TitleField";
import { ArrowLeft, Plus, Save, Sparkles, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import BlockRenderer from "@/components/BlockRenderer";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function QuizEditor({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const existing = useLiveQuery(
    () => (mode === "edit" && id ? db.quizzes.get(id) : Promise.resolve(undefined)),
    [mode, id]
  ) as Quiz | undefined | null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [ready, setReady] = useState(mode === "create");
  const [openQ, setOpenQ] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode !== "edit" || !existing) return;
    if (!ready && existing) {
      setTitle(existing.title);
      setDescription(existing.description ?? "");
      setQuestions(existing.questions);
      setReady(true);
      setOpenQ(existing.questions[0]?.id ?? null);
    }
  }, [mode, existing, ready]);

  const isEmpty = !title.trim() && questions.length === 0;

  function persist(useExistingId: boolean) {
    if (!title.trim()) {
      toast.error("Please give your quiz a title.");
      return;
    }
    if (questions.length === 0) {
      toast.error("Add at least one question.");
      return;
    }
    const now = Date.now();
    const quiz: Quiz = {
      id:
        useExistingId && existing
          ? existing.id
          : `quiz_${now}_${Math.random().toString(36).slice(2, 6)}`,
      title: title.trim(),
      description: description.trim() || undefined,
      questions,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    Promise.resolve(useExistingId && existing ? updateQuiz(quiz) : createQuiz(quiz))
      .then(() => {
        toast.success("Quiz saved.");
        navigate(`/quiz/${quiz.id}`);
      })
      .catch((e) => toast.error(String(e)));
  }

  function exportJson() {
    if (!title.trim()) {
      toast.error("Add a title before exporting.");
      return;
    }
    const blob = new Blob(
      [
        JSON.stringify(
          {
            id: existing?.id,
            title,
            description,
            questions,
            createdAt: existing?.createdAt ?? Date.now(),
            updatedAt: Date.now(),
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function addQuestion() {
    const newQ: QuizQuestion = {
      id: `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      prompt: "New question",
      blocks: [],
      options: [
        { id: genOptId(), label: "Option A" },
        { id: genOptId(), label: "Option B" },
        { id: genOptId(), label: "Option C" },
        { id: genOptId(), label: "Option D" },
      ],
      correctIndex: 0,
    };
    setQuestions((qs) => [...qs, newQ]);
    setOpenQ(newQ.id);
  }

  function updateQuestion(qid: string, patch: Partial<QuizQuestion>) {
    setQuestions((qs) => qs.map((q) => (q.id === qid ? { ...q, ...patch } : q)));
  }

  function removeQuestion(qid: string) {
    setQuestions((qs) => qs.filter((q) => q.id !== qid));
  }

  function addPromptBlock(qid: string, type: BlockType) {
    const meta = TECH[type];
    const newBlock: Block = {
      id: `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      content: meta.defaultContent,
    };
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qid ? { ...q, blocks: [...(q.blocks ?? []), newBlock] } : q
      )
    );
  }

  if (mode === "edit" && existing === undefined) {
    return <div className="text-muted-foreground">Loading quiz…</div>;
  }
  if (mode === "edit" && existing === null) {
    return (
      <div className="glass-card p-10 max-w-lg mx-auto text-center">
        <p className="text-muted-foreground mb-4">Quiz not found.</p>
        <Link to="/quiz" className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          to={mode === "edit" && existing ? `/quiz/${existing.id}` : "/quiz"}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ArrowLeft className="size-3" /> Back
        </Link>
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            id="quiz-import"
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                const parsed = JSON.parse(await f.text());
                setTitle(parsed.title ?? "");
                setDescription(parsed.description ?? "");
                setQuestions(parsed.questions ?? []);
                setOpenQ(parsed.questions?.[0]?.id ?? null);
                toast.success("Loaded quiz JSON into the editor.");
              } catch (err) {
                toast.error(String((err as Error).message ?? err));
              }
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="px-3 py-1.5 rounded-md glass-panel text-xs"
          >
            Import
          </button>
          <button
            onClick={exportJson}
            className={cn(
              "px-3 py-1.5 rounded-md glass-panel text-xs flex items-center gap-1",
              isEmpty && "opacity-50"
            )}
          >
            <Download className="size-3" /> Export
          </button>
          <button
            onClick={() => persist(true)}
            disabled={!title.trim() || questions.length === 0}
            className={cn(
              "px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1",
              (!title.trim() || questions.length === 0) && "opacity-50"
            )}
          >
            <Save className="size-3" /> Save
          </button>
        </div>
      </div>

      <header className="space-y-2">
        <TitleField
          id="quiz-title"
          value={title}
          onChange={setTitle}
          placeholder="Quiz title (e.g. Practice: limits)"
        />
        <DescriptionField
          id="quiz-description"
          value={description}
          onChange={setDescription}
          placeholder="Optional description / instructions for the student."
        />
      </header>

      {questions.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Sparkles className="size-8 mx-auto mb-3 glow-text" />
          <p className="text-sm text-muted-foreground mb-4">
            Add your first question to begin authoring a quiz.
          </p>
          <button
            onClick={addQuestion}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm flex items-center gap-2 mx-auto"
          >
            <Plus className="size-4" /> Add question
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div key={q.id} className="glass-card p-4">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setOpenQ(openQ === q.id ? null : q.id)}
                  className="flex items-center gap-2 flex-1 text-left"
                >
                  <span className="size-7 rounded-md bg-primary/20 flex items-center justify-center text-xs font-bold glow-text">
                    Q{idx + 1}
                  </span>
                  <span className="font-medium line-clamp-1">{q.prompt}</span>
                </button>
                <button
                  onClick={() => removeQuestion(q.id)}
                  className="p-1.5 rounded-md hover:bg-destructive/20 text-destructive"
                  aria-label="Remove question"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>

              {openQ === q.id && (
                <div className="mt-3 space-y-3">
                  <input
                    value={q.prompt}
                    onChange={(e) => updateQuestion(q.id, { prompt: e.target.value })}
                    placeholder="Question prompt (also used as plain-text)"
                    className="w-full glass-panel p-2 text-sm bg-transparent outline-none"
                    id={`q-prompt-${q.id}`}
                    aria-label="Question prompt"
                  />

                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      Optional visual prompt
                    </div>
                    {(q.blocks ?? []).map((b, bidx) => (
                      <div key={b.id} className="glass-panel p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">
                            {TECH[b.type].label} #{bidx + 1}
                          </span>
                          <div className="flex items-center gap-2">
                            <select
                              value={b.type}
                              onChange={(e) => {
                                const next = e.target.value as BlockType;
                                updateQuestion(q.id, {
                                  blocks: (q.blocks ?? []).map((x, i) =>
                                    i === bidx
                                      ? {
                                          ...x,
                                          type: next,
                                          content: TECH[next].defaultContent,
                                        }
                                      : x
                                  ),
                                });
                              }}
                              className="bg-transparent text-xs glass-panel px-2 py-1"
                              id={`block-type-${b.id}`}
                              aria-label="Block type"
                            >
                              {(Object.keys(TECH) as BlockType[]).map((t) => (
                                <option key={t} value={t}>
                                  {TECH[t].label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() =>
                                updateQuestion(q.id, {
                                  blocks: (q.blocks ?? []).filter((_, i) => i !== bidx),
                                })
                              }
                              className="p-1 rounded-md hover:bg-destructive/20 text-destructive"
                              aria-label="Remove block"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                        <textarea
                          value={b.content}
                          onChange={(e) =>
                            updateQuestion(q.id, {
                              blocks: (q.blocks ?? []).map((x, i) =>
                                i === bidx ? { ...x, content: e.target.value } : x
                              ),
                            })
                          }
                          rows={Math.max(3, b.content.split("\
").length + 1)}
                          className="w-full font-mono text-[12px] glass-panel p-2 leading-relaxed"
                          placeholder={TECH[b.type].placeholder}
                          id={`block-content-${b.id}`}
                          aria-label={`${TECH[b.type].label} block content`}
                        />
                      </div>
                    ))}
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-xs text-muted-foreground mr-1">Insert:</span>
                      {(Object.keys(TECH) as BlockType[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => addPromptBlock(q.id, t)}
                          className="px-2 py-0.5 text-xs rounded bg-primary/15 hover:bg-primary/25"
                        >
                          {TECH[t].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      Answer options
                    </div>
                    {q.options.map((o, oIdx) => {
                      const isCorrect = q.correctIndex === oIdx;
                      return (
                        <div
                          key={o.id}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-md",
                            isCorrect ? "bg-primary/15 glow-ring" : "glass-panel"
                          )}
                        >
                          <button
                            onClick={() => updateQuestion(q.id, { correctIndex: oIdx })}
                            className={cn(
                              "size-7 rounded-full flex items-center justify-center text-xs font-bold border",
                              isCorrect
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-white/30 text-foreground/80 hover:bg-primary/20"
                            )}
                            title="Mark as correct answer"
                          >
                            {String.fromCharCode(65 + oIdx)}
                          </button>
                          <input
                            value={o.label}
                            onChange={(e) => {
                              updateQuestion(q.id, {
                                options: q.options.map((x, i) =>
                                  i === oIdx ? { ...x, label: e.target.value } : x
                                ),
                              });
                            }}
                            placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                            className="flex-1 bg-transparent outline-none text-sm"
                            id={`option-${q.id}-${oIdx}`}
                            aria-label={`Option ${String.fromCharCode(65 + oIdx)} label`}
                          />
                          {q.options.length > 2 && (
                            <button
                              onClick={() => {
                                if (isCorrect) return; // keep at least one correct
                                updateQuestion(q.id, {
                                  options: q.options.filter((_, i) => i !== oIdx),
                                  correctIndex: Math.min(q.correctIndex, q.options.length - 2),
                                });
                              }}
                              className="p-1 rounded-md hover:bg-destructive/20 text-destructive opacity-60 hover:opacity-100"
                              aria-label="Remove option"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                    <button
                      onClick={() =>
                        updateQuestion(q.id, {
                          options: [
                            ...q.options,
                            {
                              id: genOptId(),
                              label: `Option ${String.fromCharCode(65 + q.options.length)}`,
                            },
                          ],
                        })
                      }
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <Plus className="size-3" /> Add option
                    </button>
                  </div>

                  {/* Inline preview */}
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      Live preview
                    </div>
                    <div className="glass-panel p-3">
                      <MarkdownRenderer source={q.prompt} />
                      {(q.blocks ?? []).map((b) => (
                        <BlockRenderer key={b.id} block={b} />
                      ))}
                      <div className="mt-2 space-y-1">
                        {q.options.map((o, oIdx) => (
                          <div
                            key={o.id}
                            className={cn(
                              "text-xs px-3 py-1.5 rounded-md",
                              q.correctIndex === oIdx
                                ? "bg-primary/20"
                                : "bg-white/5"
                            )}
                          >
                            <strong>{String.fromCharCode(65 + oIdx)}.</strong>{' '}
                            <MarkdownRenderer source={o.label} inline />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addQuestion}
            className="w-full glass-panel p-4 text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
          >
            <Plus className="size-4" /> Add question
          </button>
        </div>
      )}
    </div>
  );
}

function genOptId() {
  return `o_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}
