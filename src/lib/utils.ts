
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFullName = (person: { firstName: string; lastName: string }) => {
  return `${person.firstName} ${person.lastName}`;
};
