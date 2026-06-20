import { Link, useNavigate, useParams } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import db, { type Block, type Lesson } from "@/lib/db";
import BlockRenderer from "@/components/BlockRenderer";
import NotesPanel from "@/components/NotesPanel";
import { ArrowLeft, Download, Edit3, Loader2 } from "lucide-react";
import { downloadLessonAsJson } from "@/lib/lessonIO";

export default function LessonView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lesson = useLiveQuery(
    () => (id ? db.lessons.get(id) : Promise.resolve(undefined)),
    [id]
  ) as Lesson | undefined | null;

  if (lesson === undefined) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
        <Loader2 className="size-4 animate-spin" /> Loading lesson…
      </div>
    );
  }

  if (lesson === null) {
    return (
      <div className="glass-card p-10 text-center max-w-lg mx-auto">
        <p className="text-muted-foreground mb-4">This lesson could not be found.</p>
        <button
          onClick={() => navigate("/lessons")}
          className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm"
        >
          Back to lessons
        </button>
      </div>
    );
  }

  return (
    <article className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/lessons"
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ArrowLeft className="size-3" /> All lessons
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadLessonAsJson(lesson)}
            className="px-3 py-1.5 rounded-md glass-panel text-xs flex items-center gap-1"
          >
            <Download className="size-3" /> Download JSON
          </button>
          <Link
            to={`/lessons/${lesson.id}/edit`}
            className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1"
          >
            <Edit3 className="size-3" /> Edit
          </Link>
        </div>
      </div>

      <header className="glass-card-strong p-8 space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight glow-text">
          {lesson.title}
        </h1>
        {lesson.description && (
          <p className="text-muted-foreground leading-relaxed">
            {lesson.description}
          </p>
        )}
        <div className="text-xs text-muted-foreground pt-2 border-t border-white/10">
          {lesson.blocks.length} blocks · last edited{" "}
          {new Date(lesson.updatedAt).toLocaleString()}
        </div>
      </header>

      <div className="space-y-5">
        {lesson.blocks.map((b) => (
          <BlockRenderer key={b.id} block={b} />
        ))}
      </div>

      <NotesPanel lessonId={lesson.id} />
    </article>
  );
}
