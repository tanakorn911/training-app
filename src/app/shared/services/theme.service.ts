import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  isDarkMode = signal(false);

  constructor() {
    // 1. Initialize State
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      this.isDarkMode.set(systemPrefersDark.matches);
    }

    // 2. Listen for System Changes
    // When the system theme changes, we update the app state immediately.
    // We also update localStorage so the new preference persists.
    systemPrefersDark.addEventListener('change', (e) => {
      const isDark = e.matches;
      this.isDarkMode.set(isDark);
      localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
    });

    // 3. Effect: Apply Class & Update Meta Theme Color
    effect(() => {
      const isDark = this.isDarkMode();
      const html = document.documentElement;
      
      // Update HTML Class
      if (isDark) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }

      // Update Browser Toolbar Color (Chrome/Mobile)
      this.updateMetaThemeColor(isDark);
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update((current: boolean) => !current);
    const isDark = this.isDarkMode();
    
    // Save preference
    localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
  }

  private updateMetaThemeColor(isDark: boolean): void {
    // Zinc-900 (#18181b) for Dark, White (#ffffff) for Light
    const color = isDark ? '#18181b' : '#ffffff';
    
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', color);
  }
}
