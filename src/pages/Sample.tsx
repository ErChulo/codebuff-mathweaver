import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import BlockRenderer from "@/components/BlockRenderer";
import { loadTech } from "@/lib/cdn";
import { downloadLessonAsJson } from "@/lib/lessonIO";
import { createLesson, createQuiz } from "@/lib/db";
import {
  SAMPLE_LESSON,
  SAMPLE_LESSON_ID,
  SAMPLE_QUIZ,
  SAMPLE_QUIZ_ID,
  SAMPLE_TRIG_LESSON,
  SAMPLE_TRIG_LESSON_ID,
  SAMPLE_TRIG_QUIZ,
  SAMPLE_TRIG_QUIZ_ID,
} from "@/lib/sampleLesson";
import {
  ArrowRight,
  Database,
  Download,
  PlayCircle,
  Sigma,
  Sparkles,
  Waves,
} from "lucide-react";
import { toast } from "sonner";

/**
 * Sample showcase page. Renders the curated lesson + quiz in-memory.
 * Lets the user:
 *   • Read the lesson right here (no Dexie write required).
 *   • Take the quiz — first seeds stable ids into Dexie, then routes to the
 *     production QuizRunner so persistence works exactly like a user-authored
 *     quiz.
 *   • Import to studio — copies the lesson + quiz into the user\'s local
 *     IndexedDB without leaving the page.
 *   • Download .json — downloads a single Lesson (matches the studio\'s
 *     Import JSON contract) so users can use this file as a copy-pasteable
 *     authoring reference.
 */
