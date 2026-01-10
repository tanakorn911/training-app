import { Component, inject } from '@angular/core';
import { SegmentedNavItem } from './types';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { ThemeService } from '../../services/theme.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-segmented-nav-component',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './segmented-nav-component.html',
  styleUrls: ['./segmented-nav-component.css'],
})
export class SegmentedNavComponent {
  private readonly themeService = inject(ThemeService);

  isDarkMode = this.themeService.isDarkMode;

  navItems: SegmentedNavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Articles', href: '/article' },
    { label: 'Projects', href: '/project' },
    { label: 'Speaking', href: '/speaking' },
    { label: 'Uses', href: '/uses' },
  ];

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}