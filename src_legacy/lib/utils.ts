﻿import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class strings safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
