import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ui/Business/ThemeToggle";

export const SideControls = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex items-center gap-2" data-tour="theme-toggle">
      {/* Full page load on purpose: `/?artist` is resolved by a server-side
          rewrite in middleware.ts and renders a different page shell. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/?artist"
        className="hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground sm:inline-flex"
      >
        <span aria-hidden>✦</span> Artist side
      </a>
      {isMounted ? <ThemeToggle /> : <span className="size-10" aria-hidden />}
    </div>
  );
};
