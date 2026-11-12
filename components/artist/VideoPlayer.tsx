import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, X } from "lucide-react";
import type { ArtistItem } from "@/lib/data/artist";
import { youtubeInfo } from "@/lib/data/artist";
import { durationBucket, track, trackAttrs } from "@/lib/analytics";
import { useEffect, useRef } from "react";

type Props = {
  item: ArtistItem | null;
  onClose: () => void;
};

/** Plays a YouTube link in a modal, so visitors stay on the page. */
export default function VideoPlayer({ item, onClose }: Props) {
  const video = item ? youtubeInfo(item.url) : null;

  // Watch time: from opening the player to closing it (or leaving the page).
  const openedAt = useRef<number | null>(null);
  useEffect(() => {
    if (!item || !video) return;
    openedAt.current = Date.now();
    const report = () => {
      if (openedAt.current === null) return;
      track("Video watch time", { title: item.title, duration: durationBucket(Date.now() - openedAt.current) });
      openedAt.current = null;
    };
    window.addEventListener("pagehide", report);
    return () => {
      window.removeEventListener("pagehide", report);
      report();
    };
  }, [item, video]);

  return (
    <Dialog.Root open={!!video} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="artist fixed left-1/2 top-1/2 z-50 w-[min(92vw,960px)] -translate-x-1/2 -translate-y-1/2 !overflow-visible !bg-transparent outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
          aria-describedby={undefined}
        >
          <div className="mb-3 flex items-start justify-between gap-4">
            <Dialog.Title className="line-clamp-2 text-base font-bold leading-snug sm:text-lg">
              {item?.title}
            </Dialog.Title>
            <Dialog.Close
              className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              aria-label="Close video"
            >
              <X className="size-5" />
            </Dialog.Close>
          </div>
          {video && (
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-[0_30px_120px_-20px_rgba(255,107,44,0.45)] ring-1 ring-white/10">
              <iframe
                className="absolute inset-0 size-full"
                src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&start=${video.start}`}
                title={item?.title ?? "Video"}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          )}
          {item && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              {...trackAttrs(`Open on YouTube: ${item.title}`)}
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-[var(--s-muted)] transition-colors hover:text-[var(--s-ink)]"
            >
              Open on YouTube <ArrowUpRight className="size-4" />
            </a>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
