import { RefObject, useEffect } from "react";
import { UMAMI_WEBSITE_ID, readTimeBucket, track } from "@/lib/analytics";

const MILESTONES = [25, 50, 75, 100];

type PostReadTrackerProps = {
  /** Post id (the file name), sent with every event so the dashboard can filter by post. */
  post: string;
  /** The element that holds the post body; read depth is measured against it. */
  articleRef: RefObject<HTMLElement | null>;
};

/**
 * Reader analytics for a post page, reported to Umami:
 * - `Post: Read 25%` … `Post: Read 100%` as the reader scrolls through the article
 * - `Post: Time on page` once, when the reader leaves or hides the tab (bucketed)
 * - `Post: Copied code` when text is copied from a code block
 */
export default function PostReadTracker({ post, articleRef }: PostReadTrackerProps) {
  useEffect(() => {
    if (!UMAMI_WEBSITE_ID) return;
    const article = articleRef.current;
    if (!article) return;

    const start = Date.now();
    const reached = new Set<number>();
    let frame = 0;
    let timeSent = false;

    const measure = () => {
      frame = 0;
      const rect = article.getBoundingClientRect();
      if (rect.height <= 0) return;
      // Share of the article that has scrolled into view so far.
      const pct = Math.min(100, ((window.innerHeight - rect.top) / rect.height) * 100);
      for (const m of MILESTONES) {
        if (pct >= m && !reached.has(m)) {
          reached.add(m);
          track(`Post: Read ${m}%`, { post });
        }
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    const sendTime = () => {
      if (timeSent) return;
      timeSent = true;
      track("Post: Time on page", {
        post,
        time: readTimeBucket(Date.now() - start),
        read: `${Math.max(0, ...reached)}%`,
      });
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") sendTime();
    };

    const onCopy = () => {
      const node = window.getSelection()?.anchorNode;
      const el = node instanceof Element ? node : node?.parentElement;
      if (el?.closest("pre") && article.contains(el)) track("Post: Copied code", { post });
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("copy", onCopy);
    return () => {
      sendTime(); // client-side navigation away from the post
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("copy", onCopy);
    };
  }, [post, articleRef]);

  return null;
}
