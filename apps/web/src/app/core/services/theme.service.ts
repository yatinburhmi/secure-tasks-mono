import {
  Injectable,
  signal,
  WritableSignal,
  effect,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';
const THEME_STORAGE_KEY = 'app-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isBrowser: boolean;
  public currentTheme: WritableSignal<Theme>;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    const initialTheme = this.loadThemeFromStorage();
    this.currentTheme = signal<Theme>(initialTheme);

    // Effect to update HTML class and localStorage when theme changes
    effect(() => {
      const theme = this.currentTheme();
      if (this.isBrowser) {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      }
    });
  }

  private loadThemeFromStorage(): Theme {
    if (!this.isBrowser) {
      return 'light'; // Default for SSR or non-browser environments
    }

    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (storedTheme) {
      return storedTheme;
    }

    // If no stored theme, check system preference
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }

    return 'light'; // Default to light if no preference or storage
  }

  public setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  public toggleTheme(): void {
    this.currentTheme.update((prevTheme) =>
      prevTheme === 'light' ? 'dark' : 'light'
    );
  }
}
