import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    day: "numeric",
    month: "long",
    year: "numeric"
  })
}