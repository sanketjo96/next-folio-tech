import Link from "next/link";
import { useEffect } from "react";
import { NextSeo } from "next-seo";
import { track } from "@/lib/analytics";

/** Not-found page; reports the missing path so broken links show up in analytics. */
export default function NotFound() {
  useEffect(() => {
    track("Page not found", { path: window.location.pathname });
  }, []);

  return (
    <section className="container flex max-w-3xl flex-col items-center py-32 text-center">
      <NextSeo title="Page not found · Sanket Joshi" noindex nofollow />
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">This page doesn&apos;t exist</h1>
      <p className="mt-4 text-muted-foreground">The link may be old or mistyped.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-md bg-brand px-5 py-3 text-sm font-medium text-brand-foreground">
          Go to the home page
        </Link>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/artist" className="rounded-md border px-5 py-3 text-sm font-medium">
          Artist side
        </a>
      </div>
    </section>
  );
}
