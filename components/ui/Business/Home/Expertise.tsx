import React from "react";
import { useTranslation } from "next-i18next";
import { EXPERTISE } from "@/lib/data/profile";
import { SectionHeading, style } from "./SectionHeading";
import { Paragraphs } from "./Paragraphs";
import { seenAttrs } from "@/lib/analytics";

export default function Expertise() {
  const { t } = useTranslation("home");
  return (
    <section
      className="container mt-32 max-w-6xl"
      id="expertise"
      data-tour="home-skills"
      {...seenAttrs("Home: Expertise")}
    >
      <SectionHeading index="02" label={t("expertiseEyebrow")} title={t("expertiseTitle")} />
      <div className="mt-6 max-w-2xl space-y-4 leading-relaxed text-foreground/75">
        <Paragraphs text={t("expertiseIntro")} />
      </div>

      <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {EXPERTISE.map((group, i) => (
          <div
            key={group.key}
            className="reveal border-t pt-6"
            style={style(i)}
          >
            <h3 className="eyebrow">{t(group.key)}</h3>
            <ul className="mt-4 space-y-2 font-medium text-sm text-foreground/85">
              {group.items.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-brand" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
