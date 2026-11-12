import Image from "next/image";
import Link from "next/link";
import React from "react";
import authorImage from "@/public/author_1.png";
import { useTranslation } from "next-i18next";
import { ArrowRightIcon, DownloadIcon } from "@radix-ui/react-icons";
import { RESUME_PUBLIC_PATH, RESUME_FILE_NAME } from "@/lib/constants/resume";

function Introduction() {
  const { t } = useTranslation("home");
  return (
    <section
      className="grid items-center gap-10 pb-6 pt-12 md:grid-cols-[1fr_auto] md:pt-20"
      data-tour="home-intro"
    >
      <div>
        <p className="eyebrow reveal flex items-center gap-2">
          <span className="inline-flex size-2 rounded-full bg-brand" aria-hidden />
          {t("eyebrow")}
        </p>
        <h1
          className="reveal mt-5 text-5xl font-bold leading-[1.02] sm:text-6xl md:text-7xl"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          Hey, I&apos;m <span className="text-gradient">Sanket</span>.
        </h1>
        <p
          className="reveal mt-5 max-w-xl text-lg text-foreground/80 sm:text-xl"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          {t("headline")}
        </p>
        <p
          className="reveal mt-4 max-w-xl leading-relaxed text-muted-foreground"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          {t("intro")}
        </p>
        <div
          className="reveal mt-8 flex flex-wrap gap-3"
          style={{ "--i": 4 } as React.CSSProperties}
        >
          <a
            href={RESUME_PUBLIC_PATH}
            download={RESUME_FILE_NAME}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            <DownloadIcon /> {t("ctaResume")}
          </a>
          <Link
            href="/contacts"
            className="group inline-flex h-11 items-center gap-2 rounded-full border bg-background/60 px-5 text-sm font-medium backdrop-blur transition-colors hover:bg-accent"
          >
            {t("ctaContact")}
            <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <div
        className="reveal relative mx-auto w-44 md:w-60"
        style={{ "--i": 2 } as React.CSSProperties}
      >
        <div
          aria-hidden
          className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand/40 to-brand-2/30 blur-2xl"
        />
        <div className="relative rotate-2 overflow-hidden rounded-[1.75rem] border bg-card p-1.5 shadow-xl transition-transform duration-500 hover:rotate-0">
          <Image
            className="aspect-[4/5] w-full rounded-[1.4rem] bg-gradient-to-br from-brand/90 via-brand-2/70 to-brand/40 object-cover object-top pt-4"
            src={authorImage}
            alt="Sanket Joshi"
            sizes="(min-width: 768px) 240px, 176px"
            priority
          />
        </div>
      </div>
    </section>
  );
}

export default Introduction;
