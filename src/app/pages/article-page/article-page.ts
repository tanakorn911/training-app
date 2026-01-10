import { Component, inject, OnInit, signal } from '@angular/core';
import { SegmentedNavComponent } from '../../shared/components/segmented-nav-component/segmented-nav-component';
import { ReviewItemComponent } from './components/review-item-component/review-item-component';
import { ReviewSummaryComponent } from './components/review-summary-component/review-summary-component';
import { WriteReviewComponent } from './components/write-review-component/write-review-component';
import { ArticleService } from './article-service';
import { Review } from './components/review-item-component/types';
import { ThemeService } from '../../shared/services/theme.service';

import { FooterComponent } from '../home-page/components/footer-component/footer-component';

@Component({
  selector: 'app-article-page',
  imports: [SegmentedNavComponent, ReviewItemComponent, ReviewSummaryComponent, WriteReviewComponent, FooterComponent],
  templateUrl: './article-page.html',
  styleUrl: './article-page.css',
})
export class ArticlePage implements OnInit {
  private readonly articleService = inject(ArticleService);
  private readonly themeService = inject(ThemeService);
  isDarkMode = this.themeService.isDarkMode;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  
  reviews = signal<Review[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.articleService.getReviews().subscribe({
      next: (data: Review[]) => {
        this.reviews.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load reviews:', err);
        this.isLoading.set(false);
      }
    });
  }
}
