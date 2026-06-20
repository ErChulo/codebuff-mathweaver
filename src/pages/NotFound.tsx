import { motion } from "framer-motion";
import { Link } from "react-router";
import { Compass, Home, ListChecks, Sparkles, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-aurora relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 size-[36rem] rounded-full bg-[hsl(var(--quiz-cyan)/0.18)] blur-3xl" />
        <div className="absolute bottom-0 right-0 size-[28rem] rounded-full bg-[hsl(var(--quiz-magenta)/0.18)] blur-3xl" />
      </div>

      <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <Sparkles className="size-3 quiz-cyan-text" />
            Off the syllabus
          </div>

          <h1 className="relative">
            <span className="block text-7xl md:text-9xl font-bold tracking-tighter bg-gradient-to-br from-[hsl(var(--quiz-cyan))] via-[hsl(var(--quiz-magenta))] to-[hsl(var(--quiz-cyan))] bg-clip-text text-transparent">
              404
            </span>
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-foreground/90">
            This route hasn't been authored yet.
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
            The page you tried doesn't exist — but the learning loop is just a click away. Pick a
            thread to pull.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <Link
              to="/"
              className="group glass-card p-4 flex items-center gap-3 hover:bg-white/5 transition-all"
            >
              <div className="size-10 rounded-xl bg-primary/15 flex items-center justify-center glow-ring">
                <Home className="size-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-sm">Back to landing</div>
                <div className="text-xs text-muted-foreground">The mantra and studio entry.</div>
              </div>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 text-muted-foreground" />
            </Link>
            <Link
              to="/quiz"
              className="group glass-card p-4 flex items-center gap-3 hover:bg-[hsl(var(--quiz-cyan)/0.06)] transition-all quiz-glow-border"
            >
              <div className="size-10 rounded-xl bg-[hsl(var(--quiz-cyan)/0.15)] border border-[hsl(var(--quiz-cyan)/0.3)] flex items-center justify-center quiz-cyan-text">
                <ListChecks className="size-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-sm quiz-cyan-text">Browse quizzes</div>
                <div className="text-xs text-muted-foreground">A live index of what you've composed.</div>
              </div>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 quiz-cyan-text" />
            </Link>
            <Link
              to="/lessons"
              className="group glass-card p-4 flex items-center gap-3 hover:bg-white/5 transition-all"
            >
              <div className="size-10 rounded-xl bg-primary/15 flex items-center justify-center glow-ring">
                <Compass className="size-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-sm">Open lessons</div>
                <div className="text-xs text-muted-foreground">Read what's already in the canon.</div>
              </div>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 text-muted-foreground" />
            </Link>
            <Link
              to="/technologies"
              className="group glass-card p-4 flex items-center gap-3 hover:bg-[hsl(var(--quiz-magenta)/0.06)] transition-all"
            >
              <div className="size-10 rounded-xl bg-[hsl(var(--quiz-magenta)/0.15)] border border-[hsl(var(--quiz-magenta)/0.3)] flex items-center justify-center quiz-magenta-text">
                <Sparkles className="size-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-sm quiz-magenta-text">Technologies library</div>
                <div className="text-xs text-muted-foreground">Pick a stack to study.</div>
              </div>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 quiz-magenta-text" />
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="relative py-6 text-center text-xs text-muted-foreground">
        Math Weaver · Offline-first · IndexedDB
      </footer>
    </div>
  );
}
