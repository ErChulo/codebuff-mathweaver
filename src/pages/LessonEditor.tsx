import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import db, { createLesson, updateLesson } from "@/lib/db";
import type { Block, Lesson } from "@/lib/db";
import BlockEditor from "@/components/BlockEditor";
import BlockRenderer from "@/components/BlockRenderer";
import TemplateMenu from "@/components/BlockTemplates";
import { TitleField, DescriptionField } from "@/components/TitleField";
import { saveAsLessonJson } from "@/lib/exportLesson";
import { ArrowLeft, Download, Eye, EyeOff, Save } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function LessonEditor({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const existing = useLiveQuery(
    () => (mode === "edit" && id ? db.lessons.get(id) : Promise.resolve(undefined)),
    [mode, id]
  ) as Lesson | undefined | null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [ready, setReady] = useState(mode === "create");
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !existing) return;
    if (!ready && existing) {
      setTitle(existing.title);
      setDescription(existing.description ?? "");
      setBlocks(existing.blocks);
      setReady(true);
    }
  }, [mode, existing, ready]);

  const isEmpty =
    !title.trim() && blocks.length === 0 && !description.trim();

  function persist(useExistingId: boolean) {
    if (!title.trim()) {
      toast.error("Please give your lesson a title.");
      return;
    }
    const now = Date.now();
    const id =
      (existing && useExistingId && existing.id) ||
      `lesson_${now}_${Math.random().toString(36).slice(2, 6)}`;
    const lesson: Lesson = {
      id,
      title: title.trim(),
      description: description.trim() || undefined,
      blocks,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    Promise.resolve(useExistingId && existing ? updateLesson(lesson) : createLesson(lesson))
      .then(() => {
        toast.success("Lesson saved.");
        navigate(`/lessons/${lesson.id}`);
      })
      .catch((e) => toast.error(String(e)));
  }

  function exportJson() {
    if (!title.trim()) {
      toast.error("Add a title before exporting.");
      return;
    }
    const id =
      existing?.id ??
      `lesson_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    saveAsLessonJson({
      id,
      title,
      description,
      blocks,
      createdAt: existing?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    });
  }

  if (mode === "edit" && existing === undefined) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
        Loading lesson…
      </div>
    );
  }

  if (mode === "edit" && existing === null) {
    return (
      <div className="glass-card p-10 text-center max-w-lg mx-auto">
        <p className="text-muted-foreground mb-4">That lesson was not found.</p>
        <Link to="/lessons" className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm">
          Back to lessons
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          to={mode === "edit" && existing ? `/lessons/${existing.id}` : "/lessons"}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ArrowLeft className="size-3" /> Back
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview((p) => !p)}
            className="px-3 py-1.5 rounded-md glass-panel text-xs flex items-center gap-1"
          >
            {preview ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
            {preview ? "Hide preview" : "Show preview"}
          </button>
          <button
            onClick={exportJson}
            className={cn(
              "px-3 py-1.5 rounded-md glass-panel text-xs flex items-center gap-1",
              isEmpty && "opacity-50"
            )}
          >
            <Download className="size-3" /> Export JSON
          </button>
          <button
            onClick={() => persist(true)}
            disabled={!title.trim()}
            className={cn(
              "px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs flex items-center gap-1",
              !title.trim() && "opacity-50"
            )}
          >
            <Save className="size-3" /> Save
          </button>
        </div>
      </div>

      <header className="space-y-2">
        <TitleField
          id="lesson-title"
          value={title}
          onChange={setTitle}
          placeholder="Lesson title (e.g. Refraction & Lenses)"
        />
        <DescriptionField
          id="lesson-description"
          value={description}
          onChange={setDescription}
          placeholder="Optional subtitle or short description."
        />
      </header>

      {blocks.length === 0 && (
        <div className="glass-card p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Start by inserting a template below. Each template pre-populates an
            example you can edit down to fit your lesson.
          </p>
          <TemplateMenu
            onPick={(b) => {
              setBlocks([b]);
            }}
          />
        </div>
      )}

      <BlockEditor blocks={blocks} onChange={setBlocks} />

      {preview && blocks.length > 0 && (
        <section className="space-y-3 pt-6 border-t border-white/10 max-w-6xl">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Full preview
          </div>
          <h2 className="text-2xl font-semibold">{title || "Untitled lesson"}</h2>
          {description && <p className="text-muted-foreground">{description}</p>}
          <div className="space-y-5">
            {blocks.map((b) => (
              <BlockRenderer key={b.id} block={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
