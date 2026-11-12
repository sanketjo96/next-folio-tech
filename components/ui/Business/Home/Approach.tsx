import React from "react";
import { useTranslation } from "next-i18next";
import { SHORT_VERSION } from "@/lib/data/profile";
import { STATS } from "@/lib/data/experience";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";
import { Paragraphs } from "./Paragraphs";
import { seenAttrs } from "@/lib/analytics";

export default function Approach() {
  const { t } = useTranslation("home");
  return (
    <section className="container mt-32 max-w-6xl" id="about" {...seenAttrs("Home: About")}>
      <SectionHeading index="01" label={t("approachEyebrow")} />

      <div className="grid gap-10 pt-12 md:grid-cols-2 md:gap-16">
        <h2 className="text-[2.6rem] leading-[0.95] sm:text-6xl lg:text-7xl">
          {t("approachTitle1")}
          <br />
          <span className="text-muted-foreground">{t("approachTitle2")}</span>
        </h2>

        <div className="space-y-6">
          <div className="space-y-4 leading-relaxed text-foreground/75">
            <Paragraphs text={t("intro")} />
          </div>
          <div className="border-l-2 border-brand/50 pl-4 font-medium text-xs leading-6">
            <p className="text-muted-foreground">{"// "}{t("shortVersion")}</p>
            <p className="text-foreground/90">{SHORT_VERSION}</p>
          </div>
        </div>
      </div>

      <dl className="mt-16 grid grid-cols-2 border-y md:grid-cols-4">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={cn(
              "py-7 pr-4",
              i % 2 === 1 && "border-l pl-5", // second column on phones
              i > 0 && "md:border-l md:pl-6", // every column after the first on desktop
              i >= 2 && "border-t md:border-t-0" // second row on phones
            )}
          >
            <dt className="sr-only">{stat.label}</dt>
            <dd className="font-display text-5xl font-bold leading-none sm:text-6xl">
              {stat.value}
            </dd>
            <dd className="mt-3 font-medium text-[11px] text-muted-foreground">{stat.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
