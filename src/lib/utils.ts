import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function formatDateToUpdate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const offset = date.getTimezoneOffset();
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const timezone = `${sign}${String(Math.floor(absOffset / 60)).padStart(
    2,
    "0"
  )}:${String(absOffset % 60).padStart(2, "0")}`;

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}${timezone}`;
}
