import { Component } from '@angular/core';
import { SegmentedNavComponent } from '../../shared/components/segmented-nav-component/segmented-nav-component';

import { FooterComponent } from '../home-page/components/footer-component/footer-component';

@Component({
  selector: 'app-project-page',
  imports: [SegmentedNavComponent, FooterComponent],
  templateUrl: './project-page.html',
  styleUrl: './project-page.css',
})
export class ProjectPage {

}
