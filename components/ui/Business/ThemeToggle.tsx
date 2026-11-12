import React from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="grid size-10 place-items-center rounded-full border bg-background text-foreground transition-colors hover:bg-accent"
    >
      {isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

export default ThemeToggle;
