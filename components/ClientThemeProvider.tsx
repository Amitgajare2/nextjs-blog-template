'use client';

import { ThemeProvider } from './ThemeProvider';

export function ClientThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
