import { Component, inject, OnInit, signal } from '@angular/core';
import { SegmentedNavComponent } from '../../shared/components/segmented-nav-component/segmented-nav-component';
import { GitHubService, GitHubProfile } from '../../shared/services/github.service';
import { BioComponent } from './components/bio-component/bio-component';
import { JourneyMapComponent } from './components/journey-map-component/journey-map-component';
import { FooterComponent } from '../home-page/components/footer-component/footer-component';

@Component({
  selector: 'app-about-page',
  imports: [SegmentedNavComponent, BioComponent, JourneyMapComponent, FooterComponent],
  templateUrl: './about-page.html',
  styleUrl: './about-page.css',
})
export class AboutPage implements OnInit {
  private readonly githubService = inject(GitHubService);

  profile = signal<GitHubProfile | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    this.githubService.getProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load GitHub profile:', err);
        this.isLoading.set(false);
      }
    });
  }
}