export default function Sample() {
  const navigate = useNavigate();
  const [lessonTab, setLessonTab] = useState<"ftc" | "trig">("ftc");

  const activeLesson =
    lessonTab === "trig" ? SAMPLE_TRIG_LESSON : SAMPLE_LESSON;
  const activeQuiz =
    lessonTab === "trig" ? SAMPLE_TRIG_QUIZ : SAMPLE_QUIZ;
  const activeLessonId =
    lessonTab === "trig" ? SAMPLE_TRIG_LESSON_ID : SAMPLE_LESSON_ID;
  const activeQuizId =
    lessonTab === "trig" ? SAMPLE_TRIG_QUIZ_ID : SAMPLE_QUIZ_ID;

  async function importToStudio() {
    try {
      await createLesson({
        id: activeLessonId,
        title: activeLesson.title,
        description: activeLesson.description,
        blocks: activeLesson.blocks,
      });
      await createQuiz({
        id: activeQuizId,
        title: activeQuiz.title,
        description: activeQuiz.description,
        lessonId: activeQuiz.lessonId,
        questions: activeQuiz.questions,
      });
      toast.success("Sample lesson + quiz saved to your studio.");
      navigate("/lessons");
    } catch (e) {
      toast.error(String((e as Error).message ?? e));
    }
  }

  function startQuiz() {
    importToStudio()
      .then(() => navigate(`/quiz/${activeQuizId}`))
      .catch(() => undefined);
  }

  function downloadJson() {
    const filename =
      lessonTab === "trig"
        ? "sample_trigonometric-functions.json"
        : "sample_fundamental-theorem.json";
    downloadLessonAsJson(activeLesson, filename);
  }

  const TABS = [
    {
      id: "ftc" as const,
      label: "FTC",
      icon: Sigma,
      title: "The Fundamental Theorem of Calculus",
      description:
        "A full, interactive lesson composed entirely in Math Weaver — five block types, working together. Take its quiz to prove the idea survived you, then download the bundle as JSON to use as a starting template.",
    },
    {
      id: "trig" as const,
      label: "Trig",
      icon: Waves,
      title: "Trigonometric Functions: From the Unit Circle to Waves",
      description:
        "A guided tour of trigonometry showcasing all 11 block types — HTML, KaTeX, JSXGraph, Mermaid, Plotly, GeoGebra, Arquero, MathBox, MathLive, Manim, and CSS Grid — working together in a single lesson.",
    },
  ];

  const activeTab = TABS.find((t) => t.id === lessonTab)!;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Lesson tabs */}
      <div className="flex gap-1.5 glass-panel p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setLessonTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              lessonTab === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <tab.icon className="size-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden glass-card-strong p-8 md:p-10 quiz-glow-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 size-72 rounded-full bg-[hsl(var(--quiz-cyan)/0.25)] blur-3xl" />
          <div className="absolute -bottom-24 -left-16 size-64 rounded-full bg-[hsl(var(--quiz-magenta)/0.25)] blur-3xl" />
        </div>
        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <activeTab.icon className="size-3 quiz-cyan-text" />{" "}
            {activeTab.label} sample
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-[hsl(var(--quiz-cyan))] via-[hsl(var(--quiz-magenta))] to-[hsl(var(--quiz-cyan))] bg-clip-text text-transparent">
              {activeTab.title}
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            {activeTab.description}
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={startQuiz}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <PlayCircle className="size-4" /> Take this quiz
            </button>
            <button
              onClick={importToStudio}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-sm font-medium hover:bg-white/5 transition-colors"
            >
              <Database className="size-4" /> Save to my studio
            </button>
            <button
              onClick={downloadJson}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-sm font-medium hover:bg-white/5 transition-colors"
            >
              <Download className="size-4" /> Download .json
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground pt-1">
            Stable ids: <code>{activeLessonId}</code>,{" "}
            <code>{activeQuizId}</code>. Re-importing is idempotent.
          </p>
        </div>
      </section>

      {/* Lesson preview */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-xl font-semibold">Lesson preview</h2>
          <span className="text-xs text-muted-foreground">
            {activeLesson.blocks.length} blocks · Rendered live
          </span>
        </div>
        <article className="space-y-5">
          {activeLesson.blocks.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.3), duration: 0.3 }}
            >
              <BlockRenderer block={b} />
            </motion.div>
          ))}
        </article>
      </section>

      {/* Quiz preview */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-xl font-semibold">Quiz preview</h2>
          <span className="text-xs text-muted-foreground">
            {activeQuiz.questions.length} questions · not saved until you click Take
          </span>
        </div>
        <div className="space-y-3">
          {activeQuiz.questions.map((q, i) => (
            <div key={q.id} className="glass-card p-4">
              <div className="flex items-center gap-2">
                <span className="size-7 rounded-md bg-primary/20 flex items-center justify-center text-xs font-bold glow-text">
                  Q{i + 1}
                </span>
                <span className="text-sm font-medium">
                  Question {i + 1} of {activeQuiz.questions.length}
                </span>
              </div>
              <div className="mt-2 text-sm leading-relaxed">
                <KatexPrompt text={q.prompt} />
              </div>
              {q.blocks?.map((b) => (
                <div key={b.id} className="mt-3">
                  <BlockRenderer block={b} />
                </div>
              ))}
              <ol className="mt-2 space-y-1 pl-4 list-[upper-alpha] text-sm">
                {q.options.map((o) => (
                  <li key={o.id} className="text-muted-foreground">
                    <KatexPrompt text={o.label} />
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <p className="text-sm text-muted-foreground">
            Ready to lock in what you just read?
          </p>
          <button
            onClick={startQuiz}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Start the quiz <ArrowRight className="size-4" />
          </button>
        </div>
      </section>

      {/* JSON shape */}
      <section className="glass-card p-5 space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          JSON shape you\'ll download
        </h3>
        <pre className="text-[12px] font-mono leading-relaxed overflow-x-auto bg-black/30 dark:bg-black/50 p-3 rounded-md">
{`// downloadLessonAsJson writes a single Lesson document — the same
// shape accepted by Lessons.tsx\'s "Import JSON" handler:

{
  "id": "<stable id>",
  "title": "${activeLesson.title}",
  "description": "${activeLesson.description}",
  "blocks": Block[]
}

// Block format     — { id, type, content, settings? }
// Accepted types   — html, katex, mermaid, jsxgraph, arquero,
//                    plotly, mathbox, mathlive, manim

// Round-trip this file through the studio\'s "Import JSON" button
// to recreate the lesson verbatim.
// In the meantime, click "Save to my studio" to also seed the
// matching quiz into IndexedDB on a stable id.`}
        </pre>
      </section>
    </div>
  );
}

/**
 * Cheap inline renderer for quiz prompts: splits on `$...$` and KaTeX-renders
 * the math segments while leaving prose untouched. Used only for the Sample
 * page\'s "Quiz preview" so it intentionally does not implement the full
 * markdown parser.
 */
function KatexPrompt({ text }: { text: string }) {
  const segs: Array<{ kind: "text" | "math"; value: string }> = [];
  let i = 0;
  let buf = "";
  while (i < text.length) {
    if (text[i] === "$") {
      const end = text.indexOf("$", i + 1);
      if (end !== -1 && !text.slice(i + 1, end).includes("\
")) {
        if (buf) segs.push({ kind: "text", value: buf });
        buf = "";
        segs.push({ kind: "math", value: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    buf += text[i];
    i++;
  }
  if (buf) segs.push({ kind: "text", value: buf });

  return (
    <>
      {segs.map((s, k) =>
        s.kind === "math" ? (
          <InlineMath key={k} tex={s.value} />
        ) : (
          <span key={k}>{s.value}</span>
        )
      )}
    </>
  );
}

function InlineMath({ tex }: { tex: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadTech("katex");
      if (cancelled || !ref.current) return;
      try {
        const katex = (window as unknown as { katex: any }).katex;
        katex.render(tex, ref.current, {
          throwOnError: false,
          displayMode: false,
          output: "html",
        });
      } catch (e) {
        setErr(String((e as Error).message ?? e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tex]);
  if (err) {
    return <span className="text-destructive text-xs">${tex}$</span>;
  }
  return <span ref={ref} />;
}
