import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getToken() {
  if (typeof window !== 'undefined') {
    const localToken = localStorage.getItem('token');
    if (localToken) return localToken;
  }
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
  return match ? match[2] : null;
}
