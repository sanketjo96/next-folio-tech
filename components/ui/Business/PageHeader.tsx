import React from "react";

type Props = {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
};

export const PageHeader = ({ eyebrow, title, children }: Props) => (
  <header className="pb-10 pt-14 md:pt-20">
    {eyebrow && <p className="eyebrow reveal">{eyebrow}</p>}
    <h1
      className="reveal mt-3 text-4xl font-bold sm:text-5xl"
      style={{ "--i": 1 } as React.CSSProperties}
    >
      {title}
    </h1>
    {children && (
      <div
        className="reveal mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground"
        style={{ "--i": 2 } as React.CSSProperties}
      >
        {children}
      </div>
    )}
  </header>
);
