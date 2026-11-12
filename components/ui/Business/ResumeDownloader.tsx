import { useTranslation } from "next-i18next";
import { DownloadIcon, FileTextIcon } from "@radix-ui/react-icons";
import { RESUME_FILE_NAME, RESUME_PUBLIC_PATH } from "@/lib/constants/resume";

export const ResumeDownloader = () => {
  const { t } = useTranslation("home");

  return (
    <section className="mt-16" data-tour="home-resume">
      <a
        href={RESUME_PUBLIC_PATH}
        download={RESUME_FILE_NAME}
        className="surface surface-hover group relative flex flex-col gap-6 overflow-hidden p-6 sm:flex-row sm:items-center sm:p-8"
      >
        <div
          aria-hidden
          className="absolute -right-16 -top-16 size-48 rounded-full bg-brand/10 blur-2xl transition-opacity group-hover:opacity-100 sm:opacity-60"
        />
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-2 text-white">
          <FileTextIcon className="size-6" />
        </div>
        <div className="relative flex-1">
          <h2 className="text-xl font-semibold">{t("resumeCallTitle")}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {t("resumeCallBody")}
          </p>
        </div>
        <span className="relative inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-full border bg-background px-4 font-mono text-xs transition-colors group-hover:border-brand/60 sm:self-center">
          <DownloadIcon /> {RESUME_FILE_NAME}
        </span>
      </a>
    </section>
  );
};
