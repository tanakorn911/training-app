import { Component, Input } from '@angular/core';
import { GitHubProfile } from '../../../../shared/services/github.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bio-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 shadow-sm">
      <div class="flex flex-col items-center sm:flex-row sm:items-start gap-6">
        <!-- Avatar -->
        <div class="shrink-0">
          <img
            [src]="profile?.avatar_url"
            [alt]="profile?.name"
            class="h-32 w-32 rounded-full ring-4 ring-white dark:ring-zinc-700 shadow-lg object-cover"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 text-center sm:text-left space-y-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-zinc-100">
              {{ profile?.name }}
            </h1>
            <a
              [href]="profile?.html_url"
              target="_blank"
              class="text-sm text-gray-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              @{{ profile?.login }}
            </a>
          </div>

          <p class="text-gray-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
            {{ profile?.bio }}
          </p>

          <!-- Stats -->
          <div class="flex flex-wrap justify-center sm:justify-start gap-6 pt-2">
            <div class="flex items-center gap-2">
              <span class="text-2xl font-bold text-gray-900 dark:text-zinc-100">{{ profile?.public_repos }}</span>
              <span class="text-sm text-gray-500 dark:text-zinc-400">Repositories</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-2xl font-bold text-gray-900 dark:text-zinc-100">{{ profile?.followers }}</span>
              <span class="text-sm text-gray-500 dark:text-zinc-400">Followers</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-2xl font-bold text-gray-900 dark:text-zinc-100">{{ profile?.following }}</span>
              <span class="text-sm text-gray-500 dark:text-zinc-400">Following</span>
            </div>
          </div>
          
           <!-- Location & Blog -->
           <div class="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-500 dark:text-zinc-400 pt-2">
            <div *ngIf="profile?.location" class="flex items-center gap-1">
               <i class="pi pi-map-marker"></i>
               <span>{{ profile?.location }}</span>
            </div>
             <a *ngIf="profile?.blog" [href]="profile?.blog" target="_blank" class="flex items-center gap-1 hover:text-blue-600 transition-colors">
               <i class="pi pi-link"></i>
               <span>Website</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BioComponent {
  @Input() profile: GitHubProfile | null = null;
}
