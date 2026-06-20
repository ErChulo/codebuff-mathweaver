import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Box,
  Braces,
  CircuitBoard,
  Cpu,
  Database,
  Globe,
  Layers,
  ListChecks,
  Plug,
  Server,
  Smartphone,
  Sparkles,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Tech = {
  id: string;
  name: string;
  family: "frontend" | "backend" | "data" | "systems" | "mobile" | "tooling";
  icon: React.ComponentType<{ className?: string }>;
  blurb: string;
  lessons: number;
  quizzes: number;
  accentClass: string;
  ringClass: string;
};

const TECHS: Tech[] = [
  {
    id: "react",
    name: "React",
    family: "frontend",
    icon: Braces,
    blurb: "Component-driven UI, hooks, suspense, and the mental model behind the virtual DOM.",
    lessons: 12,
    quizzes: 7,
    accentClass: "quiz-cyan-text",
    ringClass: "from-[hsl(var(--quiz-cyan))] to-[hsl(var(--quiz-magenta))]",
  },
  {
    id: "vue",
    name: "Vue 3",
    family: "frontend",
    icon: Layers,
    blurb: "Reactive primitives, the Composition API, and single-file component ergonomics.",
    lessons: 6,
    quizzes: 3,
    accentClass: "quiz-cyan-text",
    ringClass: "from-[hsl(var(--quiz-cyan))] to-[hsl(var(--quiz-magenta))]",
  },
  {
    id: "svelte",
    name: "Svelte",
    family: "frontend",
    icon: Sparkles,
    blurb: "Compile-time reactivity, runes, and why no virtual DOM still ships fast.",
    lessons: 4,
    quizzes: 2,
    accentClass: "quiz-magenta-text",
    ringClass: "from-[hsl(var(--quiz-magenta))] to-[hsl(var(--quiz-cyan))]",
  },
  {
    id: "solid",
    name: "SolidJS",
    family: "frontend",
    icon: CircuitBoard,
    blurb: "Fine-grained signals, JSX without re-renders, and what React would feel like with signals.",
    lessons: 3,
    quizzes: 2,
    accentClass: "quiz-cyan-text",
    ringClass: "from-[hsl(var(--quiz-cyan))] to-[hsl(var(--quiz-magenta))]",
  },
  {
    id: "node",
    name: "Node.js",
    family: "backend",
    icon: Server,
    blurb: "Event loop, streams, and the runtime friction behind every async bug you've ever hit.",
    lessons: 9,
    quizzes: 5,
    accentClass: "quiz-magenta-text",
    ringClass: "from-[hsl(var(--quiz-magenta))] to-[hsl(var(--quiz-cyan))]",
  },
  {
    id: "go",
    name: "Go",
    family: "backend",
    icon: Terminal,
    blurb: "Goroutines, channels, the standard library, and writing backends you can read on Monday.",
    lessons: 7,
    quizzes: 4,
    accentClass: "quiz-cyan-text",
    ringClass: "from-[hsl(var(--quiz-cyan))] to-[hsl(var(--quiz-magenta))]",
  },
  {
    id: "rust",
    name: "Rust",
    family: "systems",
    icon: Cpu,
    blurb: "Ownership, borrowing, lifetimes — and the joy of shipping systems code without the segfaults.",
    lessons: 11,
    quizzes: 6,
    accentClass: "quiz-magenta-text",
    ringClass: "from-[hsl(var(--quiz-magenta))] to-[hsl(var(--quiz-cyan))]",
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    family: "data",
    icon: Database,
    blurb: "Relational thinking, query plans, indexes, and what 'set-based' really means in practice.",
    lessons: 8,
    quizzes: 4,
    accentClass: "quiz-cyan-text",
    ringClass: "from-[hsl(var(--quiz-cyan))] to-[hsl(var(--quiz-magenta))]",
  },
  {
    id: "graphql",
    name: "GraphQL",
    family: "backend",
    icon: Plug,
    blurb: "Schema-first APIs, resolvers, dataloaders, and the cost curve of over-fetching in disguise.",
    lessons: 5,
    quizzes: 3,
    accentClass: "quiz-magenta-text",
    ringClass: "from-[hsl(var(--quiz-magenta))] to-[hsl(var(--quiz-cyan))]",
  },
  {
    id: "react-native",
    name: "React Native",
    family: "mobile",
    icon: Smartphone,
    blurb: "Cross-platform primitives, native modules, and the trade-offs of single-codebase mobile.",
    lessons: 4,
    quizzes: 2,
    accentClass: "quiz-cyan-text",
    ringClass: "from-[hsl(var(--quiz-cyan))] to-[hsl(var(--quiz-magenta))]",
  },
  {
    id: "docker",
    name: "Docker",
    family: "tooling",
    icon: Box,
    blurb: "Layered images, multi-stage builds, and the art of making an environment reproducible.",
    lessons: 6,
    quizzes: 3,
    accentClass: "quiz-magenta-text",
    ringClass: "from-[hsl(var(--quiz-magenta))] to-[hsl(var(--quiz-cyan))]",
  },
  {
    id: "web",
    name: "Web Platform",
    family: "frontend",
    icon: Globe,
    blurb: "HTML, CSS, accessibility, the platform APIs no framework can replace — and how to learn them deeply.",
    lessons: 14,
    quizzes: 6,
    accentClass: "quiz-cyan-text",
    ringClass: "from-[hsl(var(--quiz-cyan))] to-[hsl(var(--quiz-magenta))]",
  },
];

