"use client";

/**
 * Renders prompt text with **bold** markdown displayed as <strong>.
 * Preserves newlines via whitespace-pre-wrap.
 */
export function PromptDisplay({
  text,
  className = "whitespace-pre-wrap text-neutral-900",
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(/(\*\*[^*]*\*\*)/g);
  return (
    <p className={className}>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        )
      )}
    </p>
  );
}
