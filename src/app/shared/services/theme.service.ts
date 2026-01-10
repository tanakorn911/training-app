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
      // ถ้าเคยเซฟไว้ ให้ยึดตามที่เซฟ (ไม่สน System)
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      // ถ้าไม่เคยเซฟ ให้ใช้ค่า System ปัจจุบัน
      this.isDarkMode.set(systemPrefersDark.matches);
    }

    // 2. Listen for System Changes
    // แก้ไข: เปลี่ยนตาม System เฉพาะเมื่อ "ไม่มี" การเซฟค่าไว้ (โหมด Auto)
    systemPrefersDark.addEventListener('change', (e) => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.isDarkMode.set(e.matches);
      }
    });

    // 3. Effect: Apply Class & Update Meta Theme Color
    effect(() => {
      const isDark = this.isDarkMode();
      const html = document.documentElement;
      
      if (isDark) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }

      this.updateMetaThemeColor(isDark);
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update((current) => !current);
    const isDark = this.isDarkMode();
    
    // เมื่อกดปุ่มเอง ถือว่าเป็นการ Manual Override -> บันทึกลง localStorage
    localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
  }

  private updateMetaThemeColor(isDark: boolean): void {
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