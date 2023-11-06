import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getQueryClient = cache(() => new QueryClient());
export default getQueryClient;
