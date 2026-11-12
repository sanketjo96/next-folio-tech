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

        {/* Backdrop: dot grid, warm glow, portrait */}
        <div className="dot-grid absolute inset-0 -z-20 opacity-60 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
        <div className="absolute left-1/2 top-1/3 -z-20 size-[520px] max-w-full -translate-x-1/2 rounded-full bg-brand/15 blur-[100px]" />
        <Image
          src={HERO_PORTRAIT}
          alt=""
          priority
          sizes="(min-width: 768px) 520px, 80vw"
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[82%] w-auto max-w-none -translate-x-1/2 object-contain opacity-40 grayscale [mask-image:radial-gradient(ellipse_48%_62%_at_50%_38%,#000_45%,transparent_100%)]"
        />

        {/* Top corners */}
        <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
          <p className="eyebrow flex items-center gap-2 text-foreground/80">
            <span className="size-1.5 rounded-full bg-brand" aria-hidden />
            {t("heroTopLeft")}
          </p>
          <p className="eyebrow hidden text-right sm:block">{t("heroTopRight")}</p>
        </div>

        {/* Name */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <p className="eyebrow reveal">{t("heroEyebrow")}</p>
          <h1
            className="reveal mt-5 text-[clamp(4.25rem,15vw,10.5rem)] uppercase leading-[0.82] tracking-tight"
            style={style(1)}
          >
            Sanket
            <br />
            <span className="text-foreground/55">Joshi</span>
            <span className="text-brand">.</span>
          </h1>
          <p
            className="reveal mt-7 max-w-md text-[15px] leading-relaxed text-foreground/80"
            style={style(2)}
          >
            {t("heroLine")}
          </p>
          <div className="reveal mt-8 flex flex-wrap justify-center gap-3" style={style(3)}>
            <Link
              href="/projects"
              className="inline-flex h-12 items-center gap-3 rounded-md bg-brand px-5 text-sm font-medium text-brand-foreground transition-transform hover:-translate-y-0.5"
            >
              {t("ctaWork")} <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="/posts"
              className="inline-flex h-12 items-center gap-3 rounded-md border border-foreground/25 bg-background/40 px-5 text-sm font-medium backdrop-blur transition-colors hover:border-foreground/60"
            >
              {t("ctaWriting")} <ArrowUpRight className="size-4" />
            </Link>
          </div>
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
            <ul className="space-y-1.5 font-mono text-xs text-foreground/80">
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
