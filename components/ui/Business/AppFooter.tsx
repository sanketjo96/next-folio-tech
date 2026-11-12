import React from "react";
import socialMediaLinks from "./SocialIcons";
import { useTranslation } from "next-i18next";

function AppFooter() {
  const { t } = useTranslation("common");
  return (
    <footer className="mt-24 border-t">
      <div className="container flex max-w-5xl flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SJJ LLC. {t("allRightsReserved")}
        </p>
        <div className="flex gap-2">
          {socialMediaLinks.map((link) => (
            <a
              key={link.id}
              role="link"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="grid size-9 place-items-center rounded-full border text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
            >
              {link.icon()}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
