import { Component, Input, inject } from '@angular/core';
import { GitHubProfile } from '../../../../shared/services/github.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../shared/services/theme.service';

@Component({
  selector: 'app-bio-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bio-component.html'
})
export class BioComponent {
  @Input() profile: GitHubProfile | null = null;

  private readonly themeService = inject(ThemeService);
  isDarkMode = this.themeService.isDarkMode;

  // Skills from GitHub
  languageSkills = ['HTML', 'CSS', 'JavaScript'];
  webDevSkills = ['Python', 'Django', 'Flask', 'Bootstrap', 'PostgreSQL'];
  exploringSkills = ['React', 'Node.js', 'TailwindCSS', 'Docker', 'Git', 'Linux'];
  aiTools = ['ChatGPT', 'Claude', 'Gemini', 'GitHub Copilot', 'Perplexity'];
}
