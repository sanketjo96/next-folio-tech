import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ui/Business/ThemeToggle";

export const SideControls = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex items-center gap-2" data-tour="theme-toggle">
      {/* Full page load on purpose: the artist page renders without the
          tech-site layout. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/artist"
        className="hidden items-center gap-2 font-medium text-[11px] text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
      >
        <span className="size-1.5 rounded-full bg-brand" aria-hidden />
        Artist side ↗
      </a>
      {isMounted ? <ThemeToggle /> : <span className="size-10" aria-hidden />}
    </div>
  );
};
