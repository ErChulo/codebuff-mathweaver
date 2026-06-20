import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import {
  BookOpen,
  Compass,
  Edit3,
  Globe,
  GraduationCap,
  Home,
  ListChecks,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";

const NAV = [
  { to: "/lessons", label: "Lessons", icon: BookOpen },
  { to: "/quiz", label: "Quizzes", icon: ListChecks },
  { to: "/results", label: "Scores", icon: GraduationCap },
  { to: "/sample", label: "Sample", icon: Sparkles },
  { to: "/authoring", label: "Authoring", icon: Edit3 },
  { to: "/geogebra", label: "GeoGebra", icon: Globe },
  { to: "/technologies", label: "Technologies", icon: Compass },
] as const;

export default function AppLayout() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-aurora">
        <aside className="hidden md:flex flex-col w-64 shrink-0 p-4 gap-4 sticky top-0 h-screen">
          <Link
            to="/"
            className="glass-card p-4 flex items-center gap-3 hover:scale-[1.01] transition-transform"
          >
            <div className="size-9 rounded-xl overflow-hidden flex items-center justify-center bg-primary/15 glow-ring">
              <span className="text-xs font-bold tracking-tight text-primary">MW</span>
            </div>
            <div>
              <div className="font-semibold text-sm">Math Weaver</div>
              <div className="text-xs text-muted-foreground">Personal studio</div>
            </div>
          </Link>

          <nav className="glass-card-strong p-2 flex-1 flex flex-col gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )
                }
              >
                <item.icon className="size-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}

            <div className="mt-auto flex flex-col gap-1">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors w-full text-left"
              >
                <Home className="size-4" />
                <span>Landing</span>
              </button>
              <button
                onClick={toggle}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors w-full text-left"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="size-4" />
                    <span>Light mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="size-4" />
                    <span>Dark mode</span>
                  </>
                )}
              </button>
            </div>
          </nav>

          <div className="glass-panel p-3 text-[11px] text-muted-foreground leading-relaxed">
            <div className="font-medium text-foreground/80 mb-1">100% offline</div>
            Lessons are stored in your browser via IndexedDB. Export anytime as JSON.
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="md:hidden glass-panel p-3 flex items-center justify-between sticky top-0 z-30 m-3">
            <Link to="/" className="font-semibold text-sm">
              Math Weaver
            </Link>
            <div className="flex items-center gap-2">
              {NAV.slice(0, 3).map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "p-2 rounded-md text-xs",
                      isActive ? "bg-primary/20" : "text-muted-foreground"
                    )
                  }
                  aria-label={item.label}
                >
                  <item.icon className="size-4" />
                </NavLink>
              ))}
              <button
                onClick={toggle}
                className="p-2 rounded-md text-muted-foreground"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
            </div>
          </div>

          <div className="p-6 md:p-10 max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
  );
}
