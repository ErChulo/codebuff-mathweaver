import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  GitBranch,
  Layers,
  Lightbulb,
  ListChecks,
  PenLine,
  PlusCircle,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StepKind = "lesson" | "quiz";

type Step = {
  kind: StepKind;
  title: string;
  duration: string;
  description: string;
};

const STEPS: Step[] = [
  {
    kind: "lesson",
    title: "Sketch the idea",
    duration: "2 min",
    description:
      "Open the lesson editor, give it a strong title, and write a one-sentence promise. The title field is the spine everything else hangs from.",
  },
  {
    kind: "lesson",
    title: "Compose blocks",
    duration: "5 min",
    description:
      "Drop in markdown, diagrams, interactive sandboxes, and live code blocks. Each block stays self-contained — reorder, duplicate, or delete without breaking the flow.",
  },
  {
    kind: "lesson",
    title: "Tag the stack",
    duration: "1 min",
    description:
      "Tag with the technology this lesson covers (React, Rust, Postgres, etc.). Tags power the lesson-to-quizz pipeline later.",
  },
  {
    kind: "quiz",
    title: "Spin off a quiz",
    duration: "3 min",
    description:
      "From any tagged lesson, click 'Generate quiz' — you'll get a draft aligned to the blocks you just authored. Edit, prune, or rewrite any question.",
  },
  {
    kind: "quiz",
    title: "Mix question types",
    duration: "4 min",
    description:
      "Combine multiple-choice, true/false, ordering, fill-in-the-blank, and free-response. Difficulty and topic tags stay consistent across types.",
  },
  {
    kind: "quiz",
    title: "Practice & refine",
    duration: "ongoing",
    description:
      "Take your own quiz. Track the answers you second-guess — those are the questions to rewrite. Iterate until your confidence is honest.",
  },
];

const PRINCIPLES = [
  {
    icon: Target,
    title: "One idea per block",
    body: "Tiny, atomic ideas compound. If a block is doing three things, split it.",
  },
  {
    icon: Workflow,
    title: "Lessons teach, quizzes prove",
    body: "A lesson opens the door; a quiz walks the learner across the threshold. Pair every lesson with at least one quiz.",
  },
  {
    icon: Layers,
    title: "Reuse, don't re-author",
    body: "Duplicate any lesson to remix. Imported lesson JSON stays editable once imported — nothing is write-once.",
  },
  {
    icon: Lightbulb,
    title: "Show the why, not just the how",
    body: "Every block should answer 'why this matters' before 'how to type it'. Mental models age better than syntax.",
  },
];

