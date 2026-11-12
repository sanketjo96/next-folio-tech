import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTranslation } from "next-i18next";
import { ArrowUpRight } from "lucide-react";
import socialMediaLinks from "../SocialIcons";
import { HERO_PORTRAIT, CURRENTLY_INTO } from "@/lib/data/profile";
import { style } from "./SectionHeading";

export default function Hero() {
  const { t } = useTranslation("home");
  const connect = socialMediaLinks.filter((l) => l.name !== "Instagram");

  return (
    <section className="container max-w-6xl" data-tour="home-intro">
      <div className="frame-corners relative isolate flex min-h-[calc(100svh-6.5rem)] flex-col border border-border/70">
        <span className="frame-corner-b" aria-hidden />
        <div className="dot-grid absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_at_30%_50%,#000_20%,transparent_70%)]" />

        {/* Top corners */}
        <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
          <p className="eyebrow flex items-center gap-2 text-foreground/80">
            <span className="size-1.5 rounded-full bg-brand" aria-hidden />
            {t("heroTopLeft")}
          </p>
          <p className="eyebrow hidden text-right sm:block">{t("heroTopRight")}</p>
        </div>

        {/* Name + portrait, side by side */}
        <div className="grid flex-1 items-center gap-10 px-5 py-8 sm:px-8 md:grid-cols-[1.25fr_1fr] md:gap-12 md:px-10 lg:px-14">
          <div>
            <p className="eyebrow reveal">{t("heroEyebrow")}</p>
            <h1
              className="reveal mt-5 text-[clamp(3.25rem,8vw,6.5rem)] font-extrabold leading-[0.95] tracking-tight"
              style={style(1)}
            >
              Sanket
              <br />
              <span className="text-foreground/55">Joshi</span>
              <span className="text-brand">.</span>
            </h1>
            <p
              className="reveal mt-7 max-w-md text-base leading-relaxed text-foreground/80"
              style={style(2)}
            >
              {t("heroLine")}
            </p>
            <div className="reveal mt-8 flex flex-wrap gap-3" style={style(3)}>
              <Link
                href="/projects"
                className="inline-flex h-12 items-center gap-3 rounded-md bg-brand px-5 text-sm font-medium text-brand-foreground transition-transform hover:-translate-y-0.5"
              >
                {t("ctaWork")} <ArrowUpRight className="size-4" />
              </Link>
              <Link
                href="/posts"
                className="inline-flex h-12 items-center gap-3 rounded-md border border-foreground/25 px-5 text-sm font-medium transition-colors hover:border-foreground/60"
              >
                {t("ctaWriting")} <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Portrait panel */}
          <figure className="reveal relative mx-auto w-full max-w-[22rem]" style={style(2)}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-md border bg-gradient-to-b from-brand/25 via-card to-card">
              <div className="dot-grid absolute inset-0 opacity-40" />
              <div className="absolute left-1/2 top-1/3 size-56 -translate-x-1/2 rounded-full bg-brand/30 blur-3xl" />
              <Image
                src={HERO_PORTRAIT}
                alt="Sanket Joshi"
                priority
                sizes="(min-width: 768px) 352px, 90vw"
                className="absolute inset-x-0 bottom-0 mx-auto h-[92%] w-auto object-contain object-bottom"
              />
            </div>
            <figcaption className="mt-3 flex items-center justify-between font-medium text-[11px] text-muted-foreground">
              <span>sanket.jpg</span>
              <span>Pune, IN · Remote</span>
            </figcaption>
          </figure>
        </div>

        {/* Bottom corners */}
        <div className="flex items-end justify-between gap-6 p-4 sm:p-5">
          <div>
            <p className="eyebrow mb-3">{t("connect")}</p>
            <ul className="space-y-1.5">
              {connect.map((l) => (
                <li key={l.id}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="link-mono">
                    {l.name} <ArrowUpRight className="size-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-right">
            <p className="eyebrow mb-3">{t("currentlyInto")}</p>
            <ul className="space-y-1.5 font-medium text-xs text-foreground/80">
              {CURRENTLY_INTO.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
