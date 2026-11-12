import React from "react";
import { useTranslation } from "next-i18next";
import { SectionHeading } from "./SectionHeading";
import { Paragraphs } from "./Paragraphs";
import { seenAttrs } from "@/lib/analytics";

/** Topics are proper nouns, so they stay untranslated. */
const TOPICS = [
  "Generative AI",
  "LLM-powered applications",
  "Retrieval-Augmented Generation",
  "Agentic AI",
  "System architecture",
  "Engineering leadership",
];

export default function Exploring() {
  const { t } = useTranslation("home");
  return (
    <section className="container mt-32 max-w-6xl" id="exploring" {...seenAttrs("Home: Exploring")}>
      <SectionHeading index="05" label={t("exploringEyebrow")} />

      <div className="grid gap-10 pt-12 md:grid-cols-2 md:gap-16">
        <h2 className="text-[2.6rem] leading-[0.95] sm:text-6xl">
          {t("exploringTitle1")}
          <br />
          <span className="text-muted-foreground">{t("exploringTitle2")}</span>
        </h2>

        <div className="space-y-6">
          <div className="space-y-4 leading-relaxed text-foreground/75">
            <Paragraphs text={t("exploringBody")} />
          </div>
          <ul className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <li
                key={topic}
                className="rounded border px-2.5 py-1 font-medium text-[11px] text-muted-foreground"
              >
                {topic}
              </li>
            ))}
          </ul>
          <p className="border-l-2 border-brand/50 pl-4 font-medium text-sm leading-relaxed text-foreground/90">
            {t("exploringNote")}
          </p>
        </div>
      </div>
    </section>
  );
}
