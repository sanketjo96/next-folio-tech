import React from "react";

type Props = {
  index: string;
  label: string;
  /** Optional big serif title; a trailing accent dot is added. */
  title?: string;
  action?: React.ReactNode;
};

/** "01 / THE APPROACH" rule, optionally followed by a large serif title. */
export const SectionHeading = ({ index, label, title, action }: Props) => (
  <div>
    <div className="flex items-center justify-between border-b pb-5">
      <p className="eyebrow">
        {index} / {label}
      </p>
      {!title && (
        <span className="font-mono text-brand" aria-hidden>
          +
        </span>
      )}
    </div>
    {title && (
      <div className="flex flex-wrap items-end justify-between gap-4 pt-8">
        <h2 className="text-5xl leading-[0.95] sm:text-6xl">
          {title}
          <span className="text-brand">.</span>
        </h2>
        {action}
      </div>
    )}
  </div>
);

export const style = (i: number) => ({ "--i": i }) as React.CSSProperties;
