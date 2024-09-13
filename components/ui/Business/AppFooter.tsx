import React from "react";
import socialMediaLinks from "./SocialIcons";

function AppFooter() {
  return (
    <footer className="py-8">
      <div className="flex flex-col items-center">
        <div className="flex justify-center gap-6">
          {socialMediaLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="dark:text-orange-600 hover:text-orange-600"
            >
              {link.icon()}
            </a>
          ))}
        </div>
        <div className="mt-2">
          <p className="text-center text-xs text-muted-foreground">
            {new Date().getFullYear()} SJJ LLC. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
