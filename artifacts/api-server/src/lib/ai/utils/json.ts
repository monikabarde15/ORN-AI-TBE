/**
 * Extracts a JSON object from an LLM response.
 *
 * Supports:
 * - Plain JSON
 * - ```json ... ```
 * - Extra text before/after JSON
 */
export function extractJson<T = unknown>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {}

  const fenced = text.match(/```json\s*([\s\S]*?)```/i);

  if (fenced?.[1]) {
    return JSON.parse(fenced[1]) as T;
  }

  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");

  if (first >= 0 && last > first) {
    return JSON.parse(
      text.slice(first, last + 1),
    ) as T;
  }

  throw new Error("Unable to parse JSON from AI response.");
}