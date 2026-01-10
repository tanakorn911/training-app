import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { RatingModule } from 'primeng/rating';
import { Review } from './types';

@Component({
  selector: 'app-review-item-component',
  imports: [AvatarModule, RatingModule, FormsModule],
  templateUrl: './review-item-component.html',
  styleUrl: './review-item-component.css',
})
export class ReviewItemComponent {
  @Input({ required: true }) review!: Review;
}
