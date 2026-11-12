import React from "react";

type Props = {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
};

export const PageHeader = ({ eyebrow, title, children }: Props) => (
  <header className="pb-12 pt-14 md:pt-20">
    {eyebrow && <p className="eyebrow reveal border-b pb-5">{eyebrow}</p>}
    <h1
      className="reveal mt-8 text-6xl leading-[0.95] sm:text-7xl"
      style={{ "--i": 1 } as React.CSSProperties}
    >
      {title}
      <span className="text-brand">.</span>
    </h1>
    {children && (
      <div
        className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
        style={{ "--i": 2 } as React.CSSProperties}
      >
        {children}
      </div>
    )}
  </header>
);