const FAMILIES: { id: Tech["family"]; label: string; emoji: string }[] = [
  { id: "frontend", label: "Frontend", emoji: "◆" },
  { id: "backend", label: "Backend", emoji: "▣" },
  { id: "data", label: "Data", emoji: "▦" },
  { id: "systems", label: "Systems", emoji: "◈" },
  { id: "mobile", label: "Mobile", emoji: "▤" },
  { id: "tooling", label: "Tooling", emoji: "▥" },
];

export default function Technologies() {
  const stats = {
    techs: new Set(TECHS.map((t) => t.id)).size,
    lessons: TECHS.reduce((acc, t) => acc + t.lessons, 0),
    quizzes: TECHS.reduce((acc, t) => acc + t.quizzes, 0),
  };

  return (
    <div className="space-y-10 max-w-6xl">
      {/* Hero */}
      <section className="relative overflow-hidden glass-card-strong p-8 md:p-12 quiz-glow-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 size-96 rounded-full bg-[hsl(var(--quiz-cyan)/0.2)] blur-3xl" />
          <div className="absolute -bottom-32 -left-24 size-80 rounded-full bg-[hsl(var(--quiz-magenta)/0.2)] blur-3xl" />
        </div>
        <div className="relative space-y-6">
          <Badge variant="outline" className="border-[hsl(var(--quiz-cyan)/0.4)] quiz-cyan-text">
            <Sparkles className="size-3" /> Technologies library
          </Badge>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight max-w-3xl">
            Pick a stack.
            <br />
            <span className="bg-gradient-to-r from-[hsl(var(--quiz-cyan))] via-[hsl(var(--quiz-magenta))] to-[hsl(var(--quiz-cyan))] bg-clip-text text-transparent">
              Prove it under time.
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Each card opens into a curated stream of lessons, then a quiz layer that's drawn from
            the same tagged corpus. No quiz is a quiz about a lesson you can't read.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {FAMILIES.map((f) => {
              const count = TECHS.filter((t) => t.family === f.id).length;
              return (
                <Badge
                  key={f.id}
                  variant="secondary"
                  className="bg-white/5 border-border text-foreground/80 px-3 py-1"
                >
                  <span className="quiz-cyan-text mr-1.5">{f.emoji}</span> {f.label}
                  <span className="text-muted-foreground/70 ml-1.5">· {count}</span>
                </Badge>
              );
            })}
          </div>
          <div className="flex gap-6 pt-4 text-xs text-muted-foreground">
            <span>
              <span className="quiz-cyan-text font-semibold text-sm">{stats.techs}</span> technologies
            </span>
            <span>
              <span className="quiz-cyan-text font-semibold text-sm">{stats.lessons}</span> lessons
            </span>
            <span>
              <span className="quiz-magenta-text font-semibold text-sm">{stats.quizzes}</span> quizzes
            </span>
          </div>
        </div>
      </section>

      {/* Tech grid */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              Browse the library
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold">
              Twelve stacks. One learning loop.
            </h2>
          </div>
          <Link
            to="/quiz"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <ListChecks className="size-4" /> See all quizzes <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TECHS.map((tech, i) => (
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
            >
              <Link
                to={`/lessons?tag=${tech.id}`}
                className={cn(
                  "group relative block glass-card p-5 overflow-hidden transition-all",
                  "hover:bg-[hsl(var(--quiz-cyan)/0.04)]"
                )}
              >
                {/* Decorative gradient ring */}
                <div
                  className={cn(
                    "absolute -top-12 -right-12 size-32 rounded-full bg-gradient-to-br opacity-30 blur-2xl transition-opacity group-hover:opacity-60",
                    tech.ringClass
                  )}
                />
                <div className="relative space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="size-10 rounded-xl border border-[hsl(var(--quiz-cyan)/0.3)] bg-[hsl(var(--quiz-cyan)/0.08)] flex items-center justify-center">
                      <tech.icon className={cn("size-5", tech.accentClass)} />
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                      {tech.family}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {tech.blurb}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>
                        <span className="font-semibold text-foreground/80">{tech.lessons}</span> lessons
                      </span>
                      <span>
                        <span className={cn("font-semibold", tech.accentClass)}>{tech.quizzes}</span>{" "}
                        quizzes
                      </span>
                    </div>
                    <ArrowRight
                      className={cn(
                        "size-4 transition-transform group-hover:translate-x-1",
                        tech.accentClass
                      )}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="glass-card-strong p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-1 space-y-2">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            How it threads together
          </div>
          <h3 className="text-2xl font-semibold">
            From card to quiz in three clicks.
          </h3>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { n: "01", t: "Open a card", d: "Pick the stack that caught your eye." },
            { n: "02", t: "Read the lessons", d: "Curated streams, tagged canon." },
            { n: "03", t: "Take the quiz", d: "Same tags, time-bound, scored live." },
          ].map((step) => (
            <div
              key={step.n}
              className="glass-panel p-4 space-y-1.5 hover:glass-card transition-all"
            >
              <div className="text-[11px] font-mono quiz-cyan-text">{step.n}</div>
              <div className="font-semibold text-sm">{step.t}</div>
              <div className="text-xs text-muted-foreground">{step.d}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
