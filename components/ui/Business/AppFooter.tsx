import React from "react";
import socialMediaLinks from "./SocialIcons";
import { useTranslation } from "next-i18next";

function AppFooter() {
  const { t } = useTranslation("common");
  return (
    <footer className="py-10">
      <div className="flex flex-col items-center">
        <div className="flex justify-center gap-6">
          {socialMediaLinks.map((link) => (
            <a
              key={link.id}
              role="link"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="dark:text-orange-600 hover:text-orange-600"
            >
              {link.icon()}
            </a>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-center text-xs text-muted-foreground">
            {new Date().getFullYear()} SJJ LLC. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
