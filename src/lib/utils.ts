import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getGreeting = (email: string | null | undefined) => {
  const emailGreetings: Record<string, string> = {
    'snehashindee.04@gmail.com': 'Ayee Chiknii 🫦',
    'snehaashinde04@gmail.com': 'Ayee Chiknii 🫦',
    'shreya.svg19@gmail.com': 'Ayeee Chaprii 🌈',
  };

  return email ? emailGreetings[email] || null : null;
};

