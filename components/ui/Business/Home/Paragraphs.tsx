import React from "react";

/** Renders translated copy that uses blank lines ("\n\n") to separate paragraphs. */
export const Paragraphs = ({ text, className }: { text: string; className?: string }) => (
  <>
    {text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => (
        <p key={p} className={className}>
          {p}
        </p>
      ))}
  </>
);
