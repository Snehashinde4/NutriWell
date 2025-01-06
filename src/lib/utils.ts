import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getGreeting = (email: string | null | undefined) => {
  const emailGreetings: Record<string, string> = {
    'shreya.svg19@gmail.com': 'Ayeee Chaprii 🌈',
  };

  return email ? emailGreetings[email] || null : null;
};

