import React from "react";
import { SkillMetricMap } from "@/content/skills/mock";
import { useTranslation } from "next-i18next";
import { cn } from "@/lib/utils";

const MAX_LEVEL = 5;

const SkillLevel = ({ level }: { level: number }) => (
  <div className="flex gap-1" aria-hidden>
    {Array.from({ length: MAX_LEVEL }, (_, i) => (
      <span
        key={i}
        className={cn(
          "h-1.5 flex-1 rounded-full",
          i < level
            ? "bg-gradient-to-r from-brand to-brand-2"
            : "bg-muted"
        )}
      />
    ))}
  </div>
);

function SkillMetric() {
  const { t } = useTranslation("home");
  return (
    <section className="mt-20" data-tour="home-skills">
      <SectionHeading eyebrow="01" title={t("techAndSkills")} />
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {SkillMetricMap.map((item, i) => (
          <li
            key={item.name}
            className="surface surface-hover reveal p-4"
            style={{ "--i": i } as React.CSSProperties}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-display font-semibold">{item.name}</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {item.level}/{MAX_LEVEL}
              </span>
            </div>
            <div className="mt-3">
              <SkillLevel level={item.level} />
            </div>
            <span className="sr-only">
              {item.level} out of {MAX_LEVEL}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const SectionHeading = ({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) => (
  <div className="flex items-end justify-between gap-4">
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{title}</h2>
    </div>
    {action}
  </div>
);

export default SkillMetric;
