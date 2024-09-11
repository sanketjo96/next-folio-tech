import Link from "next/link";
import React, { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function AppHeader() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="py-6 z-50">
      <nav className="container max-w-3xl flex justify-between items-center">
        <div className="font-serif text-4xl font-bold">
          <Link href="/">SSJ</Link>
        </div>

        <ul className="flex items-center gap-6 font-light">
          <li className="transition-colors hover: text-foreground">
            <Link href="/posts">Post</Link>
          </li>
          <li className="hover: text-foreground">
            <Link href="/projects">Projects</Link>
          </li>
          <li className="hover: text-foreground">
            <Link href="/contacts">Contact</Link>
          </li>
        </ul>
        <div>{isMounted && <ThemeToggle></ThemeToggle>}</div>
      </nav>
    </header>
  );
}