export default function AuthoringGuide() {
  return (
    <div className="space-y-10 max-w-5xl">
      {/* Hero */}
      <section className="relative overflow-hidden glass-card-strong p-8 md:p-12 quiz-glow-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-24 size-80 rounded-full bg-[hsl(var(--quiz-cyan)/0.25)] blur-3xl" />
          <div className="absolute -bottom-32 -left-16 size-72 rounded-full bg-[hsl(var(--quiz-magenta)/0.25)] blur-3xl" />
        </div>
        <div className="relative space-y-5">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="quiz-cyan-text bg-[hsl(var(--quiz-cyan)/0.15)] border-[hsl(var(--quiz-cyan)/0.4)]">
              <PenLine className="size-3" /> Authoring
            </Badge>
            <Badge variant="outline" className="quiz-magenta-text border-[hsl(var(--quiz-magenta)/0.4)]">
              v1.0 · in-app guide
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
            Compose a lesson.
            <br />
            <span className="bg-gradient-to-r from-[hsl(var(--quiz-cyan))] via-[hsl(var(--quiz-magenta))] to-[hsl(var(--quiz-cyan))] bg-clip-text text-transparent">
              Then prove it with a quiz.
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            This guide walks through both halves of the authoring loop. Lessons open the door
            through curated blocks. Quizzes walk the learner across the threshold and tell the
            system what they've actually internalized.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/lessons/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors quiz-pulse"
            >
              <PlusCircle className="size-4" />
              Start a lesson
            </Link>
            <Link
              to="/quiz/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card text-sm font-medium hover:glow-ring transition-all"
            >
              <ListChecks className="size-4" />
              Author a quiz
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* The loop */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              The composition loop
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold">Six moves, one rhythm.</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Lessons and quizzes share the same authoring rhythm. Each pair of moves builds on the
            last — tag-aware, idempotent, and remixed in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className={cn(
                "glass-card p-5 relative group",
                step.kind === "quiz" &&
                  "quiz-glow-border hover:bg-[hsl(var(--quiz-cyan)/0.05)]",
                step.kind === "lesson" && "hover:bg-white/5"
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "shrink-0 size-10 rounded-xl flex items-center justify-center font-mono text-sm transition-colors",
                    step.kind === "quiz"
                      ? "bg-[hsl(var(--quiz-cyan)/0.15)] quiz-cyan-text border border-[hsl(var(--quiz-cyan)/0.3)]"
                      : "bg-primary/10 text-primary border border-primary/20"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-base">{step.title}</h3>
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border",
                        step.kind === "quiz"
                          ? "quiz-cyan-text border-[hsl(var(--quiz-cyan)/0.4)]"
                          : "text-muted-foreground border-border"
                      )}
                    >
                      {step.kind === "quiz" ? "Quiz" : "Lesson"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground/70">
                    <Sparkles className="size-3" />
                    ~{step.duration}
                  </div>
                </div>
              </div>
              {step.kind === "quiz" && (
                <div className="absolute -top-1 -right-1 size-3 rounded-full bg-[hsl(var(--quiz-magenta))] quiz-pulse" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="space-y-4">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Principles
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRINCIPLES.map((p) => (
            <div
              key={p.title}
              className="glass-panel p-5 space-y-3 hover:glass-card-strong transition-all"
            >
              <div className="size-9 rounded-lg bg-[hsl(var(--quiz-cyan)/0.15)] flex items-center justify-center quiz-cyan-text">
                <p.icon className="size-4" />
              </div>
              <h4 className="font-semibold text-sm">{p.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* In-app tour */}
      <section className="glass-card-strong p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <Code2 className="size-3" />
          Once you're authoring
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Feature
            icon={GitBranch}
            title="Tag inheritance"
            body="Quiz questions inherit the tags from their source lesson so 'Show me React quizzes' just works."
          />
          <Feature
            icon={Workflow}
            title="Live autosaave"
            body="Every keystroke writes to IndexedDB. Close the tab, reopen tomorrow — it picks up exactly where you left off."
          />
          <Feature
            icon={Layers}
            title="Remix-first JSON"
            body="Export any lesson or quiz as portable JSON. Drop the file back into the app and it rehydrates as a draft to keep iterating."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <Link
            to="/lessons/new"
            className="group p-5 rounded-2xl glass-panel hover:glass-card-strong transition-all flex items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="font-semibold">Open the lesson editor</div>
              <div className="text-xs text-muted-foreground">
                Title, blocks, tags, export — all in one studio.
              </div>
            </div>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 quiz-cyan-text" />
          </Link>
          <Link
            to="/quiz/new"
            className="group p-5 rounded-2xl glass-panel hover:glass-card-strong transition-all flex items-center justify-between gap-3 quiz-glow-border"
          >
            <div className="space-y-1">
              <div className="font-semibold quiz-cyan-text">Open the quiz editor</div>
              <div className="text-xs text-muted-foreground">
                Five question types, all theme-aware.
              </div>
            </div>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 quiz-magenta-text" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="space-y-2">
      <div className="size-9 rounded-lg border border-[hsl(var(--quiz-cyan)/0.3)] flex items-center justify-center quiz-cyan-text bg-[hsl(var(--quiz-cyan)/0.08)]">
        <Icon className="size-4" />
      </div>
      <h4 className="font-semibold text-sm">{title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
