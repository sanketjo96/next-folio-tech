import React from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { ArrowUpRight, Mic } from "lucide-react";
import { BEYOND_PHOTO } from "@/lib/data/profile";
import { ARTIST } from "@/lib/data/artist";
import { trackAttrs } from "@/lib/analytics";
import { seenAttrs } from "@/lib/analytics";

export default function Beyond() {
  const { t } = useTranslation("home");
  return (
    <section className="container mt-32 max-w-6xl" {...seenAttrs("Home: Beyond the keyboard")}>
      <div className="grid items-center gap-10 border-t pt-16 md:grid-cols-[1.1fr_1fr] md:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-md border">
          <Image
            src={BEYOND_PHOTO}
            alt="Sanket Joshi performing stand-up"
            fill
            sizes="(min-width: 768px) 560px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          <p className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 font-medium text-[11px] backdrop-blur">
            <Mic className="size-3.5 text-brand" /> {ARTIST.handle}
          </p>
        </div>

        <div>
          <p className="eyebrow">07 / {t("beyondEyebrow")}</p>
          <h2 className="mt-5 text-5xl leading-[0.95] sm:text-6xl">
            {t("beyondTitle1")}
            <br />
            {t("beyondTitle2")}
            <span className="text-brand">.</span>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-foreground/75">
            {t("beyondBody")}
          </p>
          {/* Full page load: the artist page renders without the tech-site layout. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/artist" className="link-mono mt-8" {...trackAttrs("Tech: Artist side link", { place: "home" })}>
            {t("beyondCta")} <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
