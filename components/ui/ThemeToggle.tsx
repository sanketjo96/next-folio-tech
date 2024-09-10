import React from "react";
import { Button } from "./button";
import { useTheme } from "next-themes";
import { SunIcon } from "@radix-ui/react-icons";
import { MoonIcon } from "lucide-react";

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }}
    >
      {resolvedTheme === "dark" ? (
        <SunIcon className="size-4 text-orange-300"></SunIcon>
      ) : (
        <MoonIcon className="size-4 text-sky-950"></MoonIcon>
      )}
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
}

export default ThemeToggle;
