import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'countries-theme';

  readonly theme = signal<Theme>('light');

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.initializeTheme();
  }

  toggle(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private initializeTheme(): void {
    const savedTheme = this.getStoredTheme();

    if (savedTheme) {
      this.setTheme(savedTheme, false);
      return;
    }

    const preferredTheme = this.getSystemPreferredTheme();
    this.setTheme(preferredTheme, false);
  }

  private setTheme(theme: Theme, persist = true): void {
    this.theme.set(theme);
    this.document.documentElement.setAttribute('data-theme', theme);

    if (!persist) {
      return;
    }

    try {
      localStorage.setItem(this.storageKey, theme);
    } catch {
      // Ignore storage write failures in restricted environments.
    }
  }

  private getStoredTheme(): Theme | null {
    try {
      const value = localStorage.getItem(this.storageKey);
      return value === 'light' || value === 'dark' ? value : null;
    } catch {
      return null;
    }
  }

  private getSystemPreferredTheme(): Theme {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
}
