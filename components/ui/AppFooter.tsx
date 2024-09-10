import React from "react";
import socialMediaLinks from "./SocialIcons";

function AppFooter() {
  return (
    <footer className="py-8">
      <div className="flex flex-col items-center container">
        <div className="flex justify-center gap-6">
          {socialMediaLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <link.icon />
            </a>
          ))}
        </div>
        <div className="mt-8">
          <p className="text-center">
            {new Date().getFullYear()} SJJ LLC. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
