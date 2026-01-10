import { Component, computed, input } from '@angular/core';
import { Review } from '../review-item-component/types';
import { ReviewSummary } from './types';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-review-summary-component',
  imports: [RatingModule, FormsModule, ProgressBarModule],
  templateUrl: './review-summary-component.html',
  styleUrl: './review-summary-component.css',
})
export class ReviewSummaryComponent {
  reviews = input<Review[]>([]);

  summary = computed<ReviewSummary>(() => {
    const reviewList = this.reviews();
    const total = reviewList.length;

    if (total === 0) {
      return {
        avgRating: 0,
        percent5Star: 0,
        percent4Star: 0,
        percent3Star: 0,
        percent2Star: 0,
        percent1Star: 0,
        totalReviews: 0,
      };
    }

    const sum = reviewList.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = Math.round((sum / total) * 10) / 10;

    const count5 = reviewList.filter(r => r.rating === 5).length;
    const count4 = reviewList.filter(r => r.rating === 4).length;
    const count3 = reviewList.filter(r => r.rating === 3).length;
    const count2 = reviewList.filter(r => r.rating === 2).length;
    const count1 = reviewList.filter(r => r.rating === 1).length;

    return {
      avgRating,
      percent5Star: Math.round((count5 / total) * 100),
      percent4Star: Math.round((count4 / total) * 100),
      percent3Star: Math.round((count3 / total) * 100),
      percent2Star: Math.round((count2 / total) * 100),
      percent1Star: Math.round((count1 / total) * 100),
      totalReviews: total,
    };
  });

  // Helper array for rendering rating bars in template
  ratingBars = computed(() => [
    { star: 5, percentage: this.summary().percent5Star },
    { star: 4, percentage: this.summary().percent4Star },
    { star: 3, percentage: this.summary().percent3Star },
    { star: 2, percentage: this.summary().percent2Star },
    { star: 1, percentage: this.summary().percent1Star },
  ]);
}
