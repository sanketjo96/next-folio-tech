import { useEffect } from "react";
import { useRouter } from "next/router";
import { UMAMI_WEBSITE_ID, track } from "@/lib/analytics";

/**
 * Reports `Seen: <name>` the first time an element marked with
 * `data-track-seen` is 40% visible, or fills 40% of the screen (for sections
 * taller than the screen), once per page view.
 * Shows how far visitors really scroll.
 */
export default function SectionTracker() {
  const { asPath } = useRouter();
  const path = asPath.split(/[?#]/)[0];

  useEffect(() => {
    if (!UMAMI_WEBSITE_ID || typeof IntersectionObserver === "undefined") return;
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const name = (entry.target as HTMLElement).dataset.trackSeen;
          const enough =
            entry.intersectionRatio >= 0.4 ||
            entry.intersectionRect.height >= window.innerHeight * 0.4;
          if (!entry.isIntersecting || !enough || !name || seen.has(name)) continue;
          seen.add(name);
          track(`Seen: ${name}`);
          observer.unobserve(entry.target);
        }
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4] },
    );
    // Wait a frame so the new page's DOM is in place.
    const id = requestAnimationFrame(() =>
      document.querySelectorAll<HTMLElement>("[data-track-seen]").forEach((el) => observer.observe(el)),
    );
    return () => {
      cancelAnimationFrame(id);
      observer.disconnect();
    };
  }, [path]);

  return null;
}
