import React from "react";
import socialMediaLinks from "./SocialIcons";
import { useTranslation } from "next-i18next";
import { ArrowUp } from "lucide-react";
import { trackAttrs } from "@/lib/analytics";

function AppFooter() {
  const { t } = useTranslation("common");
  return (
    <footer className="container mt-32 max-w-6xl">
      <div className="flex flex-col gap-6 border-t py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <span className="font-medium text-lg font-semibold">
            sj<span className="text-brand">_</span>
          </span>
          <p className="text-sm text-muted-foreground">Build carefully. Share openly.</p>
        </div>
        <div className="flex gap-2">
          {socialMediaLinks.map((link) => (
            <a
              key={link.id}
              role="link"
              href={link.url}
              {...trackAttrs(`Social: ${link.name}`, { page: "tech", place: "footer" })}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="grid size-9 place-items-center rounded-md border text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
            >
              {link.icon()}
            </a>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between pb-10 font-medium text-[11px] text-muted-foreground">
        <p>
          © {new Date().getFullYear()} SJJ LLC. {t("allRightsReserved")}
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-1.5 hover:text-foreground"
        >
          Back to top <ArrowUp className="size-3" />
        </button>
      </div>
    </footer>
  );
}

export default AppFooter;
