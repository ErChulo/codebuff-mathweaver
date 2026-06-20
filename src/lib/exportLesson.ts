import type { Lesson } from "./db";
import { downloadLessonAsJson } from "./lessonIO";

/**
 * Convenience wrapper around the generic download function for the editor.
 */
export function saveAsLessonJson(lesson: Lesson) {
  downloadLessonAsJson(lesson);
}
