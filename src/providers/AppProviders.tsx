'use client';

import { QueryProvider } from './QueryProvider';
import { SettingsProvider } from '@/contexts/SettingsContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SettingsProvider>
        {children}
      </SettingsProvider>
    </QueryProvider>
  );
}