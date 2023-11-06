'use client';

import { I18nProviderClient } from '@/locales/client';
import type { ReactNode } from 'react';

type ProviderProps = {
  locale: string;
  children: ReactNode;
};

export function I18nProvider({ locale, children }: ProviderProps) {
  return (
    <I18nProviderClient locale={locale} fallback={<p>Loading...</p>}>
      {children}
    </I18nProviderClient>
  );
}
