"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Alternar tema"
      title="Alternar tema"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="grid size-10 place-items-center rounded-full border border-stone-300/70 bg-white/70 text-stone-800 shadow-sm transition hover:border-amber-500 dark:border-stone-700 dark:bg-stone-950/70 dark:text-stone-100"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
