import { Toaster } from "@/components/ui/sonner";
import { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { ThemeProvider } from "@/hooks/useTheme";
import "./index.css";
import "./types/global.d.ts";

// Landing ships synchronously in the main entry chunk — a cold load must
// never depend on resolving a dynamic-import chunk (that's the prior
// "Build Error" surface when the lazy fetch fails).
import Landing from "./pages/Landing";

// Lazy load the remaining route components for code-splitting.
const Lessons = lazy(() => import("./pages/Lessons.tsx"));
const LessonView = lazy(() => import("./pages/LessonView.tsx"));
const LessonEditor = lazy(() => import("./pages/LessonEditor.tsx"));
const QuizList = lazy(() => import("./pages/QuizList.tsx"));
const QuizRunner = lazy(() => import("./pages/QuizRunner.tsx"));
const QuizEditor = lazy(() => import("./pages/QuizEditor.tsx"));
const AuthoringGuide = lazy(() => import("./pages/AuthoringGuide.tsx"));
const Technologies = lazy(() => import("./pages/Technologies.tsx"));
const QuizResults = lazy(() => import("./pages/QuizResults.tsx"));
const Sample = lazy(() => import("./pages/Sample.tsx"));
const GeoGebra = lazy(() => import("./pages/GeoGebra.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const AppLayout = lazy(() => import("./components/AppLayout.tsx"));


const RouteLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Loading…</div>
  </div>
);

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*"
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

// Hoist ThemeProvider above the router so routes outside AppLayout
// (Landing, NotFound) share the same theme context.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <RouteSyncer />
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route element={<AppLayout />}>
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/lessons/new" element={<LessonEditor mode="create" />} />
              <Route path="/lessons/:id" element={<LessonView />} />
              <Route path="/lessons/:id/edit" element={<LessonEditor mode="edit" />} />
              <Route path="/quiz" element={<QuizList />} />
              <Route path="/quiz/new" element={<QuizEditor mode="create" />} />
              <Route path="/quiz/:id" element={<QuizRunner />} />
              <Route path="/quiz/:id/edit" element={<QuizEditor mode="edit" />} />
              <Route path="/results" element={<QuizResults />} />
              <Route path="/authoring" element={<AuthoringGuide />} />
              <Route path="/sample" element={<Sample />} />
              <Route path="/geogebra" element={<GeoGebra />} />
              <Route path="/technologies" element={<Technologies />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
