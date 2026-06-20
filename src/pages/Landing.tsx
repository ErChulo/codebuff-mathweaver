import { Link } from "react-router";
import {
  motion,
  useReducedMotion,
  type Variants,
  type MotionProps,
} from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Edit3,
  GraduationCap,
  ListChecks,
  Moon,
  Repeat,
  Sparkles,
  Sun,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MANTRA_LINES: string[][] = [
  [
    "Read what someone has already understood,",
    "until you can hear the rhythm beneath the prose.",
  ],
  [
    "Then take a quiz,",
    "not to prove you skimmed,",
    "but to prove the idea survived you.",
  ],
  [
    "Tag every lesson with the stack it belongs to,",
    "and every quiz inherits its ancestors.",
  ],
  [
    "Loop it:",
    "read → quiz → revise → quiz again.",
    "The signal sharpens each pass.",
  ],
  [
    "Math Weaver is the studio for that loop,",
    "working quietly, offline, on your machine.",
  ],
];

const TAG_STACK = [
  "Markdown",
  "KaTeX",
  "Mermaid",
  "Plotly",
  "JSXGraph",
  "Arquero",
  "MathLive",
  "GeoGebra",
] as const;

type Feature = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  to: string;
  cta: string;
  accent: "cyan" | "magenta" | "primary";
};

const FEATURES: Feature[] = [
  {
    icon: BookOpen,
    title: "Lessons you can compose",
    body: "Markdown, diagrams, live sandboxes, code runtimes — every block is a typed, reorderable, deletable atom.",
    to: "/lessons",
    cta: "Open lessons",
    accent: "primary",
  },
  {
    icon: ListChecks,
    title: "Quizzes that inherit",
    body: "Spin a quiz off a tagged lesson and it inherits the same canon. Five question types, theme-aware scoring.",
    to: "/quiz",
    cta: "Browse quizzes",
    accent: "cyan",
  },
  {
    icon: Compass,
    title: "A typed library",
    body: "Curated math tool stacks — KaTeX, Mermaid, Plotly, GeoGebra, and more — each linking lessons to their own quiz threads.",
    to: "/technologies",
    cta: "Explore library",
    accent: "magenta",
  },
  {
    icon: Edit3,
    title: "Authoring as a rhythm",
    body: "Every keystroke writes locally. Export as JSON, remix anyone else's corpus, reimport as a draft.",
    to: "/authoring",
    cta: "Read the guide",
    accent: "primary",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function makeContainer(delay: number): Variants {
  return {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      // Nest each group's first child, then stagger the rest.
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };
}

// Three sequenced reveals so the intro → mantra → CTAs cascade rather than
// firing in parallel. With each child at duration 0.42s and stagger 0.05s,
// a 5-child group finishes ~0.67s after it begins. Delays are set so each
// group's last child settles just before the next group starts — total
// reveal ~2.1s — so the CTAs land interactive around that mark.
const INTRO_DELAY = 0.02;
const MANTRA_DELAY = 0.75;
const CTAS_DELAY = 1.45;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.42, ease: EASE },
  },
};

interface FloatingPreviewProps
  extends Omit<MotionProps, "initial" | "animate" | "transition"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function FloatingPreview({
  children,
  className,
  delay = 0,
  ...rest
}: FloatingPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 0.92, y: 0 }}
      transition={{ delay, duration: 0.55, ease: EASE }}
      aria-hidden
      className={cn(
        "absolute glass-card-strong p-3.5 will-change-transform hidden xl:block",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

function HeroPreviews() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <FloatingPreview className="top-[16%] left-[5%] w-60 drift-a">
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Markdown
        </div>
        <div className="text-sm font-semibold mt-1.5"># The loop, distilled</div>
        <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
          Read → Quiz → Refine.
        </div>
        <div className="flex gap-1 mt-3">
          <span className="size-1.5 rounded-full bg-emerald-400/70" />
          <span className="size-1.5 rounded-full bg-amber-400/70" />
          <span className="size-1.5 rounded-full bg-rose-400/70" />
        </div>
      </FloatingPreview>

      <FloatingPreview className="top-[20%] right-[4%] w-56 drift-b" delay={0.08}>
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          KaTeX
        </div>
        <div className="text-base font-serif italic mt-1.5 glow-text">
          f(x) = ∫<sub>0</sub>
          <sup>π</sup> sin(t) dt
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-2">
          rendered inline · KaTeX
        </div>
      </FloatingPreview>

      <FloatingPreview
        className="bottom-[18%] right-[7%] w-64 drift-c"
        delay={0.14}
      >
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Quiz
        </div>
        <div className="text-sm font-medium mt-1.5">
          What does the loop prove?
        </div>
        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] px-2 py-0.5 rounded-md glass-panel uppercase tracking-[0.18em]">
            a · recall
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-primary/20 text-primary uppercase tracking-[0.18em]">
            b · signal
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-md glass-panel uppercase tracking-[0.18em]">
            c · drift
          </span>
        </div>
        <div className="mt-3 h-1 rounded-full bg-primary/25 overflow-hidden">
          <div className="h-full w-2/3 bg-primary rounded-full" />
        </div>
      </FloatingPreview>
    </div>
  );
}

