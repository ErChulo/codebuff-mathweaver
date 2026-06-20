import Dexie, { type EntityTable } from "dexie";

// =====================================================
// Type definitions for the data model.
// =====================================================

export type BlockType =
  | "html"
  | "katex"
  | "mermaid"
  | "jsxgraph"
  | "arquero"
  | "plotly"
  | "mathbox"
  | "mathlive"
  | "manim"
  | "geogebra"
  | "grid";

export interface Block {
  id: string;
  type: BlockType;
  /** Main source string for the block (HTML, KaTeX, Mermaid, JSXGraph-like config, Arquero JS, Plotly JSON spec, MathBox JS, MathLive LaTeX, or Markdown description for Manim). */
  content: string;
  /** Optional per-block settings (e.g. Plotly layout override or caption). */
  settings?: Record<string, unknown>;
}

export interface GridCell {
  id: string;
  blocks: Block[];
}

export interface QuizOption {
  id: string;
  label: string;
  isCorrect?: boolean;
  /** Optional explanation. */
  explanation?: string;
}

export interface QuizQuestion {
  id: string;
  /** Question text (also rendered as HTML). */
  prompt: string;
  /** Optional descriptive block(s) above the prompt. */
  blocks?: Block[];
  options: QuizOption[];
  /** Index of the correct option. */
  correctIndex: number;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  blocks: Block[];
  createdAt: number;
  updatedAt: number;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  /** Optional reference to a related lesson. */
  lessonId?: string;
  questions: QuizQuestion[];
  createdAt: number;
  updatedAt: number;
}

export interface Score {
  id: string;
  quizId: string;
  quizTitle: string;
  lessonName: string;
  /** Total quiz score as an integer 0..100 (percent). */
  score: number;
  /** Number of correctly answered questions. */
  correctCount: number;
  /** Total number of questions. */
  totalCount: number;
  /** ISO date string when the quiz was completed. */
  completedAt: string;
}

/**
 * A Markdown + LaTeX notebook note attached to a lesson.
 * Keyed by lessonId so there\'s a single note per lesson.
 */
export interface Note {
  lessonId: string;
  /** Raw markdown source — rendered live with KaTeX math splices. */
  content: string;
  updatedAt: number;
}

// =====================================================
// Dexie database — IndexedDB persistence layer.
// =====================================================

const db = new Dexie("MathWeaverDB") as Dexie & {
  lessons: EntityTable<Lesson, "id">;
  quizzes: EntityTable<Quiz, "id">;
  scores: EntityTable<Score, "id">;
  notes: EntityTable<Note, "lessonId">;
};

// Original schema (v1).
db.version(1).stores({
  lessons: "id, title, updatedAt",
  quizzes: "id, title, updatedAt",
  scores: "id, quizId, completedAt",
});

// v2 — adds the per-lesson notes table.
db.version(2).stores({
  lessons: "id, title, updatedAt",
  quizzes: "id, title, updatedAt",
  scores: "id, quizId, completedAt",
  notes: "lessonId, updatedAt",
});

export default db;

// =====================================================
// Convenience mutation helpers.
// =====================================================

const genId = (prefix = "id"): string =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export const createLesson = async (
  partial: Pick<Lesson, "title"> & Partial<Lesson>
): Promise<string> => {
  const id = partial.id ?? genId("lesson");
  const now = Date.now();
  const lesson: Lesson = {
    id,
    title: partial.title,
    description: partial.description,
    blocks: partial.blocks ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: now,
  };
  await db.lessons.put(lesson);
  return id;
};

export const updateLesson = async (lesson: Lesson): Promise<void> => {
  await db.lessons.put({ ...lesson, updatedAt: Date.now() });
};

export const deleteLesson = async (id: string): Promise<void> => {
  await db.lessons.delete(id);
};

export const createQuiz = async (
  partial: Pick<Quiz, "title"> & Partial<Quiz>
): Promise<string> => {
  const id = partial.id ?? genId("quiz");
  const now = Date.now();
  const quiz: Quiz = {
    id,
    title: partial.title,
    description: partial.description,
    lessonId: partial.lessonId,
    questions: partial.questions ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: now,
  };
  await db.quizzes.put(quiz);
  return id;
};

export const updateQuiz = async (quiz: Quiz): Promise<void> => {
  await db.quizzes.put({ ...quiz, updatedAt: Date.now() });
};

export const deleteQuiz = async (id: string): Promise<void> => {
  await db.quizzes.delete(id);
  await db.scores.where("quizId").equals(id).delete();
};

export const recordScore = async (
  partial: Omit<Score, "id" | "completedAt"> & { completedAt?: string }
): Promise<string> => {
  const id = genId("score");
  const score: Score = {
    id,
    quizId: partial.quizId,
    quizTitle: partial.quizTitle,
    lessonName: partial.lessonName,
    score: partial.score,
    correctCount: partial.correctCount,
    totalCount: partial.totalCount,
    completedAt: partial.completedAt ?? new Date().toISOString(),
  };
  await db.scores.put(score);
  return id;
};

export const deleteScore = async (id: string): Promise<void> => {
  await db.scores.delete(id);
};

// ---- Notes helpers ----

export const getNote = async (lessonId: string): Promise<Note | undefined> => {
  return db.notes.get(lessonId);
};

export const upsertNote = async (
  lessonId: string,
  content: string
): Promise<void> => {
  await db.notes.put({ lessonId, content, updatedAt: Date.now() });
};

export const deleteNote = async (lessonId: string): Promise<void> => {
  await db.notes.delete(lessonId);
};
