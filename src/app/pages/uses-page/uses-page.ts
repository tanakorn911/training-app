import { Component } from '@angular/core';
import { SegmentedNavComponent } from '../../shared/components/segmented-nav-component/segmented-nav-component';

import { FooterComponent } from '../home-page/components/footer-component/footer-component';

@Component({
  selector: 'app-uses-page',
  imports: [SegmentedNavComponent, FooterComponent],
  templateUrl: './uses-page.html',
  styleUrl: './uses-page.css',
})
export class UsesPage {

}