export default function Landing() {
  const { theme, toggle } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  // Skip animation entirely under reduced-motion.
  const introContainer = prefersReducedMotion ? undefined : makeContainer(INTRO_DELAY);
  const mantraContainer = prefersReducedMotion ? undefined : makeContainer(MANTRA_DELAY);
  const ctasContainer = prefersReducedMotion ? undefined : makeContainer(CTAS_DELAY);
  const item = prefersReducedMotion ? undefined : itemVariants;

  return (
    <div className="relative min-h-screen bg-aurora overflow-hidden">
      {/* TOP BAR */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-6">
        <Link
          to="/"
          className="group flex items-center gap-2.5 text-sm font-medium"
        >
          <span className="size-8 rounded-xl overflow-hidden flex items-center justify-center bg-primary/15 glow-ring transition-colors">
            <span className="text-xs font-bold tracking-tight text-primary">MW</span>
          </span>
          <span>Math Weaver</span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.2em] text-muted-foreground glass-panel">
            v1 · Studio
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/lessons"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md glass-panel transition-colors"
          >
            Open studio
            <ArrowRight className="size-3.5" />
          </Link>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="size-9 rounded-md glass-panel flex items-center justify-center hover:bg-primary/15 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>
        </div>
      </header>

      {/* AMBIENT GLOWS — three, layered for depth. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute -top-40 left-1/2 -translate-x-1/2 size-[44rem] rounded-full blur-3xl opacity-50",
            theme === "dark" ? "bg-[#16243a]" : "bg-[#cfe6ff]",
          )}
        />
        <div
          className={cn(
            "absolute top-1/3 right-[-12rem] size-[36rem] rounded-full blur-3xl opacity-40",
            theme === "dark" ? "bg-[#1c1530]" : "bg-[#e7d8ff]",
          )}
        />
        <div
          className={cn(
            "absolute bottom-[-12rem] left-[-10rem] size-[32rem] rounded-full blur-3xl opacity-30",
            theme === "dark" ? "bg-[#0a1d2c]" : "bg-[#d4eaff]",
          )}
        />
      </div>

      {/* DECORATIVE FLOATING PREVIEWS */}
      <HeroPreviews />

      {/* MAIN HERO */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-12">
        {/* Intro: badge + headline + sub */}
        <motion.div
          className="w-full max-w-3xl text-center space-y-5"
          variants={introContainer}
          initial={prefersReducedMotion ? false : "hidden"}
          animate={prefersReducedMotion ? false : "show"}
        >
          <motion.div variants={item} className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.3em] glass-panel text-muted-foreground">
              <Sparkles className="size-3 quiz-cyan-text" />
              The composition loop
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-balance glow-text leading-[1.05]"
          >
            Weave what you've understood.
          </motion.h1>

          <motion.p
            variants={item}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed"
          >
            A personal studio for the read → quiz → refine loop. Markdown,
            KaTeX, live plots, and quizzes that inherit your tags — all stored
            in your browser, all offline.
          </motion.p>
        </motion.div>

        {/* Mantra block */}
        <motion.div
          variants={mantraContainer}
          initial={prefersReducedMotion ? false : "hidden"}
          animate={prefersReducedMotion ? false : "show"}
          className="mt-14 max-w-2xl mx-auto space-y-5 text-center"
        >
          <motion.div
            variants={item}
            className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground"
          >
            The mantra
          </motion.div>

          {MANTRA_LINES.map((verse, vIdx) => (
            <motion.div
              key={vIdx}
              variants={item}
              className={cn(
                "font-serif italic text-[1.05rem] md:text-[1.18rem] leading-relaxed glow-text",
                theme === "dark" ? "text-white/85" : "text-slate-800",
              )}
            >
              {verse.map((line, lIdx) => (
                <div key={lIdx} className="block">
                  {line}
                </div>
              ))}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA + trust strip */}
        <motion.div
          variants={ctasContainer}
          initial={prefersReducedMotion ? false : "hidden"}
          animate={prefersReducedMotion ? false : "show"}
          className="mt-16 flex flex-col items-center gap-5"
        >
          <motion.div variants={item} className="luminous-divider w-64" />

          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link
              to="/lessons"
              className="group px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 glow-ring"
            >
              <BookOpen className="size-4" />
              Open the studio
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/quiz"
              className="group px-5 py-3 rounded-xl glass-card-strong text-sm font-medium flex items-center gap-2 hover:bg-[hsl(var(--quiz-cyan)/0.08)] quiz-glow-border transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--quiz-cyan))] focus-visible:ring-offset-0"
            >
              <ListChecks className="size-4 quiz-cyan-text" />
              Take a quiz
              <ArrowRight className="size-4 quiz-cyan-text transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="flex flex-wrap items-center justify-center gap-1.5 max-w-2xl"
          >
            {TAG_STACK.map((tag, idx) => (
              <span
                key={tag}
                className={cn(
                  "text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-md glass-panel",
                  // Highlight one to hint at the active composition mode.
                  idx === 1 ? "quiz-cyan-text" : "text-muted-foreground",
                )}
              >
                {tag}
              </span>
            ))}
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/80 pl-2">
              · offline · IndexedDB · personal
            </span>
          </motion.div>
        </motion.div>
      </main>

      {/* FEATURES grid + loop diagram */}
      <section className="relative z-10 px-6 pb-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((feature, fIdx) => (
            <motion.div
              key={feature.title}
              data-feature
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={
                prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
              }
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.42, delay: fIdx * 0.05, ease: EASE }}
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              className={cn(
                "glass-card p-6 group relative overflow-hidden cursor-pointer focus-within:ring-2 focus-within:ring-primary/35",
                feature.accent === "cyan" &&
                  "hover:bg-[hsl(var(--quiz-cyan)/0.05)] quiz-glow-border",
                feature.accent === "magenta" &&
                  "hover:bg-[hsl(var(--quiz-magenta)/0.05)]",
                feature.accent === "primary" && "hover:bg-white/5",
              )}
            >
              <div
                className={cn(
                  "absolute -top-16 -right-16 size-40 rounded-full blur-2xl opacity-30 transition-opacity group-hover:opacity-60",
                  feature.accent === "cyan" && "bg-[hsl(var(--quiz-cyan))]",
                  feature.accent === "magenta" && "bg-[hsl(var(--quiz-magenta))]",
                  feature.accent === "primary" && "bg-primary",
                )}
              />
              <div className="relative space-y-3">
                <div
                  className={cn(
                    "size-10 rounded-xl flex items-center justify-center border transition-colors",
                    feature.accent === "cyan" &&
                      "bg-[hsl(var(--quiz-cyan)/0.12)] border-[hsl(var(--quiz-cyan)/0.3)] quiz-cyan-text",
                    feature.accent === "magenta" &&
                      "bg-[hsl(var(--quiz-magenta)/0.12)] border-[hsl(var(--quiz-magenta)/0.3)] quiz-magenta-text",
                    feature.accent === "primary" &&
                      "bg-primary/15 border-primary/30 text-primary",
                  )}
                >
                  <feature.icon className="size-5" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.body}
                </p>
                <Link
                  to={feature.to}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-medium pt-1 transition-colors",
                    feature.accent === "cyan" &&
                      "quiz-cyan-text hover:underline",
                    feature.accent === "magenta" &&
                      "quiz-magenta-text hover:underline",
                    feature.accent === "primary" && "text-primary hover:underline",
                  )}
                >
                  {feature.cta}
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loop diagram */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={
            prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.42, ease: EASE }}
          className="mt-10 glass-card-strong p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-4 quiz-glow-border"
        >
          <div className="flex-1 space-y-2 text-center md:text-left">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground inline-flex items-center gap-1.5">
              <Repeat className="size-3 quiz-cyan-text" /> The composition loop
            </div>
            <h3 className="text-xl md:text-2xl font-semibold">
              Four steps. One studio. Tag-aware the whole way through.
            </h3>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center">
            {[
              { label: "Compose", icon: Wand2, accent: "primary" as const },
              { label: "Read", icon: BookOpen, accent: "primary" as const },
              { label: "Quiz", icon: ListChecks, accent: "cyan" as const },
              {
                label: "Refine",
                icon: GraduationCap,
                accent: "magenta" as const,
              },
            ].map((step, idx, arr) => (
              <div key={step.label} className="flex items-center gap-2 md:gap-3">
                <div
                  className={cn(
                    "px-3 py-2 rounded-xl glass-panel flex items-center gap-2 text-xs font-medium",
                    step.accent === "cyan" && "quiz-cyan-text",
                    step.accent === "magenta" && "quiz-magenta-text",
                    step.accent === "primary" && "text-primary",
                  )}
                >
                  <step.icon className="size-3.5" />
                  {step.label}
                </div>
                {idx < arr.length - 1 && (
                  <ArrowRight className="size-3.5 text-muted-foreground/60" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <div className="relative z-10 pb-8 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
        Mantra ready
      </div>
    </div>
  );
}
