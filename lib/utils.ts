import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name?: string | null) {
  if (!name) return "JM";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function readingStatusLabel(status?: string | null) {
  const labels: Record<string, string> = {
    WANT_TO_READ: "Quero ler",
    READING: "Lendo",
    READ: "Lido",
  };
  return status ? labels[status] ?? status : "Adicionar";
}
