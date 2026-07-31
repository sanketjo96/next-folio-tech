import { useEffect, useRef } from "react";
import { useRouter, type NextRouter } from "next/router";
import { driver, type DriveStep, type DriverHook } from "driver.js";

// Master switch — the tour is entirely inert unless this env var is "true".
const TOUR_ENABLED = process.env.NEXT_PUBLIC_ENABLE_SITE_TOUR === "true";

// The tour highlights the desktop nav, which is hidden on small screens.
const DESKTOP_QUERY = "(min-width: 768px)";

const SEEN_STORAGE_KEY = "techsanket-tour-seen";
const RESUME_STORAGE_KEY = "techsanket-tour-resume-index";
// Append ?tour=1 to the homepage URL to replay the tour regardless of seen state.
const FORCE_REPLAY_PARAM = "tour";

type TourPage = {
  path: string;
  label: string;
  steps: DriveStep[];
};

const TOUR_PAGES: TourPage[] = [
  {
    path: "/",
    label: "Home",
    steps: [
      {
        element: '[data-tour="nav-brand"]',
        popover: {
          title: "Welcome to Sanket's portfolio 👋",
          description:
            "Here's a quick tour of the site — close this anytime, it won't show again.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: '[data-tour="home-intro"]',
        popover: {
          title: "A bit about me",
          description: "Frontend/full-stack engineer — React, Node.js and AWS.",
          side: "bottom",
        },
      },
      {
        element: '[data-tour="home-resume"]',
        popover: {
          title: "Grab the resume",
          description: "You can download an up-to-date copy of my resume any time.",
          side: "top",
        },
      },
      {
        element: '[data-tour="home-skills"]',
        popover: {
          title: "Tech & skills",
          description: "A quick rundown of the tools and technologies I work with most.",
          side: "top",
        },
      },
      {
        element: '[data-tour="nav-projects"]',
        popover: {
          title: "Projects",
          description: "Let's head over and look at a few things I've built.",
          side: "bottom",
        },
      },
    ],
  },
  {
    path: "/projects",
    label: "Projects",
    steps: [
      {
        element: '[data-tour="projects-list"]',
        popover: {
          title: "Featured projects",
          description: "Browse and filter through real projects I've delivered.",
          side: "top",
        },
      },
      {
        element: '[data-tour="nav-posts"]',
        popover: {
          title: "Posts",
          description: "Next, a look at what I've been writing about.",
          side: "bottom",
        },
      },
    ],
  },
  {
    path: "/posts",
    label: "Posts",
    steps: [
      {
        element: '[data-tour="posts-list"]',
        popover: {
          title: "Blog & posts",
          description: "Notes on frontend, Node.js, AWS and everything in between.",
          side: "top",
        },
      },
      {
        element: '[data-tour="nav-contacts"]',
        popover: {
          title: "Contact",
          description: "Last stop — here's how to reach me.",
          side: "bottom",
        },
      },
    ],
  },
  {
    path: "/contacts",
    label: "Contact",
    steps: [
      {
        element: '[data-tour="contact-form"]',
        popover: {
          title: "Let's connect",
          description: "Send a message straight from this form and I'll get back to you.",
          side: "top",
        },
      },
      {
        element: '[data-tour="theme-toggle"]',
        popover: {
          title: "Light or dark, your call",
          description: "That's the tour! Toggle the theme here anytime. Thanks for stopping by.",
          side: "bottom",
        },
      },
    ],
  },
];

function hasSeenTour(): boolean {
  try {
    return window.localStorage.getItem(SEEN_STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

function markTourSeen(): void {
  try {
    window.localStorage.setItem(SEEN_STORAGE_KEY, "1");
  } catch {
    // ignore (private-mode storage access can throw)
  }
}

function getResumeIndex(): number | null {
  try {
    const raw = window.sessionStorage.getItem(RESUME_STORAGE_KEY);
    return raw === null ? null : Number(raw);
  } catch {
    return null;
  }
}

function setResumeIndex(index: number): void {
  try {
    window.sessionStorage.setItem(RESUME_STORAGE_KEY, String(index));
  } catch {
    // ignore
  }
}

function clearResumeIndex(): void {
  try {
    window.sessionStorage.removeItem(RESUME_STORAGE_KEY);
  } catch {
    // ignore
  }
}

// Client-side navigation can render the next page a tick after routeChangeComplete fires,
// so poll briefly for the anchor element instead of assuming it's already in the DOM.
function waitForElement(selector: string, timeoutMs = 4000): Promise<Element | null> {
  return new Promise((resolve) => {
    const existing = document.querySelector(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      resolve(document.querySelector(selector));
    }, timeoutMs);
  });
}

async function runPageTour(pageIndex: number, router: NextRouter): Promise<void> {
  const page = TOUR_PAGES[pageIndex];
  const firstSelector = page.steps[0]?.element;
  if (typeof firstSelector === "string") {
    const found = await waitForElement(firstSelector);
    if (!found) return;
  }

  const isLastPage = pageIndex === TOUR_PAGES.length - 1;
  // Distinguishes "we're navigating to the next leg of the tour" from a real
  // user-initiated close (X button, overlay click, Escape) inside onDestroyed below.
  let leavingIntentionally = false;

  const steps = page.steps.map((step, i) => {
    const isLastStepOnPage = i === page.steps.length - 1;
    if (!isLastStepOnPage || !step.popover) return step;

    if (isLastPage) {
      const onDoneClick: DriverHook = (_el, _s, opts) => {
        leavingIntentionally = true;
        markTourSeen();
        clearResumeIndex();
        opts.driver.destroy();
      };
      return {
        ...step,
        popover: {
          ...step.popover,
          doneBtnText: step.popover.doneBtnText ?? "Done",
          onDoneClick,
        },
      };
    }

    const nextPage = TOUR_PAGES[pageIndex + 1];
    const onNextClick: DriverHook = (_el, _s, opts) => {
      leavingIntentionally = true;
      setResumeIndex(pageIndex + 1);
      opts.driver.destroy();
      router.push(nextPage.path);
    };
    return {
      ...step,
      popover: {
        ...step.popover,
        nextBtnText: step.popover.nextBtnText ?? `Next: ${nextPage.label} →`,
        onNextClick,
      },
    };
  });

  const tourDriver = driver({
    showProgress: true,
    allowClose: true,
    overlayOpacity: 0.55,
    stagePadding: 6,
    steps,
    onDestroyed: () => {
      if (!leavingIntentionally) {
        markTourSeen();
        clearResumeIndex();
      }
    },
  });

  tourDriver.drive();
}

function attemptTourStep(router: NextRouter): void {
  if (!window.matchMedia(DESKTOP_QUERY).matches) return;

  const forceReplay =
    new URLSearchParams(window.location.search).get(FORCE_REPLAY_PARAM) === "1";
  if (forceReplay) clearResumeIndex();
  if (!forceReplay && hasSeenTour()) return;

  const resumeIndex = getResumeIndex();
  const currentPath = router.pathname;

  if (resumeIndex === null) {
    if (TOUR_PAGES[0].path !== currentPath) return; // only auto-start from the homepage
    runPageTour(0, router);
    return;
  }

  const page = TOUR_PAGES[resumeIndex];
  if (page && page.path === currentPath) {
    runPageTour(resumeIndex, router);
  }
}

/**
 * Drives an auto-starting, multi-page product tour across the site's main pages.
 * No-op unless NEXT_PUBLIC_ENABLE_SITE_TOUR=true. Call once from _app.tsx.
 */
export function useSiteTour(): void {
  const router = useRouter();
  const hasBootstrapped = useRef(false);

  useEffect(() => {
    if (!TOUR_ENABLED || !router.isReady || hasBootstrapped.current) return;
    hasBootstrapped.current = true;
    attemptTourStep(router);
  }, [router, router.isReady]);

  useEffect(() => {
    if (!TOUR_ENABLED) return;
    const onRouteChangeComplete = () => attemptTourStep(router);
    router.events.on("routeChangeComplete", onRouteChangeComplete);
    return () => router.events.off("routeChangeComplete", onRouteChangeComplete);
  }, [router]);
}
