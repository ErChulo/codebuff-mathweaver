// Import/export helpers for lesson data (JSON).
// `downloadLessonAsJson` and `readLessonJson` are wired into Lessons,
// LessonView, and Sample pages.
import type { Lesson } from "./db";

/**
 * Trigger a browser download of the lesson (or array of lessons) as JSON.
 */
export function downloadLessonAsJson(
  input: Lesson | Lesson[],
  filename?: string
): void {
  const data = Array.isArray(input) ? input : [input];
  const safe = data.map((l) => ({
    ...l,
    blocks: l.blocks.map((b) => ({ ...b })),
  }));
  const blob = new Blob([JSON.stringify(safe, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename ?? `${safe[0]?.title?.replace(/\s+/g, "_") ?? "lesson"}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Read a JSON file uploaded by the user and validate its shape.
 * Accepts either a single lesson or an array of lessons.
 */
export async function readLessonJson(file: File): Promise<Lesson[]> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const list = Array.isArray(parsed) ? parsed : [parsed];
  for (const lesson of list) {
    if (
      typeof lesson !== "object" ||
      lesson === null ||
      typeof lesson.title !== "string" ||
      !Array.isArray(lesson.blocks)
    ) {
      throw new Error("Invalid lesson JSON: expected { title, blocks: [...] }");
    }
    for (const block of lesson.blocks) {
      if (typeof block.type !== "string" || typeof block.content !== "string") {
        throw new Error("Invalid block shape: each block needs `type` and `content`.");
      }
    }
  }
  return list;
}
