import React from "react";
import { useTranslation } from "next-i18next";
import { ArrowUpRight } from "lucide-react";
import { CERTIFICATIONS, EDUCATION, EXPERIENCE, type Logo } from "@/lib/data/experience";
import { SectionHeading, style } from "./SectionHeading";
import { seenAttrs } from "@/lib/analytics";
import { PROFILE_LINKS } from "@/lib/seo";


const LOGO_HEIGHT = 22;

/**
 * The logo file is used as a mask, so it takes the text colour and works in
 * light and dark themes. Decorative: the company name follows as text.
 */
const CompanyLogo = ({ logo }: { logo: Logo }) => {
  const mask = `url(${logo.src}) left center / contain no-repeat`;
  return (
    <span
      aria-hidden
      className="mb-3 block bg-foreground/70"
      style={{
        height: LOGO_HEIGHT,
        width: Math.round((logo.width / logo.height) * LOGO_HEIGHT),
        mask,
        WebkitMask: mask,
      }}
    />
  );
};

export default function ExperienceTimeline() {
  const { t } = useTranslation("home");
  return (
    <section className="container mt-32 max-w-6xl" id="experience" {...seenAttrs("Home: Experience")}>
      <SectionHeading
        index="03"
        label={t("experienceEyebrow")}
        title={t("experienceTitle")}
        action={
          <a href={PROFILE_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="link-mono">
            {t("fullProfile")} <ArrowUpRight className="size-3.5" />
          </a>
        }
      />

      <ol className="mt-10 border-t">
        {EXPERIENCE.map((job, i) => (
          <li
            key={job.company}
            className="reveal grid gap-x-8 gap-y-4 border-b py-8 md:grid-cols-[11rem_1fr_9rem]"
            style={style(i)}
          >
            {/* Period(s) */}
            <div className="font-medium text-[11px] leading-6 text-muted-foreground">
              {job.current && (
                <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-2.5 py-0.5 text-brand">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-70 motion-reduce:hidden" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
                  </span>
                  {t("now")}
                </span>
              )}
              {job.roles.map((r) => (
                <p key={r.title}>{r.period}</p>
              ))}
            </div>

            {/* Company, roles, highlights */}
            <div>
              {job.logo && <CompanyLogo logo={job.logo} />}
              <h3 className="text-3xl leading-tight sm:text-[2.1rem]">{job.company}</h3>
              {job.context && (
                <p className="mt-1 text-sm text-muted-foreground">{job.context}</p>
              )}
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-medium text-xs text-foreground/85">
                {job.roles.map((r, ri) => (
                  <li key={r.title} className="flex items-center gap-2">
                    <span
                      className={"size-1.5 rounded-full " + (ri === 0 ? "bg-brand" : "bg-muted-foreground/50")}
                      aria-hidden
                    />
                    {r.title}
                  </li>
                ))}
              </ul>
              <ul className="mt-4 max-w-2xl space-y-2 text-sm leading-relaxed text-foreground/75">
                {job.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span className="mt-[0.6rem] h-px w-3 shrink-0 bg-muted-foreground/60" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <ul className="flex flex-wrap content-start gap-1.5 md:justify-end">
              {job.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded border px-2 py-0.5 font-medium text-[10px] text-muted-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {/* Education and certifications */}
      <div className="grid gap-10 border-b py-10 md:grid-cols-2">
        <div>
          <p className="eyebrow">{t("education")}</p>
          <ul className="mt-5 space-y-4">
            {EDUCATION.map((e) => (
              <li key={e.name} className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="font-display text-2xl font-semibold">{e.name}</p>
                  <p className="text-sm text-muted-foreground">{e.detail}</p>
                </div>
                <span className="shrink-0 font-medium text-[11px] text-muted-foreground">
                  {e.period}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">{t("certifications")}</p>
          <ul className="mt-5 space-y-2.5">
            {CERTIFICATIONS.map((c) => (
              <li key={c} className="flex items-center gap-3 text-sm text-foreground/85">
                <span className="size-1.5 rounded-full bg-brand" aria-hidden />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
