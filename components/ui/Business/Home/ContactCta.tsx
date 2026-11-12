import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { ArrowUpRight, SquareTerminal } from "lucide-react";
import { seenAttrs } from "@/lib/analytics";

export default function ContactCta() {
  const { t } = useTranslation("home");
  return (
    <section className="container mt-36 max-w-6xl text-center" {...seenAttrs("Home: Contact")}>
      <span className="mx-auto grid size-14 place-items-center rounded-lg border border-brand/30 bg-brand/10 text-brand">
        <SquareTerminal className="size-6" />
      </span>
      <p className="eyebrow mt-6">{t("contactEyebrow")}</p>
      <h2 className="mt-5 text-5xl leading-[0.95] sm:text-7xl">
        {t("contactTitle1")}
        <br />
        <span className="text-muted-foreground">{t("contactTitle2")}</span>
      </h2>
      <p className="mx-auto mt-6 max-w-md leading-relaxed text-foreground/75">
        {t("contactBody")}
      </p>
      <Link
        href="/contacts"
        className="mt-9 inline-flex h-12 items-center gap-3 rounded-md bg-brand px-6 text-sm font-medium text-brand-foreground transition-transform hover:-translate-y-0.5"
      >
        {t("ctaContact")} <ArrowUpRight className="size-4" />
      </Link>
    </section>
  );
}
