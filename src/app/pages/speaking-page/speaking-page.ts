import { Component } from '@angular/core';
import { SegmentedNavComponent } from '../../shared/components/segmented-nav-component/segmented-nav-component';

import { FooterComponent } from '../home-page/components/footer-component/footer-component';

@Component({
  selector: 'app-speaking-page',
  imports: [SegmentedNavComponent, FooterComponent],
  templateUrl: './speaking-page.html',
  styleUrl: './speaking-page.css',
})
export class SpeakingPage {

}
